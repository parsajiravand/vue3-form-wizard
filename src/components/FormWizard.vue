<template>
  <div
    :id="wizardId"
    class="vue-form-wizard"
    :class="[
      stepSize,
      {
        vertical: isVertical,
        'fw-rtl-content': rtl,
        'fw-horizontal-reverse': reverseHorizontal,
      },
    ]"
    @keyup.right="onArrowRight"
    @keyup.left="onArrowLeft"
  >
    <div class="wizard-header" v-if="$slots['title']">
      <slot name="title">
        <h4 class="wizard-title">{{ title }}</h4>
        <p class="category">{{ subtitle }}</p>
      </slot>
    </div>
    <div class="wizard-navigation">
      <div class="wizard-progress-with-circle" v-if="!isVertical">
        <div class="wizard-progress-bar" :style="progressBarStyle"></div>
      </div>
      <ul
        class="wizard-nav wizard-nav-pills"
        role="tablist"
        :class="[stepsClasses, { 'fw-steps-reverse': reverseHorizontal }]"
      >
        <slot
          name="step"
          v-for="(tab, index) in tabs"
          :tab="tab"
          :index="index"
          :navigate-to-tab="navigateToTab"
          :step-size="stepSize"
          :transition="transition"
        >
          <wizard-step
            :tab="tab"
            :step-size="stepSize"
            @click="
              disableBackOnClickStep || disableBack
                ? false
                : navigateToTab(index)
            "
            @keyup.enter="navigateToTab(index)"
            @keydown.space.prevent
            @keyup.space="
              disableBackOnClickStep || disableBack
                ? false
                : navigateToTab(index)
            "
            :transition="transition"
            :index="index"
            :disable-back-on-click-step="
              disableBack ? true : disableBackOnClickStep
            "
          >
          </wizard-step>
        </slot>
      </ul>
      <div class="wizard-tab-content">
        <!-- Schema mode: render active step component if provided -->
        <template v-if="schema && schemaComponents && currentSchemaComponent">
          <component
            :is="currentSchemaComponent"
            :data="wizardData"
            :update-data="updateWizardData"
          />
        </template>

        <!-- Classic mode, or when no schema / component is found -->
        <slot v-else v-bind="slotProps">
        </slot>
      </div>
    </div>

    <div class="wizard-card-footer clearfix" v-if="!hideButtons">
      <slot name="footer" v-bind="slotProps">
        <div class="wizard-footer-left" v-if="!disableBack">
          <span
            @click="prevTab"
            @keyup.enter="prevTab"
            @keydown.space.prevent
            @keyup.space="prevTab"
            v-if="displayPrevButton"
            role="button"
            tabindex="0"
          >
            <slot name="prev" v-bind="slotProps">
              <wizard-button :style="fillButtonStyle" :disabled="loading">
                {{ backButtonText }}
              </wizard-button>
            </slot>
          </span>
          <slot name="custom-buttons-left" v-bind="slotProps"></slot>
        </div>

        <div class="wizard-footer-right">
          <slot name="custom-buttons-right" v-bind="slotProps"></slot>
          <span
            @click="nextTab"
            @keyup.enter="nextTab"
            @keydown.space.prevent
            @keyup.space="nextTab"
            v-if="isLastStep"
            role="button"
            tabindex="0"
          >
            <slot name="finish" v-bind="slotProps">
              <wizard-button :style="fillButtonStyle" :disabled="loading">
                {{ finishButtonText }}
              </wizard-button>
            </slot>
          </span>
          <span
            @click="nextTab"
            @keyup.enter="nextTab"
            @keydown.space.prevent
            @keyup.space="nextTab"
            role="button"
            tabindex="0"
            v-else
          >
            <slot name="next" v-bind="slotProps">
              <wizard-button :style="fillButtonStyle" :disabled="loading">
                {{ nextButtonText }}
              </wizard-button>
            </slot>
          </span>
        </div>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, provide, getCurrentInstance, markRaw, toRaw, nextTick } from 'vue'
import type { FormWizardSchema, WizardData } from "../types";
import { default as WizardButton } from "./WizardButton.vue";
import { default as WizardStep } from "./WizardStep.vue";
import {
  isPromise,
  findElementAndFocus,
  getFocusedTabIndex,
  nextWizardId,
  slugifyTabTitle,
} from "./helpers.js";


interface Tab {
  tabId: string;
  title: string;
  active: boolean;
  checked: boolean;
  validationError: string | null;
  beforeChange?: () => boolean | Promise<boolean>;
  afterChange?: () => void;
  route?: string | object;
  color: string;
  errorColor: string;
  shape: string;
  icon?: string;
  customIcon?: string;
  updateActiveState?: (active: boolean, tabId?: string) => void;
  /** Identity of the registering <tab-content>, used to unregister it. */
  uid?: number;
  /** DOM anchor of the registering <tab-content>, used to keep step order. */
  el?: Node | null;
}

/** Registration details supplied by <tab-content> when it mounts. */
interface TabMeta {
  uid?: number;
  el?: Node | null;
}



const props = withDefaults(defineProps<{
  id?: string;
  title?: string;
  subtitle?: string;
  nextButtonText?: string;
  backButtonText?: string;
  finishButtonText?: string;
  hideButtons?: boolean;
  validateOnBack?: boolean;
  color?: string;
  errorColor?: string;
  shape?: string;
  layout?: string;
  stepsClasses?: string | string[];
  stepSize?: 'xs' | 'sm' | 'md' | 'lg';
  transition?: string;
  startIndex?: number;
  disableBackOnClickStep?: boolean;
  disableBack?: boolean;
  schema?: FormWizardSchema;
  modelValue?: WizardData;
  schemaComponents?: Record<string, any>;
  rtl?: boolean;
  // Reverse horizontal layout: steps and footer buttons
  reverseHorizontal?: boolean;
}>(), {
  id: undefined,
  title: "Awesome Wizard",
  subtitle: "Split a complicated flow in multiple steps",
  nextButtonText: "Next",
  backButtonText: "Back",
  finishButtonText: "Finish",
  hideButtons: false,
  validateOnBack: false,
  color: "#e74c3c",
  errorColor: "#8b0000",
  shape: "circle",
  layout: "horizontal",
  stepsClasses: "",
  stepSize: "md",
  transition: "",
  startIndex: 0,
  disableBackOnClickStep: false,
  disableBack: false,
  rtl: false,
  reverseHorizontal: false,
});

const internalWizardId = nextWizardId();

// Generate ID if not provided (stable per instance in a given runtime)
const wizardId = computed(() => props.id || internalWizardId);

const emit = defineEmits({
  'on-change': (prevIndex: number, nextIndex: number) => true,
  'update:startIndex': (index: number) => true,
  'on-complete': () => true,
  'on-loading': (loading: boolean) => true,
  'on-error': (error: any) => true,
  'on-validate': (result: boolean, index: number) => true,
  'update:modelValue': (data: WizardData) => true,
});

// Reactive state
const activeTabIndex = ref(0);
const maxStep = ref(0);
const loading = ref(false);
const tabs = ref<Tab[]>([]);

// Shared wizard data (used in schema mode and optionally in classic mode)
const wizardData = ref<WizardData>({
  ...(props.schema?.initialData || {}),
  ...(props.modelValue || {}),
});

const updateWizardData = (partial: Record<string, any>) => {
  wizardData.value = {
    ...wizardData.value,
    ...partial,
  };
  emit("update:modelValue", wizardData.value);
};

// Schema mode helpers
const useSchemaMode = computed(() => !!props.schema);
const rawSchemaSteps = computed(() => props.schema?.steps || []);

const visibleSchemaSteps = computed(() => {
  if (!props.schema) return [];

  return rawSchemaSteps.value.filter((step, index) => {
    if (!step.condition) return true;

    const ctx = {
      data: wizardData.value,
      stepId: step.id,
      index,
    };

    const result = step.condition(ctx);

    if (isPromise(result)) {
      // For v1 keep it simple: async conditions are treated as truthy by default,
      // and should be expressed via validate instead.
      return true;
    }

    return result === true;
  });
});

const currentSchemaStep = computed(() => {
  if (!useSchemaMode.value) return null;
  return visibleSchemaSteps.value[activeTabIndex.value] || null;
});

const currentSchemaComponent = computed(() => {
  const step = currentSchemaStep.value;
  if (!step || !props.schemaComponents) return null;

  const key = step.component || step.id;
  const component = props.schemaComponents[key];

  // Components arrive through a reactive prop; hand Vue the raw definition so
  // it does not warn about (and pay for) proxying a component.
  return component ? markRaw(toRaw(component)) : null;
});

// Store component instance and router references for later use
let componentInstance: any = getCurrentInstance();
let routerInstance: any = null;

// Keep wizardData in sync when modelValue is controlled from the parent
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      wizardData.value = { ...newVal };
    }
  }
);

const resolveRouterInstance = () => {
  if (!componentInstance) {
    componentInstance = getCurrentInstance();
  }

  if (routerInstance || !componentInstance) {
    return routerInstance;
  }

  const appContext = componentInstance.appContext;

  // Try multiple ways to access the router
  if (appContext?.config?.globalProperties?.$router) {
    routerInstance = appContext.config.globalProperties.$router;
  } else if (componentInstance.proxy && (componentInstance.proxy as any).$router) {
    routerInstance = (componentInstance.proxy as any).$router;
  } else if (appContext?.app && (appContext.app as any).$router) {
    routerInstance = (appContext.app as any).$router;
  } else if (componentInstance.provides && (componentInstance.provides as any).$router) {
    routerInstance = (componentInstance.provides as any).$router;
  } else if (componentInstance.parent?.provides && (componentInstance.parent.provides as any).$router) {
    routerInstance = (componentInstance.parent.provides as any).$router;
  }

  return routerInstance;
};

const getCurrentRoute = () => {
  const instance = componentInstance;
  const router = resolveRouterInstance();

  if (!instance && !router) {
    return null;
  }

  const appContext = instance?.appContext;

  const routeFromGlobals = appContext?.config?.globalProperties?.$route;
  const routeFromProxy = instance?.proxy && (instance.proxy as any).$route;
  const routeFromApp = appContext?.app && (appContext.app as any).$route;
  const routeFromRouter = router?.currentRoute?.value;

  return routeFromGlobals || routeFromProxy || routeFromApp || routeFromRouter || null;
};

// Computed properties
const tabCount = computed(() => tabs.value.length);

const isLastStep = computed(() => activeTabIndex.value === tabCount.value - 1);

const isVertical = computed(() => props.layout === "vertical");

const reverseHorizontal = computed(
  () => !isVertical.value && !!props.reverseHorizontal
);

const displayPrevButton = computed(() => activeTabIndex.value !== 0);

const stepPercentage = computed(() =>
  tabCount.value === 0 ? 0 : (1 / (tabCount.value * 2)) * 100
);

const progress = computed(() => {
  let percentage = 0;
  if (activeTabIndex.value > 0) {
    const stepsToAdd = 1;
    const stepMultiplier = 2;
    percentage = stepPercentage.value * (activeTabIndex.value * stepMultiplier + stepsToAdd);
  } else {
    percentage = stepPercentage.value;
  }
  return percentage;
});

const progressBarStyle = computed(() => ({
  backgroundColor: props.color,
  width: `${progress.value}%`,
  color: props.color,
}));

const fillButtonStyle = computed(() => ({
  backgroundColor: props.color,
  borderColor: props.color,
  color: "white",
}));

const slotProps = computed(() => ({
  nextTab,
  prevTab,
  activeTabIndex: activeTabIndex.value,
  isLastStep: isLastStep.value,
  fillButtonStyle: fillButtonStyle.value,
  tabs: tabs.value,
  tabCount: tabCount.value,
  wizardData: wizardData.value,
  updateWizardData,
}));

// Methods
const emitTabChange = (prevIndex: number, nextIndex: number) => {
  emit("on-change", prevIndex, nextIndex);
  emit("update:startIndex", nextIndex);
};

// `Node.DOCUMENT_POSITION_*`, spelled out so this stays SSR-safe.
const DOCUMENT_POSITION_DISCONNECTED = 1;
const DOCUMENT_POSITION_PRECEDING = 2;
const DOCUMENT_POSITION_FOLLOWING = 4;

/**
 * -1 when `a` comes first, 1 when `b` does, 0 when they cannot be compared.
 * Works on detached trees too, so it does not depend on the wizard being
 * mounted into the live document.
 */
const compareNodes = (a?: Node | null, b?: Node | null): number => {
  if (!a || !b || a === b || typeof a.compareDocumentPosition !== "function") {
    return 0;
  }

  const position = a.compareDocumentPosition(b);
  if (position & DOCUMENT_POSITION_DISCONNECTED) return 0;
  if (position & DOCUMENT_POSITION_FOLLOWING) return -1;
  if (position & DOCUMENT_POSITION_PRECEDING) return 1;
  return 0;
};

/**
 * Tabs register on mount, which is not the order they appear in the template:
 * a step revealed later by `v-if` mounts last. Place it by DOM position so the
 * navigation always mirrors the markup.
 */
const resolveTabIndex = (el?: Node | null): number => {
  if (!el) {
    return tabCount.value;
  }

  const index = tabs.value.findIndex((tab) => compareNodes(el, tab.el) < 0);
  return index === -1 ? tabCount.value : index;
};

const compareTabsByDom = (a: Tab, b: Tab): number => compareNodes(a.el, b.el);

/**
 * A step inserted in the middle is not always attached to the document yet
 * when it registers, so settle the order once the DOM has caught up. The
 * active step is tracked by identity so the user is not moved.
 */
const sortTabsByDomOrder = () => {
  if (tabs.value.length < 2) {
    return;
  }

  const activeTab = tabs.value[activeTabIndex.value];
  const before = tabs.value.slice();
  tabs.value.sort(compareTabsByDom);

  if (tabs.value.every((tab, index) => tab === before[index])) {
    return;
  }

  if (activeTab) {
    const newIndex = tabs.value.indexOf(activeTab);
    if (newIndex !== -1 && newIndex !== activeTabIndex.value) {
      activeTabIndex.value = newIndex;
      maxStep.value = Math.max(maxStep.value, newIndex);
    }
  }
};

let tabSortScheduled = false;
const scheduleTabSort = () => {
  if (tabSortScheduled) {
    return;
  }
  tabSortScheduled = true;
  nextTick(() => {
    tabSortScheduled = false;
    sortTabsByDomOrder();
  });
};

let tabIdCounter = 0;

// Scoped to the wizard id so two wizards on one page never share a step id.
const createTabId = (title: string) =>
  `${wizardId.value}-${slugifyTabTitle(title)}-${++tabIdCounter}`;

const addTab = (
  item: Tab,
  updateFn?: (active: boolean, tabId?: string) => void,
  meta?: TabMeta
) => {
  const index = resolveTabIndex(meta?.el);
  item.tabId = createTabId(item.title);

  // Store the update function with the tab
  const tabWithUpdate = {
    ...item,
    updateActiveState: updateFn,
    uid: meta?.uid,
    el: meta?.el ?? null,
  };
  // Tracked by identity so a step inserted ahead of the user does not silently
  // change which step is active.
  const previouslyActive = tabs.value[activeTabIndex.value];
  tabs.value.splice(index, 0, tabWithUpdate);

  // Inform the child about the generated tabId and its initial active state
  if (updateFn) {
    updateFn(item.active, item.tabId);
  }

  if (previouslyActive) {
    const newActiveIndex = tabs.value.indexOf(previouslyActive);
    if (newActiveIndex !== -1 && newActiveIndex !== activeTabIndex.value) {
      activeTabIndex.value = newActiveIndex;
      maxStep.value = Math.max(maxStep.value, newActiveIndex);
    }
  }

  scheduleTabSort();
};

const rebuildTabsFromSchema = () => {
  if (!useSchemaMode.value) return;

  tabs.value = visibleSchemaSteps.value.map((step, index) => {
    const title = step.title || `Step ${index + 1}`;

    const tab: Tab = {
      tabId: `${wizardId.value}-${slugifyTabTitle(step.id || title)}`,
      title,
      active: index === activeTabIndex.value,
      checked: index <= activeTabIndex.value,
      validationError: null,
      beforeChange: undefined,
      afterChange: undefined,
      route: step.route,
      color: props.color,
      errorColor: props.errorColor,
      shape: props.shape,
      icon: step.icon,
      customIcon: step.customIcon,
      updateActiveState: undefined,
    };

    return tab;
  });

  // Clamp active index if needed
  if (activeTabIndex.value >= tabs.value.length) {
    activeTabIndex.value = Math.max(0, tabs.value.length - 1);
  }
};

/**
 * Accepts the uid <tab-content> registered with, or the tab object itself for
 * callers using the exposed API. Matching on object identity alone fails,
 * because `addTab` stores a copy of what the child handed over.
 */
const findTabIndex = (item: Tab | number): number => {
  if (typeof item === "number") {
    return tabs.value.findIndex((tab) => tab.uid === item);
  }

  const byIdentity = tabs.value.indexOf(item);
  if (byIdentity > -1) {
    return byIdentity;
  }

  if (item?.uid !== undefined) {
    const byUid = tabs.value.findIndex((tab) => tab.uid === item.uid);
    if (byUid > -1) {
      return byUid;
    }
  }

  return item?.tabId
    ? tabs.value.findIndex((tab) => tab.tabId === item.tabId)
    : -1;
};

/**
 * Vue reuses a <tab-content> in place when siblings change, handing it new
 * props rather than remounting it. Without this the wizard would keep showing
 * the step it first registered (stale title, icon, beforeChange, route...).
 */
const updateTab = (uid: number | undefined, patch: Partial<Tab>) => {
  if (uid === undefined) {
    return;
  }

  const tab = tabs.value.find((item) => item.uid === uid);
  if (tab) {
    Object.assign(tab, patch);
  }
};

const removeTab = (item: Tab | number) => {
  const index = findTabIndex(item);
  if (index === -1) {
    return;
  }

  const wasActive = index === activeTabIndex.value;
  const previousIndex = activeTabIndex.value;
  tabs.value.splice(index, 1);

  if (tabs.value.length === 0) {
    activeTabIndex.value = 0;
    maxStep.value = 0;
    return;
  }

  maxStep.value = Math.min(maxStep.value, tabs.value.length - 1);

  // Go one step back if the current step is removed
  if (wasActive) {
    const newIndex = Math.max(0, index - 1);
    activateTabAndCheckStep(newIndex);
    emitTabChange(previousIndex, newIndex);
  } else if (index < previousIndex) {
    // Everything after the removed step shifted left; stay on the same step.
    activeTabIndex.value = previousIndex - 1;
    maxStep.value = Math.max(0, maxStep.value);
    emitTabChange(previousIndex, activeTabIndex.value);
  }
};

const reset = () => {
  maxStep.value = 0;
  tabs.value.forEach((tab) => {
    tab.checked = false;
  });
  navigateToTab(0);
};

const activateAll = () => {
  maxStep.value = tabs.value.length - 1;
  tabs.value.forEach((tab) => {
    tab.checked = true;
  });
};

const navigateToTab = (index: number): boolean => {
  const validate = index > activeTabIndex.value;
  if (index <= maxStep.value) {
    const cb = () => {
      if (validate && index - activeTabIndex.value > 1) {
        // validate all steps recursively until destination index
        changeTab(activeTabIndex.value, activeTabIndex.value + 1);
        beforeTabChange(activeTabIndex.value, cb);
      } else {
        changeTab(activeTabIndex.value, index);
        afterTabChange(activeTabIndex.value);
      }
    };
    if (validate) {
      beforeTabChange(activeTabIndex.value, cb);
    } else {
      setValidationError(null);
      cb();
    }
  }
  return index <= maxStep.value;
};

const nextTab = () => {
  const cb = () => {
    if (activeTabIndex.value < tabCount.value - 1) {
      const newIndex = activeTabIndex.value + 1;
      changeTab(activeTabIndex.value, newIndex);
      afterTabChange(newIndex);
    } else {
      emit("on-complete");
    }
  };
  beforeTabChange(activeTabIndex.value, cb);
};

const prevTab = () => {
  const cb = () => {
    if (activeTabIndex.value > 0) {
      setValidationError(null);
      changeTab(activeTabIndex.value, activeTabIndex.value - 1);
    }
  };
  if (props.validateOnBack) {
    beforeTabChange(activeTabIndex.value, cb);
  } else {
    cb();
  }
};

const focusNextTab = () => {
  const tabIndex = getFocusedTabIndex(tabs.value);
  if (tabIndex !== -1 && tabIndex < tabs.value.length - 1) {
    const tabToFocus = tabs.value[tabIndex + 1];
    if (tabToFocus.checked) {
      // The DOM id used for the step element is `step-${tab.tabId}`
      findElementAndFocus(`step-${tabToFocus.tabId}`);
    }
  }
};

const focusPrevTab = () => {
  const tabIndex = getFocusedTabIndex(tabs.value);
  if (tabIndex !== -1 && tabIndex > 0) {
    const toFocusId = tabs.value[tabIndex - 1].tabId;
    // The DOM id used for the step element is `step-${tab.tabId}`
    findElementAndFocus(`step-${toFocusId}`);
  }
};

// Arrow keys should follow what the user sees, and `reverseHorizontal`
// renders the steps right-to-left.
const onArrowRight = () => {
  reverseHorizontal.value ? focusPrevTab() : focusNextTab();
};

const onArrowLeft = () => {
  reverseHorizontal.value ? focusNextTab() : focusPrevTab();
};

const setLoading = (value: boolean) => {
  loading.value = value;
  emit("on-loading", value);
};

const setValidationError = (error: any) => {
  const activeTab = tabs.value[activeTabIndex.value];
  if (activeTab) {
    activeTab.validationError = error;
  }
  emit("on-error", error);
};

const validateBeforeChange = (promiseFn: any, callback: () => void) => {
  setValidationError(null);
  // we have a promise
  if (isPromise(promiseFn)) {
    setLoading(true);
    promiseFn
      .then((res: any) => {
        setLoading(false);
        const validationResult = res === true;
        executeBeforeChange(validationResult, callback);
      })
      .catch((error: any) => {
        setLoading(false);
        setValidationError(error);
      });
    // we have a simple function
  } else {
    const validationResult = promiseFn === true;
    executeBeforeChange(validationResult, callback);
  }
};

const executeBeforeChange = (validationResult: boolean, callback: () => void) => {
  emit("on-validate", validationResult, activeTabIndex.value);
  if (validationResult) {
    callback();
  } else {
    const activeTab = tabs.value[activeTabIndex.value];
    if (activeTab) {
      activeTab.validationError = "error";
    }
  }
};

const beforeTabChange = (index: number, callback: () => void) => {
  if (loading.value) {
    return;
  }

  // Schema-mode validation
  if (useSchemaMode.value && props.schema) {
    const schemaStep = visibleSchemaSteps.value[index];
    if (schemaStep && schemaStep.validate) {
      const ctx = {
        data: wizardData.value,
        stepId: schemaStep.id,
        index,
      };

      const result = schemaStep.validate(ctx);

      if (isPromise(result)) {
        setLoading(true);
        (result as Promise<boolean | string>)
          .then((res) => {
            setLoading(false);
            if (res === true) {
              executeBeforeChange(true, callback);
            } else {
              const message = res === false ? "Validation failed" : res;
              if (tabs.value[index]) {
                tabs.value[index].validationError = String(message);
              }
              emit("on-error", message);
              executeBeforeChange(false, () => {});
            }
          })
          .catch((error) => {
            setLoading(false);
            setValidationError(error);
          });
      } else {
        if (result === true) {
          executeBeforeChange(true, callback);
        } else {
          const message = result === false ? "Validation failed" : result;
          if (tabs.value[index]) {
            tabs.value[index].validationError = String(message);
          }
          emit("on-error", message);
          executeBeforeChange(false, () => {});
        }
      }
      return;
    }
  }

  // Classic per-tab beforeChange
  const oldTab = tabs.value[index];
  if (oldTab && oldTab.beforeChange !== undefined) {
    const tabChangeRes = oldTab.beforeChange();
    validateBeforeChange(tabChangeRes, callback);
  } else {
    callback();
  }
};

const afterTabChange = (index: number) => {
  if (loading.value) {
    return;
  }
  const newTab = tabs.value[index];
  if (newTab && newTab.afterChange !== undefined) {
    newTab.afterChange();
  }
};

const changeTab = (oldIndex: number, newIndex: number, emitChangeEvent = true) => {
  const oldTab = tabs.value[oldIndex];
  const newTab = tabs.value[newIndex];
  if (oldTab) {
    oldTab.active = false;
  }
  if (newTab) {
    newTab.active = true;
  }
  if (emitChangeEvent && activeTabIndex.value !== newIndex) {
    emitTabChange(oldIndex, newIndex);
  }
  activeTabIndex.value = newIndex;
  activateTabAndCheckStep(activeTabIndex.value);
  return true;
};

const normalizeRouteTarget = (routeTarget: string | object | undefined, router: any) => {
  if (!routeTarget) {
    return { raw: null, path: null };
  }

  if (typeof routeTarget === 'string') {
    return { raw: routeTarget, path: routeTarget };
  }

  // For route objects, try to resolve to get a stable path/fullPath
  if (router && typeof router.resolve === 'function') {
    const resolved = router.resolve(routeTarget as any);
    const path = resolved?.fullPath || resolved?.path || null;
    return { raw: routeTarget, path };
  }

  return { raw: routeTarget, path: null };
};

const tryChangeRoute = (tab: Tab) => {
  if (!tab.route) {
    return;
  }

  const router = resolveRouterInstance();

  if (!router) {
    if (import.meta.env && import.meta.env.DEV) {
      console.warn('Vue Router not found. Make sure to install vue-router and use app.use(router) for route-based navigation.');
    }
    return;
  }

  const current = getCurrentRoute();
  const currentPath = current?.fullPath || current?.path || undefined;

  const target = normalizeRouteTarget(tab.route as any, router);

  // If we can determine a target path and it matches the current one, avoid redundant navigation
  if (target.path && currentPath === target.path) {
    return;
  }

  router.push(target.raw as any).catch((err: any) => {
    // Ignore redundant navigation errors; surface others
    const message = err?.message || '';
    if (!message.includes('Avoided redundant navigation') && !message.includes('NavigationDuplicated')) {
      console.warn('Route navigation failed:', err);
    }
  });
};

const checkRouteChange = (route: any) => {
  const router = resolveRouterInstance();
  const routePath = route?.fullPath || route?.path || route || '';

  let matchingTabIndex = -1;
  const matchingTab = tabs.value.find((tab, index) => {
    if (!tab.route) {
      return false;
    }

    // String route: compare directly to the current path
    if (typeof tab.route === 'string') {
      const match = tab.route === routePath;
      if (match) {
        matchingTabIndex = index;
      }
      return match;
    }

    // Object route: resolve both and compare resulting paths
    if (router && typeof router.resolve === 'function') {
      const tabLocation = normalizeRouteTarget(tab.route as any, router);
      const match = !!tabLocation.path && tabLocation.path === routePath;
      if (match) {
        matchingTabIndex = index;
      }
      return match;
    }

    return false;
  });

  if (matchingTab && !matchingTab.active) {
    navigateToTab(matchingTabIndex);
  }
};

const deactivateTabs = () => {
  tabs.value.forEach((tab) => {
    tab.active = false;
    // Call the update function if it exists
    if (tab.updateActiveState) {
      tab.updateActiveState(false);
    }
  });
};

const activateTab = (index: number) => {
  deactivateTabs();
  const tab = tabs.value[index];
  if (tab) {
    tab.active = true;
    tab.checked = true;

    // Call the update function if it exists
    if (tab.updateActiveState) {
      tab.updateActiveState(true);
    }

    tryChangeRoute(tab);
  }
};

const activateTabAndCheckStep = (index: number) => {
  activateTab(index);
  if (index > maxStep.value) {
    maxStep.value = index;
  }
  activeTabIndex.value = index;
};

const initializeTabs = () => {
  if (tabs.value.length > 0 && props.startIndex === 0) {
    activateTab(activeTabIndex.value);
  }
  if (props.startIndex < tabs.value.length) {
    activateTabAndCheckStep(props.startIndex);
  } else {
    console.warn(
      `Prop startIndex set to ${props.startIndex} is greater than the number of tabs - ${tabs.value.length}. Make sure that the starting index is less than the number of tabs registered`
    );
  }
};

// Expose methods
defineExpose({
  emitTabChange,
  addTab,
  removeTab,
  updateTab,
  reset,
  activateAll,
  navigateToTab,
  nextTab,
  prevTab,
  focusNextTab,
  focusPrevTab,
  onArrowRight,
  onArrowLeft,
  changeTab,
  deactivateTabs,
  activateTab,
  initializeTabs
})

// Provide functions to child components
provide('addTab', addTab);
provide('removeTab', removeTab);
provide('updateTab', updateTab);

// Watchers
watch(() => props.startIndex, (newStartIndex) => {
  if (newStartIndex < tabs.value.length) {
    activateTabAndCheckStep(newStartIndex);
  }
});

// Rebuild tabs when schema definition changes
watch(
  () => props.schema,
  () => {
    if (useSchemaMode.value) {
      rebuildTabsFromSchema();
    }
  },
  { deep: true }
);

// Re-run conditions when wizard data changes in schema mode
watch(
  () => wizardData.value,
  () => {
    if (useSchemaMode.value) {
      const prevActiveId = tabs.value[activeTabIndex.value]?.tabId;
      rebuildTabsFromSchema();
      // Try to keep the same step active if still visible
      const newIndex = tabs.value.findIndex((t) => t.tabId === prevActiveId);
      if (newIndex !== -1) {
        activateTabAndCheckStep(newIndex);
      }
    }
  },
  { deep: true }
);

// Route watching with proper Vue Router integration
const currentRoute = ref('');
let routeWatcher: any = null;
let hasLoggedRouterWarning = false;

const setupRouteWatching = () => {
  const instance = componentInstance;

  if (!instance) {
    if (!hasLoggedRouterWarning && import.meta.env && import.meta.env.DEV) {
      console.warn('Component instance not available for route watching');
      hasLoggedRouterWarning = true;
    }
    return;
  }

  const router = resolveRouterInstance();
  const route = getCurrentRoute();

  if (route) {
    // Watch for route changes
    routeWatcher = watch(
      () => getCurrentRoute()?.path,
      (newPath) => {
        const fullRoute = getCurrentRoute();
        const pathToUse = fullRoute?.fullPath || fullRoute?.path || newPath || '';

        if (pathToUse !== currentRoute.value) {
          currentRoute.value = pathToUse;
          checkRouteChange(fullRoute || pathToUse);
        }
      },
      { immediate: true }
    );
  } else if (!router && !hasLoggedRouterWarning && import.meta.env && import.meta.env.DEV) {
    console.warn('Vue Router not detected. Route-based navigation will not work.');
    hasLoggedRouterWarning = true;
  }
};

// Lifecycle
onMounted(() => {
  if (useSchemaMode.value) {
    rebuildTabsFromSchema();
    if (tabs.value.length > 0) {
      activateTabAndCheckStep(activeTabIndex.value);
    }
  } else {
    initializeTabs();
  }
  setupRouteWatching();
});

onBeforeUnmount(() => {
  if (routeWatcher) {
    routeWatcher();
  }
});
</script>
<style lang="scss">
@use "../assets/wizard.scss";
</style>
