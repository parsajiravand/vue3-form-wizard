<template>
  <li :class="{ active: tab.active }">
    <a :class="{ disabled: !tab.checked }" :style="cursorStyle">
      <div
        class="wizard-icon-circle md"
        role="tab"
        :tabindex="tab.checked ? 0 : ''"
        :id="`step-${tab.tabId}`"
        :aria-controls="tab.tabId"
        :aria-disabled="tab.active"
        :aria-selected="tab.active"
        :class="{
          checked: tab.checked,
          square_shape: isStepSquare,
          tab_shape: isTabShape,
        }"
        :style="[
          tab.checked ? stepCheckedStyle : {},
          tab.validationError ? errorStyle : {},
        ]"
      >
        <div
          v-if="tab.active"
          class="wizard-icon-container"
          :class="{ square_shape: isStepSquare, tab_shape: isTabShape }"
          :style="[iconActiveStyleBg, tab.validationError ? errorStyle : {}]"
        >
          <slot name="active-step">
            <span
              class="wizard-icon"
              v-if="tab.customIcon"
              v-html="tab.customIcon"
            ></span>
            <i
              v-else
              :class="tab.icon ? tab.icon : ''"
              class="wizard-icon"
              :style="tab.checked ? iconActiveStyle : ''"
            >
              {{ tab.icon ? null : index + 1 }}
            </i>
          </slot>
        </div>
        <slot v-else>
          <span
            class="wizard-icon"
            v-if="tab.customIcon"
            v-html="tab.customIcon"
          ></span>
          <i
            v-else
            :class="tab.icon ? tab.icon : ''"
            class="wizard-icon"
            :style="tab.checked ? iconActiveStyle : ''"
          >
            {{ tab.icon ? null : index + 1 }}
          </i>
        </slot>
      </div>
      <slot name="title">
        <span
          class="stepTitle"
          :class="{ active: tab.active, has_error: tab.validationError }"
          :style="tab.active || tab.checked ? stepTitleStyle : {}"
          style="margin-top: 5px"
        >
          {{ tab.title }}
        </span>
      </slot>
      <slot name="customIcon"> </slot>
    </a>
  </li>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  tab: {
    active: boolean;
    checked: boolean;
    validationError?: string | null;
    color: string;
    errorColor: string;
    shape: string;
    icon?: string;
    customIcon?: string;
    title: string;
    tabId: string;
  };
  transition?: string;
  index?: number;
  disableBackOnClickStep?: boolean;
}>(), {
  transition: "",
  index: 0,
  disableBackOnClickStep: false,
});

// Computed properties
const iconActiveStyleBg = computed(() => ({
  backgroundColor: props.tab.color,
}));

const iconActiveStyle = computed(() => {
  if (!props.tab.active) {
    return { color: props.tab.color };
  }
  return {};
});

const stepCheckedStyle = computed(() => ({
  borderColor: props.tab.color,
}));

const errorStyle = computed(() => ({
  borderColor: props.tab.errorColor,
  backgroundColor: props.tab.errorColor,
}));

const stepTitleStyle = computed(() => {
  const isError = props.tab.validationError;
  return {
    color: isError ? props.tab.errorColor : props.tab.color,
  };
});

const isStepSquare = computed(() => props.tab.shape === "square");

const isTabShape = computed(() => props.tab.shape === "tab");

const cursorStyle = computed(() =>
  props.disableBackOnClickStep ? "cursor: default" : ""
);
</script>
