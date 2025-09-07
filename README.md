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

- 🎪 [**Interactive docs & demos**](https://vue3-form-wizard-document.netlify.app/demos/)
- 🦾 **Type Strong**: Written in [Typescript](https://www.typescriptlang.org/), with [TS Docs](https://github.com/microsoft/tsdoc)
- 🌎 **No bundler required**: Usable via CDN
- 🔩 **Flexible**: Configurable event filters and targets

## 🔧 [**Document**](https://vue3-form-wizard-document.netlify.app/usage/)

- ➡️ [**Usagae**](https://vue3-form-wizard-document.netlify.app/usage/)
- ➡️ [**Props**](https://vue3-form-wizard-document.netlify.app/props/)
- ➡️ [**Slots**](https://vue3-form-wizard-document.netlify.app/slots/)
- ➡️ [**Methods**](https://vue3-form-wizard-document.netlify.app/Mmthods/)
- ➡️ [**Scoped-slots**](https://vue3-form-wizard-document.netlify.app/scoped-slots/)
- ➡️ [**Demos**](https://vue3-form-wizard-document.netlify.app/demos/)

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

### Testing Router Functionality

A router test script is included to verify your setup:

```bash
# Run the router test
node test-router.js
```

The test will check:
- ✅ Vue Router installation
- ✅ Router configuration
- ✅ Route definitions
- ✅ Component integration

### Demo

The project includes a complete demo with router integration. Run:

```bash
npm run dev
```

Then visit `http://localhost:5173` to see:
- RouterTest component showing current route
- Navigation buttons for testing
- Route history tracking
- Automatic URL updates when switching tabs



## Until the version is completely stable
- [x] Updated To Vue3 ✅
- [x] Setup with Vite ✅
- [x] Add declaration type(Typescript Support)✅
- [ ] Fix All Issue on vue-form-wizard 🚧
- [x] Rewrite With Setup Function and ts ✅
- [ ] Setup New Features🚧
- [x] Setup New Documentation ✅

### This is a cloned package from  [vue-form-wizard](https://github.com/BinarCode/vue-form-wizard).Updated to vue 3 with new features and bug fixes


#### [Old Documentation](https://binarcode.github.io/vue-form-wizard/#/)