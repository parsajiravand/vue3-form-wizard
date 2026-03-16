<script setup lang="ts">
import { ref, defineComponent, h } from "vue";
import FormWizard from "./components/FormWizard.vue";
import TabContent from "./components/TabContent.vue";
import type { FormWizardSchema, WizardData } from "./types";
// import "/node_modules/vue3-form-wizard/dist/style.css";

const currentSample = ref("1");

const samples = [
  { id: "1", label: "1. Basic – 3 steps" },
  { id: "2", label: "2. With icons (Font Awesome)" },
  { id: "3", label: "3. Custom button text" },
  { id: "4", label: "4. Vertical layout" },
  { id: "5", label: "5. Step sizes (xs, sm, md, lg)" },
  { id: "6", label: "6. Square & tab shapes" },
  { id: "7", label: "7. beforeChange validation" },
  { id: "8", label: "8. Lazy tab content" },
  { id: "9", label: "9. Custom title slot" },
  { id: "10", label: "10. Custom colors" },
  { id: "11", label: "11. Custom footer slots" },
  { id: "12", label: "12. Start at step 2" },
  { id: "13", label: "13. Disable back button" },
  { id: "14", label: "14. Schema mode – conditional steps" },
  { id: "15", label: "15. Schema mode – async validation" },
  { id: "16", label: "16. RTL content + reversed steps" },
];

// Schema mode step components (render functions – no template compiler)
const IntroStep = defineComponent({
  name: "IntroStep",
  props: { data: { type: Object as () => WizardData, required: true }, updateData: { type: Function as any, required: true } },
  setup(props) {
    return () =>
      h("div", [
        h("h2", "Choose plan"),
        h("p", "Select a plan to continue."),
        h("label", ["Plan: ", h("select", { value: props.data.plan, onChange: (e: Event) => props.updateData({ plan: (e.target as HTMLSelectElement).value }) }, [h("option", { value: "basic" }, "Basic"), h("option", { value: "premium" }, "Premium")])]),
      ]);
  },
});

const PremiumStep = defineComponent({
  name: "PremiumStep",
  props: { data: { type: Object as () => WizardData, required: true }, updateData: { type: Function as any, required: true } },
  setup() {
    return () => h("div", [h("h2", "Premium features"), h("p", [h("strong", "premium"), " plan – extra configuration."])]);
  },
});

const ReviewStep = defineComponent({
  name: "ReviewStep",
  props: { data: { type: Object as () => WizardData, required: true }, updateData: { type: Function as any, required: true } },
  setup(props) {
    return () => h("div", [h("h2", "Review"), h("pre", JSON.stringify(props.data, null, 2))]);
  },
});

const schemaData = ref<WizardData>({ plan: "basic" });
const schemaData15 = ref<WizardData>({ email: "" });

const schema14: FormWizardSchema = {
  initialData: { plan: "basic" },
  steps: [
    { id: "intro", title: "Intro", component: "IntroStep" },
    { id: "premium", title: "Premium", component: "PremiumStep", condition: ({ data }) => data.plan === "premium" },
    { id: "review", title: "Review", component: "ReviewStep", validate: ({ data }) => (data.plan ? true : "Select a plan") },
  ],
};

const EmailStep = defineComponent({
  name: "EmailStep",
  props: { data: { type: Object as () => WizardData, required: true }, updateData: { type: Function as any, required: true } },
  setup(props) {
    return () =>
      h("div", [
        h("h2", "Enter email"),
        h("input", {
          type: "email",
          value: props.data.email,
          onInput: (e: Event) => props.updateData({ email: (e.target as HTMLInputElement).value }),
          placeholder: "email@example.com",
          style: "padding:8px;width:100%;max-width:280px;",
        }),
      ]);
  },
});

const DoneStep = defineComponent({
  name: "DoneStep",
  props: { data: { type: Object as () => WizardData, required: true }, updateData: { type: Function as any, required: true } },
  setup(props) {
    return () => h("div", [h("h2", "All set"), h("p", "Email: " + (props.data.email || "(none)"))]);
  },
});

const schemaComponents = { IntroStep, PremiumStep, ReviewStep, EmailStep, DoneStep };

const handleComplete = (sampleId: string) => {
  // eslint-disable-next-line no-alert
  alert(`Sample ${sampleId} completed!`);
};
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Vue3 Form Wizard – 15 Samples</h1>
      <label>
        Select sample:
        <select v-model="currentSample" class="sample-select">
          <option v-for="s in samples" :key="s.id" :value="s.id">{{ s.label }}</option>
        </select>
      </label>
    </header>

    <main class="main">
      <!-- 1. Basic -->
      <div v-show="currentSample === '1'" class="sample">
        <form-wizard title="Basic Wizard" color="#3498db" @on-complete="handleComplete('1')">
          <tab-content title="Step 1"><div><h2>Step 1</h2><p>First step content.</p></div></tab-content>
          <tab-content title="Step 2"><div><h2>Step 2</h2><p>Second step content.</p></div></tab-content>
          <tab-content title="Step 3"><div><h2>Step 3</h2><p>Third step content.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 2. Icons -->
      <div v-show="currentSample === '2'" class="sample">
        <form-wizard title="With Icons" color="#9b59b6" @on-complete="handleComplete('2')">
          <tab-content title="Personal" icon="fa fa-user"><div><h2>Personal</h2><p>Your details.</p></div></tab-content>
          <tab-content title="Details" icon="fa fa-file"><div><h2>Details</h2><p>More info.</p></div></tab-content>
          <tab-content title="Finish" icon="fa fa-check"><div><h2>Finish</h2><p>All done.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 3. Custom button text -->
      <div v-show="currentSample === '3'" class="sample">
        <form-wizard
          title="Custom Buttons"
          next-button-text="Continue →"
          back-button-text="← Go back"
          finish-button-text="Submit"
          color="#e67e22"
          @on-complete="handleComplete('3')"
        >
          <tab-content title="One"><div><p>Step one.</p></div></tab-content>
          <tab-content title="Two"><div><p>Step two.</p></div></tab-content>
          <tab-content title="Three"><div><p>Step three.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 4. Vertical layout -->
      <div v-show="currentSample === '4'" class="sample vertical-sample">
        <form-wizard title="Vertical Layout" layout="vertical" color="#1abc9c" @on-complete="handleComplete('4')">
          <tab-content title="Step 1"><div><p>Vertical step 1.</p></div></tab-content>
          <tab-content title="Step 2"><div><p>Vertical step 2.</p></div></tab-content>
          <tab-content title="Step 3"><div><p>Vertical step 3.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 5. Step sizes -->
      <div v-show="currentSample === '5'" class="sample">
        <form-wizard title="Small Steps" step-size="sm" color="#34495e" @on-complete="handleComplete('5')">
          <tab-content title="S1"><div><p>Small steps.</p></div></tab-content>
          <tab-content title="S2"><div><p>Compact.</p></div></tab-content>
          <tab-content title="S3"><div><p>Done.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 6. Shapes -->
      <div v-show="currentSample === '6'" class="sample">
        <form-wizard title="Square Shape" shape="square" color="#8e44ad" @on-complete="handleComplete('6')">
          <tab-content title="A"><div><p>Square steps.</p></div></tab-content>
          <tab-content title="B"><div><p>Step B.</p></div></tab-content>
          <tab-content title="C"><div><p>Step C.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 7. beforeChange validation -->
      <div v-show="currentSample === '7'" class="sample">
        <form-wizard title="Validation" color="#c0392b" @on-complete="handleComplete('7')">
          <tab-content title="Step 1" :before-change="() => true">
            <div><h2>Step 1</h2><p>Click Next to continue.</p></div>
          </tab-content>
          <tab-content title="Step 2 (Blocked)" :before-change="() => false">
            <div><h2>Step 2</h2><p>beforeChange returns false – you cannot leave this step.</p></div>
          </tab-content>
          <tab-content title="Step 3"><div><h2>Step 3</h2><p>Final step.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 8. Lazy tabs -->
      <div v-show="currentSample === '8'" class="sample">
        <form-wizard title="Lazy Content" color="#16a085" @on-complete="handleComplete('8')">
          <tab-content title="Eager" lazy><div><p>Rendered when step is active.</p></div></tab-content>
          <tab-content title="Lazy 2" lazy><div><p>Lazy step 2.</p></div></tab-content>
          <tab-content title="Lazy 3" lazy><div><p>Lazy step 3.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 9. Custom title slot -->
      <div v-show="currentSample === '9'" class="sample">
        <form-wizard title="Default Title" color="#2980b9" @on-complete="handleComplete('9')">
          <template #title>
            <h4 class="wizard-title">Custom Title Slot</h4>
            <p class="category">This header is overridden via the title slot.</p>
          </template>
          <tab-content title="Step 1"><div><p>Step 1.</p></div></tab-content>
          <tab-content title="Step 2"><div><p>Step 2.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 10. Custom colors -->
      <div v-show="currentSample === '10'" class="sample">
        <form-wizard title="Blue Theme" color="#2980b9" error-color="#c0392b" @on-complete="handleComplete('10')">
          <tab-content title="Blue"><div><p>Custom color theme.</p></div></tab-content>
          <tab-content title="Step 2"><div><p>Step 2.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 11. Custom footer slots -->
      <div v-show="currentSample === '11'" class="sample">
        <form-wizard title="Custom Footer" color="#27ae60" @on-complete="handleComplete('11')">
          <template #footer="{ prevTab, nextTab, isLastStep, activeTabIndex }">
            <div class="wizard-footer-left">
              <button v-if="activeTabIndex > 0" @click="prevTab">← Back</button>
            </div>
            <div class="wizard-footer-right">
              <button v-if="isLastStep" @click="nextTab">Complete</button>
              <button v-else @click="nextTab">Next →</button>
            </div>
          </template>
          <tab-content title="1"><div><p>Custom footer buttons.</p></div></tab-content>
          <tab-content title="2"><div><p>Step 2.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 12. Start at step 2 -->
      <div v-show="currentSample === '12'" class="sample">
        <form-wizard title="Start at Step 2" :start-index="1" color="#8e44ad" @on-complete="handleComplete('12')">
          <tab-content title="Step 1"><div><p>Step 1 (skipped on load).</p></div></tab-content>
          <tab-content title="Step 2"><div><h2>Step 2</h2><p>Wizard starts here.</p></div></tab-content>
          <tab-content title="Step 3"><div><p>Step 3.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 13. Disable back -->
      <div v-show="currentSample === '13'" class="sample">
        <form-wizard title="No Back Button" :disable-back="true" color="#d35400" @on-complete="handleComplete('13')">
          <tab-content title="Step 1"><div><p>Back button is hidden.</p></div></tab-content>
          <tab-content title="Step 2"><div><p>Step 2.</p></div></tab-content>
          <tab-content title="Step 3"><div><p>Step 3.</p></div></tab-content>
        </form-wizard>
      </div>

      <!-- 14. Schema mode - conditional steps -->
      <div v-show="currentSample === '14'" class="sample">
        <form-wizard
          title="Schema: Conditional Steps"
          :schema="schema14"
          :schema-components="schemaComponents"
          v-model="schemaData"
          color="#9b59b6"
          @on-complete="handleComplete('14')"
        />
      </div>

      <!-- 15. Schema mode - async validation -->
      <div v-show="currentSample === '15'" class="sample">
        <form-wizard
          title="Schema: Async Validation"
          :schema="{
            initialData: { email: '' },
            steps: [
              {
                id: 'email',
                title: 'Email',
                component: 'EmailStep',
                validate: ({ data }) => {
                  const ok = /^[^@]+@[^@]+\.\w+$/.test(data.email || '');
                  return ok ? true : 'Enter a valid email';
                },
              },
              { id: 'done', title: 'Done', component: 'DoneStep' },
            ],
          }"
          :schema-components="schemaComponents"
          v-model="schemaData15"
          color="#2c3e50"
          @on-complete="handleComplete('15')"
        />
      </div>

      <!-- 16. RTL content + reversed steps -->
      <div v-show="currentSample === '16'" class="sample">
        <form-wizard
          title="تست راست چین"
          rtl
          reverse-horizontal
          back-button-text="قبلی"
          next-button-text="بعدی"
          finish-button-text="تکمیل"
          color="#3498db"
          @on-complete="handleComplete('16')"
        >
          <tab-content title="مرحله ۱">
            <div>
              <h2>تست راست چین مرحله ۱</h2>
              <p> محتوای مرحله ۱ </p>
            </div>
          </tab-content>
          <tab-content title="مرحله ۲">
            <div>
              <h2>تست راست چین مرحله ۲</h2>
              <p> محتوای مرحله ۲ </p>
            </div>
          </tab-content>
          <tab-content title="مرحله ۳">
            <div>
              <h2>تست راست چین مرحله ۳</h2>
              <p> محتوای مرحله ۳ </p>
            </div>
          </tab-content>
        </form-wizard>
      </div>
    </main>
  </div>
</template>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css");

* {
  box-sizing: border-box;
}

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #ecf0f1;
}

.header h1 {
  font-size: 1.5rem;
  margin: 0 0 12px;
}

.sample-select {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  min-width: 280px;
}

.main {
  min-height: 300px;
}

.sample {
  padding: 16px 0;
}

.vertical-sample {
  max-width: 500px;
}

.wizard-footer-left,
.wizard-footer-right {
  display: flex;
  gap: 8px;
}

.wizard-footer-left button,
.wizard-footer-right button {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #3498db;
  background: #3498db;
  color: white;
  cursor: pointer;
}

.wizard-footer-left button:hover,
.wizard-footer-right button:hover {
  opacity: 0.9;
}
</style>
