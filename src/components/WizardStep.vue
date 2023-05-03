<template>
  <li :class="{ active: tab.active }">
    <a
      href="javascript:void(0)"
      :class="{ disabled: !tab.checked }"
      :style="cursorStyle"
    >
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
<script>
export default {
  name: "wizard-step",
  props: {
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
    disableBackOnClickStep: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    iconActiveStyleBg() {
      return {
        backgroundColor: this.tab.color,
      };
    },
    iconActiveStyle() {
      if (!this.tab.active) {
        return { color: this.tab.color };
      }
    },
    stepCheckedStyle() {
      return {
        borderColor: this.tab.color,
      };
    },
    errorStyle() {
      return {
        borderColor: this.tab.errorColor,
        backgroundColor: this.tab.errorColor,
      };
    },
    stepTitleStyle() {
      let isError = this.tab.validationError;
      return {
        color: isError ? this.tab.errorColor : this.tab.color,
      };
    },
    isStepSquare() {
      return this.tab.shape === "square";
    },
    isTabShape() {
      return this.tab.shape === "tab";
    },
    cursorStyle() {
      return this.disableBackOnClickStep ? "cursor: default" : "";
    },
  },
};
</script>
