<template>
  <div
    :id="wizardId"
    class="vue-form-wizard"
    :class="[stepSize, { vertical: isVertical }]"
    @keyup.right="focusNextTab"
    @keyup.left="focusPrevTab"
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
        :class="stepsClasses"
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
        <slot v-bind="slotProps"> </slot>
      </div>
    </div>

    <div class="wizard-card-footer clearfix" v-if="!hideButtons">
      <slot name="footer" v-bind="slotProps">
        <div class="wizard-footer-left" v-if="!disableBack">
          <span
            @click="prevTab"
            @keyup.enter="prevTab"
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
            v-if="isLastStep"
            role="button"
            tabindex="0"
          >
            <slot name="finish" v-bind="slotProps">
              <wizard-button :style="fillButtonStyle">
                {{ finishButtonText }}
              </wizard-button>
            </slot>
          </span>
          <span
            @click="nextTab"
            @keyup.enter="nextTab"
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
import { defineExpose, ref, computed, watch, onMounted, provide } from 'vue'
import WizardButton from "./WizardButton.vue";
import WizardStep from "./WizardStep.vue";
import { isPromise, findElementAndFocus, getFocusedTabIndex } from "./helpers.js";

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
});

// Generate ID if not provided
const wizardId = computed(() => props.id || "fw_" + new Date().valueOf());

const emit = defineEmits({
  'on-change': (prevIndex: number, nextIndex: number) => true,
  'update:startIndex': (index: number) => true,
  'on-complete': () => true,
  'on-loading': (loading: boolean) => true,
  'on-error': (error: any) => true,
  'on-validate': (result: boolean, index: number) => true,
});

// Reactive state
const activeTabIndex = ref(0);
const maxStep = ref(0);
const loading = ref(false);
const tabs = ref<Tab[]>([]);

// Computed properties
const tabCount = computed(() => tabs.value.length);

const isLastStep = computed(() => activeTabIndex.value === tabCount.value - 1);

const isVertical = computed(() => props.layout === "vertical");

const displayPrevButton = computed(() => activeTabIndex.value !== 0);

const stepPercentage = computed(() => (1 / (tabCount.value * 2)) * 100);

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
}));

// Methods
const emitTabChange = (prevIndex: number, nextIndex: number) => {
  emit("on-change", prevIndex, nextIndex);
  emit("update:startIndex", nextIndex);
};

const addTab = (item: Tab) => {
  const index = tabCount.value;
  item.tabId = `${item.title.replace(/ /g, "")}${index}`;
  tabs.value.splice(index, 0, item);
  // if a step is added before the current one, go to it
  if (index < activeTabIndex.value + 1) {
    maxStep.value = index;
    changeTab(activeTabIndex.value + 1, index);
  }
};

const removeTab = (item: Tab) => {
  const index = tabs.value.indexOf(item);
  if (index > -1) {
    // Go one step back if the current step is removed
    if (index === activeTabIndex.value) {
      maxStep.value = activeTabIndex.value - 1;
      changeTab(activeTabIndex.value, activeTabIndex.value - 1);
    }
    if (index < activeTabIndex.value) {
      maxStep.value = activeTabIndex.value - 1;
      activeTabIndex.value = activeTabIndex.value - 1;
      emitTabChange(activeTabIndex.value + 1, activeTabIndex.value);
    }
    tabs.value.splice(index, 1);
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
      changeTab(activeTabIndex.value, activeTabIndex.value + 1);
      afterTabChange(activeTabIndex.value);
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
      findElementAndFocus(tabToFocus.tabId);
    }
  }
};

const focusPrevTab = () => {
  const tabIndex = getFocusedTabIndex(tabs.value);
  if (tabIndex !== -1 && tabIndex > 0) {
    const toFocusId = tabs.value[tabIndex - 1].tabId;
    findElementAndFocus(toFocusId);
  }
};

const setLoading = (value: boolean) => {
  loading.value = value;
  emit("on-loading", value);
};

const setValidationError = (error: any) => {
  tabs.value[activeTabIndex.value].validationError = error;
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
    tabs.value[activeTabIndex.value].validationError = "error";
  }
};

const beforeTabChange = (index: number, callback: () => void) => {
  if (loading.value) {
    return;
  }
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

const tryChangeRoute = (tab: Tab) => {
  // Note: In Vue 3 setup, we need to access router differently
  // This would need to be handled by the consuming component
  console.warn('Route navigation needs to be handled by parent component in Composition API');
};

const checkRouteChange = (route: string) => {
  let matchingTabIndex = -1;
  const matchingTab = tabs.value.find((tab, index) => {
    const match = tab.route === route;
    if (match) {
      matchingTabIndex = index;
    }
    return match;
  });

  if (matchingTab && !matchingTab.active) {
    const shouldValidate = matchingTabIndex > activeTabIndex.value;
    navigateToTab(matchingTabIndex);
  }
};

const deactivateTabs = () => {
  tabs.value.forEach((tab) => {
    tab.active = false;
  });
};

const activateTab = (index: number) => {
  deactivateTabs();
  const tab = tabs.value[index];
  if (tab) {
    tab.active = true;
    tab.checked = true;
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
  reset,
  activateAll,
  navigateToTab,
  nextTab,
  prevTab,
  focusNextTab,
  focusPrevTab,
  changeTab,
  deactivateTabs,
  activateTab,
  initializeTabs
})

// Provide functions to child components
provide('addTab', addTab);
provide('removeTab', removeTab);

// Watchers
watch(() => props.startIndex, (newStartIndex) => {
  if (newStartIndex < tabs.value.length) {
    activateTabAndCheckStep(newStartIndex);
  }
});

// Route watching (simplified - would need proper router integration)
const route = ref('');
watch(route, (newRoute) => {
  checkRouteChange(newRoute);
});

// Lifecycle
onMounted(() => {
  initializeTabs();
});
</script>
<style lang="scss">
@use "../assets/wizard.scss";
</style>
