<template>
  <li :class="{ active: tab.active }">
    <a href="javascript:void(0)" :class="{ disabled: !tab.checked }">
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
<script lang="ts" setup>
import { computed } from "@vue/reactivity";

const props = defineProps({
  tab: {
    type: Object,
    default: () => {},
  },
  transition: {
    type: String,
    default: "",
  },
  index: {
    type: Number,
    default: 0,
  },
});
const iconActiveStyleBg = computed<object>((): object => {
  return {
    backgroundColor: props.tab.color,
  };
});
const iconActiveStyle = computed<object>((): object => {
  if (!props.tab.active) {
    return { color: props.tab.color };
  }
});
const stepCheckedStyle = computed<object>((): object => {
  return {
    borderColor: props.tab.color,
  };
});
const errorStyle = computed<object>((): object => {
  return {
    borderColor: props.tab.errorColor,
    backgroundColor: props.tab.errorColor,
  };
});
const stepTitleStyle = computed<object>((): object => {
  let isError = props.tab.validationError;
  return {
    color: isError ? props.tab.errorColor : props.tab.color,
  };
});
const isStepSquare = computed<boolean>((): boolean => {
  return props.tab.shape === "square";
});
const isTabShape = computed<boolean>((): boolean => {
  return props.tab.shape === "tab";
});
</script>
