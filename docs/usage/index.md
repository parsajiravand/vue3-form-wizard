A dynamic form wizard to split your forms easier

Vue-form-wizard is a vue based component with **no external depenendcies** which simplifies tab wizard management and allows you to focus on the functional part of your app rather than
wasting time on details. Just forget about id's, external scripts and jQuery dependencies


# Usage

## NPM
`npm install vue-form-wizard`

## Direct script include
Download the css and js files from `dist` folder or reference them directly from github (check jsfiddle links)
```html
<link rel="stylesheet" href="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.min.css">
<script src="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.js"></script>
```
## Component registration
```js
//global registration
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
Vue.use(VueFormWizard)

//local registration
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
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

Vue-form-wizard works with Vue > 2.2, but the examples in the docs follow the latest Vue > 2.5 changes especially on the `slot` parts.
If you use vue < 2.5.x, use `scope="props"` instead of `slot-scope="props"` for scoped slots. See [Vue 2.5 simplified scoped slots](https://gist.github.com/yyx990803/9bdff05e5468a60ced06c29c39114c6b#simplified-scoped-slots-usage)