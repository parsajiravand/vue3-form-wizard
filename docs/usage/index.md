A dynamic form wizard to split your forms easier

vue3-form-wizard is a vue based component with **no external depenendcies** which simplifies tab wizard management and allows you to focus on the functional part of your app rather than
wasting time on details. Just forget about id's, external scripts and jQuery dependencies


# Usage

## NPM
`npm install vue3-form-wizard`
## YARN
`yarn add vue3-form-wizard`

## Direct script include
Download the css and js files from `dist` folder or reference them directly from github (check jsfiddle links)
```html
<link rel="stylesheet" href="https://unpkg.com/vue3-form-wizard/dist/style.css">
<script src="https://unpkg.com/vue3-form-wizard"></script>
```
## Component registration
```js
//global registration
import Vue3FormWizard from 'vue-form-wizard'
import 'vue3-form-wizard/dist/style.css'
Vue.use(VueFormWizard)

//local registration
import {FormWizard, TabContent} from 'vue3-form-wizard'
import 'vue3-form-wizard/dist/style.css'
//component code
components: {
  FormWizard,
  TabContent
}
```
## Template usage

```html
<form-wizard>
  <tab-content title="Personal details">
    My first tab content
  </tab-content>
  <tab-content title="Additional Info">
      My second tab content
   </tab-content>
   <tab-content title="Last step">
     Yuhuuu! This seems pretty damn simple
   </tab-content>
</form-wizard>
```
## Compatibility

vue3-form-wizard works with Vue > 3.x