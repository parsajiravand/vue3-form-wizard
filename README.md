# Vue3 form wizard

**A dynamic wizard to split your forms easier**

  




Vue3-form-wizard is a vue based component with no external depenendcies which simplifies tab wizard management.



  


  
 **[📚Document](https://vue3-form-wizard-document.netlify.app/usage) ・ [🔎 Demos](https://vue3-form-wizard-document.netlify.app/demos) ・ [🔬 Playground**](https://vue3-form-wizard-document.netlify.app/playground)

## Dependencies

- required: Vuejs >= 3.x

## Installation

```bash
npm install vue3-form-wizard --save
```

```bash
yarn add vue3-form-wizard
```

## 🚀 Features

- **Schema mode**: Declarative steps with `schema`, `condition`, `validate`, and `v-model`
- **Classic mode**: Slot-based steps with `<tab-content>`
- **Vue Router**: URL sync with `route` prop (optional)
- **Dynamic steps**: Add or remove steps with `v-if` at runtime
- **RTL**: Right-to-left content, and optionally right-to-left steps
- **Accessibility**: ARIA tablist semantics, full keyboard support
- **TypeScript**: Full type support

## 🔧 **[Document](https://vue3-form-wizard-document.netlify.app/usage/)**

- ➡️ **[Usage](https://vue3-form-wizard-document.netlify.app/usage/)**
- ➡️ **[Props](https://vue3-form-wizard-document.netlify.app/props/)**
- ➡️ **[Slots](https://vue3-form-wizard-document.netlify.app/slots/)**
- ➡️ **[Methods](https://vue3-form-wizard-document.netlify.app/methods/)**
- ➡️ **[Scoped-slots](https://vue3-form-wizard-document.netlify.app/scoped-slots/)**
- ➡️ **[Demos](https://vue3-form-wizard-document.netlify.app/demos/)**

## Quick start

```vue
<script setup>
import { FormWizard, TabContent } from 'vue3-form-wizard'
import 'vue3-form-wizard/dist/style.css'

const onComplete = () => alert('Done!')
</script>

<template>
  <form-wizard @on-complete="onComplete" color="#9b59b6">
    <tab-content title="Step 1">
      <p>First step content.</p>
    </tab-content>
    <tab-content title="Step 2">
      <p>Second step content.</p>
    </tab-content>
    <tab-content title="Step 3">
      <p>Final step.</p>
    </tab-content>
  </form-wizard>
</template>
```

Register globally or use components locally; include the CSS. See [Schema mode](#schema-mode) and [Router Integration](#-router-integration) for more.

## 🔗 Router Integration

Vue3 Form Wizard now supports automatic route synchronization with Vue Router!

### Setup

First, install Vue Router:

```bash
npm install vue-router@4.1.6
```

Configure your Vue app with Vue Router:

```javascript
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Your routes
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
```

### Usage

Add `route` prop to your `tab-content` components:

```vue
<template>
  <form-wizard @on-complete="onComplete" color="#9b59b6">
    <tab-content title="Step 1" route="/step1">
      Content for step 1
    </tab-content>
    <tab-content title="Step 2" route="/step2">
      Content for step 2
    </tab-content>
    <tab-content title="Step 3" route="/step3">
      Content for step 3
    </tab-content>
  </form-wizard>
</template>
```

### Features

- ✅ **Automatic Navigation**: Tab changes update the URL
- ✅ **URL Sync**: Direct URL access navigates to the correct tab
- ✅ **Browser History**: Back/forward buttons work correctly
- ✅ **Deep Linking**: Shareable URLs for specific wizard steps

### Route Types

The `route` prop accepts:

- **String**: `route="/step1"` - Direct path
- **Object**: `route="{ name: 'step1', params: { id: 1 } }"` - Named routes with params

## Schema Mode

Define wizard steps declaratively with conditions and validation:

```vue

<template>
  <FormWizard
    title="Schema: Basic"
    :schema="schema"
    :schema-components="schemaComponents"
    v-model="schemaData"
    @on-complete="onComplete"
  />
</template>

<script setup>
import { ref } from "vue";
import { FormWizard } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";
import SimpleStep from "./schema-steps/SimpleStep.vue";
import DoneStep from "./schema-steps/DoneStep.vue";

const schema = {
  initialData: { plan: "basic" },
  steps: [
    { id: "intro", title: "Intro", component: "SimpleStep" },
    { id: "review", title: "Review", component: "DoneStep" },
  ],
};

const schemaComponents = { SimpleStep, DoneStep };
const schemaData = ref();
const onComplete = () => alert("Done!");
</script>

```

## Schema mode with DefineComponent

```vue
<template>
  <FormWizard
    title="Schema: defineComponent"
    :schema="schema"
    :schema-components="schemaComponents"
    v-model="schemaData"
    color="#8e44ad"
    @on-complete="onComplete"
  />
</template>

<script setup>
import { ref, defineComponent, h } from "vue";
import { FormWizard } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";

// Step components using defineComponent with setup returning render function
const NameStep = defineComponent({
  name: "NameStep",
  props: {
    data: { type: Object, required: true },
    updateData: { type: Function, required: true },
  },
  setup(props) {
    return () =>
      h("div", [
        h("h2", "Your name"),
        h("input", {
          type: "text",
          value: props.data.name,
          placeholder: "Name",
          onInput: (e) => props.updateData({ name: e.target.value }),
          style: "padding:8px;width:100%;max-width:240px;margin-bottom:8px;",
        }),
      ]);
  },
});

const SummaryStep = defineComponent({
  name: "SummaryStep",
  props: {
    data: { type: Object, required: true },
    updateData: { type: Function, required: true },
  },
  setup(props) {
    return () =>
      h("div", [
        h("h2", "Summary"),
        h("p", ["Hello, ", h("strong", props.data.name || "Guest"), "!"]),
      ]);
  },
});

const schema = {
  initialData: { name: "" },
  steps: [
    { id: "name", title: "Name", component: "NameStep" },
    { id: "summary", title: "Summary", component: "SummaryStep" },
  ],
};

const schemaComponents = { NameStep, SummaryStep };
const schemaData = ref({ name: "" });
const onComplete = () => alert("Done!");
</script>

```

Step components receive `data` and `update-data` props. Use `condition` to hide steps dynamically and `validate` to block navigation.

## RTL support

Two independent props, so you can flip the content without flipping the stepper:

| Prop                 | Effect                                                                      |
| -------------------- | --------------------------------------------------------------------------- |
| `rtl`                | Renders step **content** right-to-left. Steps and progress bar stay as they are. |
| `reverse-horizontal` | Runs the **steps, progress bar and footer buttons** right-to-left. Horizontal layouts only. |

Use both together for a fully right-to-left wizard:

```vue
<template>
  <form-wizard rtl reverse-horizontal title="ثبت‌نام" next-button-text="بعدی" back-button-text="قبلی" finish-button-text="پایان">
    <tab-content title="اطلاعات">…</tab-content>
    <tab-content title="بررسی">…</tab-content>
  </form-wizard>
</template>
```

Arrow-key navigation follows what you see: with `reverse-horizontal`, <kbd>→</kbd> moves to the step on the right, which is the *previous* step.

Sample Demo:
[RTL support](https://vue3-form-wizard-document.netlify.app/demos/#rtl-support)

## Dynamic steps

Steps can be added or removed at runtime and the wizard keeps up: a step revealed by `v-if` appears at its position in the markup, not at the end, and a removed step leaves the navigation, the progress bar and the step count.

```vue
<template>
  <form-wizard>
    <tab-content title="Account">…</tab-content>
    <tab-content v-if="needsBilling" title="Billing">…</tab-content>
    <tab-content title="Review">…</tab-content>
  </form-wizard>
</template>
```

Changing a step's props later — `title` when the language changes, `route`, `before-change` — is picked up too. In schema mode, use a step `condition` instead.

## Accessibility

- The stepper is a proper `tablist` / `tab` / `tabpanel` structure, with `aria-controls` and `aria-labelledby` wired between each step and its panel.
- Steps that have not been reached are excluded from the tab order and marked `aria-disabled`.
- <kbd>←</kbd> / <kbd>→</kbd> move focus between reachable steps, mirrored under `reverse-horizontal`.
- <kbd>Enter</kbd> and <kbd>Space</kbd> both activate steps and the Back / Next / Finish controls.
- Back, Next and Finish are disabled while an async `before-change` is in flight.

If you replace the `next` / `prev` / `finish` slots, render a plain element inside them — the wrapper the wizard provides already carries `role="button"` and the keyboard handlers.



## Local Samples & Tests

Run the dev server for 15 samples:

```bash
npm run dev
```

Visit `http://localhost:5173` and use the dropdown to switch between samples: basic wizard, icons, layouts, shapes, validation, schema mode, and more.

Run tests:

```bash
npm run test
```

## Scripts


| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start dev server with samples |
| `npm run build` | Build library and types       |
| `npm run test`  | Run Vitest test suite         |


## Credits

Cloned from [vue-form-wizard](https://github.com/BinarCode/vue-form-wizard), updated to Vue 3 with new features and bug fixes.