<h1 align="center">Vue3 form wizard</h1>


<p align="center"><b>A dynamic wizard to split your forms easier</b></p>
<br>
<p align="center">
  <a href="http://vue3-form-wizard-document.netlify.com"><img src="https://i.postimg.cc/258CSGbV/vue3-form-wizard-icon.png" alt="Demo" width="160"></a>
  <p align="center">Vue3-form-wizard is a vue based component with no external depenendcies which simplifies tab wizard management.</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vue3-form-wizard">
    <img src="https://img.shields.io/npm/v/vue3-form-wizard.svg?style=flat-square" alt="version">
  </a>
  <a href="https://github.com/parsajiravand/vue3-form-wizard/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/vue3-form-wizard.svg?style=flat-square" alt="MIT license">
  </a>
  <a href="http://npmcharts.com/compare/vue3-form-wizard">
    <img src="https://img.shields.io/npm/dm/vue3-form-wizard.svg?style=flat-square" alt="downloads">
  </a>
  <br>
  <a href="https://unpkg.com/vue3-form-wizard/dist/">
    <img src="http://img.badgesize.io/https://unpkg.com/vue3-form-wizard/dist/vue3-form-wizard.umd.js?compression=gzip&label=gzip%20size&style=flat-square" alt="gzip size">
  </a>
  <a href="https://github.com/parsajiravand/vue3-form-wizard/blob/master/package.json">
    <img src="https://img.shields.io/badge/dependencies-none-lightgrey.svg?style=flat-square" alt="no dependencies">
  </a>
  <a href="https://travis-ci.org/parsajiravand/vue3-form-wizard">
    <img src="https://img.shields.io/travis/parsajiravand/vue3-form-wizard.svg?style=flat-square" alt="travis">
  </a>
</p>

<p align="center">
  <br>
  <strong>
  <a style="font-size:20px" href="https://vue3-form-wizard-document.netlify.app/usage"> 📚Document</a> ・
  <a style="font-size:20px" href="https://vue3-form-wizard-document.netlify.app/demos">🔎 Demos</a> ・
  <a style="font-size:20px" href="https://vue3-form-wizard-document.netlify.app/playground"> 🔬 Playground</a>
  </strong>
</p>

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
- **Accessibility**: ARIA roles, keyboard navigation
- **TypeScript**: Full type support

## 🔧 [**Document**](https://vue3-form-wizard-document.netlify.app/usage/)

- ➡️ [**Usage**](https://vue3-form-wizard-document.netlify.app/usage/)
- ➡️ [**Props**](https://vue3-form-wizard-document.netlify.app/props/)
- ➡️ [**Slots**](https://vue3-form-wizard-document.netlify.app/slots/)
- ➡️ [**Methods**](https://vue3-form-wizard-document.netlify.app/methods/)
- ➡️ [**Scoped-slots**](https://vue3-form-wizard-document.netlify.app/scoped-slots/)
- ➡️ [**Demos**](https://vue3-form-wizard-document.netlify.app/demos/)

## Quick start

```vue
<script setup>
import FormWizard, { TabContent } from 'vue3-form-wizard'
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
<script setup>
import FormWizard, { type FormWizardSchema, type WizardData } from 'vue3-form-wizard';
import MyStep from './MyStep.vue';

const schema = {
  initialData: { plan: 'basic' },
  steps: [
    { id: 'intro', title: 'Intro', component: 'MyStep' },
    {
      id: 'premium',
      title: 'Premium',
      component: 'PremiumStep',
      condition: ({ data }) => data.plan === 'premium',
    },
    {
      id: 'review',
      title: 'Review',
      component: 'ReviewStep',
      validate: ({ data }) => (data.plan ? true : 'Select a plan'),
    },
  ],
};

const data = ref({ plan: 'basic' });
</script>

<template>
  <form-wizard
    :schema="schema"
    :schema-components="{ MyStep, PremiumStep, ReviewStep }"
    v-model="data"
    @on-complete="handleComplete"
  />
</template>
```

Step components receive `data` and `update-data` props. Use `condition` to hide steps dynamically and `validate` to block navigation.

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

| Command      | Description                |
|-------------|----------------------------|
| `npm run dev`   | Start dev server with samples |
| `npm run build` | Build library and types     |
| `npm run test`  | Run Vitest test suite       |

## Credits

Cloned from [vue-form-wizard](https://github.com/BinarCode/vue-form-wizard), updated to Vue 3 with new features and bug fixes.