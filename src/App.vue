<script setup lang="ts">
import { ref, defineComponent, h } from "vue";
import FormWizard from "./components/FormWizard.vue";
import type { FormWizardSchema, WizardData } from "./types";
import "/node_modules/vue3-form-wizard/dist/style.css";

// Local sample step components - use render functions (Vite uses runtime-only Vue, no template compiler)
const IntroStep = defineComponent({
  name: "IntroStep",
  props: {
    data: {
      type: Object as () => WizardData,
      required: true,
    },
    updateData: {
      type: Function as unknown as () => (partial: Record<string, any>) => void,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h("div", [
        h("h2", "Choose plan"),
        h("p", "Select a plan to continue."),
        h(
          "label",
          [
            "Plan: ",
            h(
              "select",
              {
                value: props.data.plan,
                onChange: (e: Event) => {
                  const target = e.target as HTMLSelectElement;
                  props.updateData({ plan: target.value });
                },
              },
              [
                h("option", { value: "basic" }, "Basic"),
                h("option", { value: "premium" }, "Premium"),
              ]
            ),
          ]
        ),
      ]);
  },
});

const PremiumStep = defineComponent({
  name: "PremiumStep",
  props: {
    data: { type: Object as () => WizardData, required: true },
    updateData: {
      type: Function as unknown as () => (partial: Record<string, any>) => void,
      required: true,
    },
  },
  setup() {
    return () =>
      h("div", [
        h("h2", "Premium features"),
        h("p", [
          "You selected the ",
          h("strong", "premium"),
          " plan. Here you can show extra configuration or upsell content.",
        ]),
      ]);
  },
});

const ReviewStep = defineComponent({
  name: "ReviewStep",
  props: {
    data: { type: Object as () => WizardData, required: true },
    updateData: {
      type: Function as unknown as () => (partial: Record<string, any>) => void,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h("div", [
        h("h2", "Review"),
        h("p", "Please review your selections before completing the wizard."),
        h("pre", JSON.stringify(props.data, null, 2)),
      ]);
  },
});

const initialData: WizardData = { plan: "basic" };

const schema: FormWizardSchema = {
  initialData,
  steps: [
    {
      id: "intro",
      title: "Intro",
      component: "IntroStep",
    },
    {
      id: "premium",
      title: "Premium features",
      component: "PremiumStep",
      condition: ({ data }) => data.plan === "premium",
    },
    {
      id: "review",
      title: "Review",
      component: "ReviewStep",
      validate: ({ data }) =>
        data.plan ? true : "Plan is required before submit",
    },
  ],
};

const data = ref<WizardData>({ ...initialData });

const schemaComponents = {
  IntroStep,
  PremiumStep,
  ReviewStep,
};

const handleComplete = () => {
  // eslint-disable-next-line no-alert
  alert(`Completed with data: ${JSON.stringify(data.value, null, 2)}`);
};
</script>

<template>
  <div style="max-width: 600px; margin: 40px auto;">
  
    <form-wizard
      title="Schema Wizard"
      :schema="schema"
      :schema-components="schemaComponents"
      v-model="data"
      color="#9b59b6"
      @on-complete="handleComplete"
    />
  </div>
</template>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
