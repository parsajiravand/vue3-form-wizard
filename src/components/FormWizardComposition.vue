<template>
  <div
    :id="id ? id : ''"
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
            @click="navigateToTab(index)"
            @keyup.enter="navigateToTab(index)"
            :transition="transition"
            :index="index"
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
        <div class="wizard-footer-left">
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
<script lang="ts">
import WizardButton from "./WizardButton.vue";

export default {
  name: "form-wizard",
  components: {
    WizardButton,
  },
};
</script>
<script setup lang="ts">
import WizardStep from "./WizardStepComposition.vue";
import { isPromise, findElementAndFocus, getFocusedTabIndex } from "./helpers";
import {
  computed,
  onMounted,
  provide,
  reactive,
  ref,
  watch,
} from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
console.log(route);
provide("addTabFromParent", addTab);
provide("removeTab",removeTab);
const props = defineProps({
  id: {
    type: String,
    default: "fw_" + new Date().valueOf(),
  },
  title: {
    type: String,
    default: "Awesome Wizard",
  },
  subtitle: {
    type: String,
    default: "Split a complicated flow in multiple steps",
  },
  nextButtonText: {
    type: String,
    default: "Next",
  },
  backButtonText: {
    type: String,
    default: "Back",
  },
  finishButtonText: {
    type: String,
    default: "Finish",
  },
  hideButtons: {
    type: Boolean,
    default: false,
  },
  validateOnBack: Boolean,
  /***
   * Applies to text, border and circle
   */
  color: {
    type: String,
    default: "#e74c3c",
  },
  errorColor: {
    type: String,
    default: "#8b0000",
  },
  shape: {
    type: String,
    default: "circle",
  },
  layout: {
    type: String,
    default: "horizontal",
  },
  stepsClasses: {
    type: [String, Array],
    default: "",
  },
  stepSize: {
    type: String,
    default: "md",
    validator: (value: string) => {
      let acceptedValues = ["xs", "sm", "md", "lg"];
      return acceptedValues.indexOf(value) !== -1;
    },
  },
  /**
   * Name of the transition when transition between steps
   * */
  transition: {
    type: String,
    default: "",
  },
  /***
   *
   * Index of the initial tab to display
   */
  startIndex: {
    type: Number,
    default: 0,
    validator: (value) => {
      return value >= 0;
    },
  },
});
const activeTabIndex = ref(0);
const currentPercentage = ref(0);
const maxStep = ref(0);
const loading = ref(false);
const tabs = reactive([]);

const slotProps = computed(() => {
  return {
    nextTab: nextTab,
    prevTab: prevTab,
    activeTabIndex: activeTabIndex.value,
    isLastStep: isLastStep.value,
    fillButtonStyle: fillButtonStyle.value,
  };
});
const tabCount = computed(() => {
  return tabs.length;
});
const isLastStep = computed(() => {
  return activeTabIndex.value === tabCount.value - 1;
});
const isVertical = computed(() => {
  return props.layout === "vertical";
});
const displayPrevButton = computed(() => {
  return activeTabIndex.value !== 0;
});
const stepPercentage = computed(() => {
  return (1 / (tabCount.value * 2)) * 100;
});
const progressBarStyle = computed(() => {
  return {
    backgroundColor: props.color,
    width: `${progress}%`,
    color: props.color,
  };
});
const fillButtonStyle = computed(() => {
  return {
    backgroundColor: props.color,
    borderColor: props.color,
    color: "white",
  };
});
const progress = computed(() => {
  let percentage = 0;
  if (activeTabIndex.value > 0) {
    let stepsToAdd = 1;
    let stepMultiplier = 2;
    percentage =
      stepPercentage.value *
      (activeTabIndex.value * stepMultiplier + stepsToAdd);
  } else {
    percentage = stepPercentage.value;
  }
  return percentage;
});

/* emits to parnet */
const emit = defineEmits([
  "on-change",
  "update:startIndex",
  "on-complete",
  "on-loading",
  "on-error",
  "on-validate",
]);
/* emits to parnet */

function emitTabChange(prevIndex, nextIndex) {
  emit("on-change", prevIndex, nextIndex);
  emit("update:startIndex", nextIndex);
}
function addTab(item) {
  console.log("item in composition", item);
  /* const index = this.$.slots.default().length -1  */ //fix this part later
  const index = tabCount.value;
  item.tabId = `${item.title.replace(/ /g, "")}${index}`;
  tabs.splice(index, 0, item);
  // if a step is added before the current one, go to it
  if (index < activeTabIndex.value + 1) {
    maxStep.value = index;
    changeTab(activeTabIndex.value + 1, index);
  }
}
function removeTab(item) {
  const index = tabs.indexOf(item);
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
    tabs.splice(index, 1);
  }
}
function reset() {
  maxStep.value = 0;
  tabs.forEach((tab) => {
    tab.checked = false;
  });
  navigateToTab(0);
}
// TODO:implement later
// function  activateAll () {
//     maxStep.value = tabs.length - 1
//     tabs.forEach((tab) => {
//       tab.checked = true
//     })
//   }
function navigateToTab(index, shouldValidate = false) {
  let validate = index > activeTabIndex.value;
  if (index <= maxStep.value) {
    let cb = () => {
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
}
function nextTab() {
  let cb = () => {
    if (activeTabIndex.value < tabCount.value - 1) {
      changeTab(activeTabIndex.value, activeTabIndex.value + 1);
      afterTabChange(activeTabIndex.value);
    } else {
      emit("on-complete");
    }
  };
  beforeTabChange(activeTabIndex.value, cb);
}
function prevTab() {
  let cb = () => {
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
}
function focusNextTab() {
  let tabIndex = getFocusedTabIndex(tabs);
  if (tabIndex !== -1 && tabIndex < tabs.length - 1) {
    let tabToFocus = tabs[tabIndex + 1];
    if (tabToFocus.checked) {
      findElementAndFocus(tabToFocus.tabId);
    }
  }
}
function focusPrevTab() {
  let tabIndex = getFocusedTabIndex(tabs);
  if (tabIndex !== -1 && tabIndex > 0) {
    let toFocusId = tabs[tabIndex - 1].tabId;
    findElementAndFocus(toFocusId);
  }
}
function setLoading(value) {
  loading.value = value;
  emit("on-loading", value);
}
function setValidationError(error) {
  tabs[activeTabIndex.value].validationError = error;
  emit("on-error", error);
}
function validateBeforeChange(promiseFn, callback) {
  setValidationError(null);
  // we have a promise
  if (isPromise(promiseFn)) {
    setLoading(true);
    promiseFn
      .then((res) => {
        setLoading(false);
        let validationResult = res === true;
        executeBeforeChange(validationResult, callback);
      })
      .catch((error) => {
        setLoading(false);
        setValidationError(error);
      });
    // we have a simple function
  } else {
    let validationResult = promiseFn === true;
    executeBeforeChange(validationResult, callback);
  }
}
function executeBeforeChange(validationResult, callback) {
  emit("on-validate", validationResult, activeTabIndex.value);
  if (validationResult) {
    callback();
  } else {
    tabs[activeTabIndex.value].validationError = "error";
  }
}
function beforeTabChange(index, callback) {
  if (loading.value) {
    return;
  }
  let oldTab = tabs[index];
  if (oldTab && oldTab.beforeChange !== undefined) {
    let tabChangeRes = oldTab.beforeChange();
    validateBeforeChange(tabChangeRes, callback);
  } else {
    callback();
  }
}
function afterTabChange(index) {
  if (loading.value) {
    return;
  }
  let newTab = tabs[index];
  if (newTab && newTab.afterChange !== undefined) {
    newTab.afterChange();
  }
}
function changeTab(oldIndex, newIndex, emitChangeEvent = true) {
  let oldTab = tabs[oldIndex];
  let newTab = tabs[newIndex];
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
}
function tryChangeRoute(tab) {
  if (router && tab.route) {
    router.push(tab.route);
  }
}

function deactivateTabs() {
  tabs.forEach((tab) => {
    tab.active = false;
  });
}

function activateTab(index) {
  deactivateTabs();
  let tab = tabs[index];
  if (tab) {
    tab.active = true;
    tab.checked = true;
    tryChangeRoute(tab);
  }
}

function activateTabAndCheckStep(index) {
  activateTab(index);
  if (index > maxStep.value) {
    maxStep.value = index;
  }
  activeTabIndex.value = index;
}

function initializeTabs() {
  if (tabs.length > 0 && props.startIndex === 0) {
    activateTab(activeTabIndex.value);
  }
  if (props.startIndex < tabs.length) {
    activateTabAndCheckStep(props.startIndex);
  } else {
    window.console.warn(
      `Prop startIndex set to ${props.startIndex} is greater than the number of tabs - ${tabs.length}. Make sure that the starting index is less than the number of tabs registered`
    );
  }
}

function checkRouteChange(route) {
  let matchingTabIndex = -1;
  let matchingTab = tabs.find((tab, index) => {
    let match = tab.route === route;
    if (match) {
      matchingTabIndex = index;
    }
    return match;
  });

  if (matchingTab && !matchingTab.active) {
    const shouldValidate = matchingTabIndex > activeTabIndex.value;
    navigateToTab(matchingTabIndex, shouldValidate);
  }
}
if (route) {
  watch(
    () => route.path,
    (newRoute) => {
      checkRouteChange(newRoute);
      /* ... */
    }
  );
}

onMounted(() => {
  initializeTabs();
  console.log(tabs);
});
</script>
<style lang="scss">
@import "../assets/wizard.scss";
</style>
