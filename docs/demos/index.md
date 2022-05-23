# Playground

## Simple
&nbsp;
<playground-simple />
&nbsp;

```html
<template>
  <form-wizard @on-complete="onComplete">
    <tab-content title="Personal details" icon="ti-user">
      My first tab content
    </tab-content>
    <tab-content title="Additional Info" icon="ti-settings">
      My second tab content
    </tab-content>
    <tab-content title="Last step" icon="ti-check">
      Yuhuuu! This seems pretty damn simple
    </tab-content>
  </form-wizard>
</template>

<script>
import {FormWizard,TabContent} from "vue3-form-wizard";
import 'vue3-form-wizard/dist/style.css'
export default {
  components: {
    FormWizard,
    TabContent,
  },
  methods: {
    onComplete: function () {
      alert("Yay. Done!");
    },
  },
};
</script>
```
&nbsp;&nbsp;
## Square steps

&nbsp;
<playground-squared-step />
&nbsp;

```html
<template>
  <form-wizard @on-complete="onComplete" shape="square" color="#3498db">
    <tab-content title="Personal details" icon="ti-user">
      My first tab content
    </tab-content>
    <tab-content title="Additional Info" icon="ti-settings">
      My second tab content
    </tab-content>
    <tab-content title="Last step" icon="ti-check">
      Yuhuuu! This seems pretty damn simple
    </tab-content>
  </form-wizard>
</template>

<script>
import { FormWizard, TabContent } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";
export default {
  components: {
    FormWizard,
    TabContent,
  },
  methods: {
    onComplete: function () {
      alert("Yay. Done!");
    },
  },
};
</script>
```
## Step index
&nbsp;
<playground-step-index />
&nbsp;

```html
<template>
 <form-wizard @on-complete="onComplete"
                      :start-index="1"
                      color="#e67e22">
            <tab-content title="Personal details"
                         icon="ti-user">
              My first tab content
            </tab-content>
            <tab-content title="Additional Info"
                         icon="ti-settings">
              My second tab content
            </tab-content>
            <tab-content title="Last step"
                         icon="ti-check">
              Yuhuuu! This seems pretty damn simple
            </tab-content>
        </form-wizard>
</template>

<script>
import {FormWizard,TabContent} from "vue3-form-wizard";
import 'vue3-form-wizard/dist/style.css'
export default {
  components: {
    FormWizard,
    TabContent,
  },
  methods: {
    onComplete: function () {
      alert("Yay. Done!");
    },
  },
};
</script>
```

## Custom button and title text
&nbsp;
<playground-custom-button-and-title-text />
&nbsp;

```html
<template>
  <form-wizard
    @on-complete="onComplete"
    title="This is a new title"
    subtitle="And a new subtitle"
    shape="tab"
    back-button-text="Go back!"
    next-button-text="Go next!"
    finish-button-text="We're there"
    color="#9b59b6"
  >
    <tab-content title="Personal details" icon="ti-user">
      My first tab content
    </tab-content>
    <tab-content title="Additional Info" icon="ti-settings">
      My second tab content
    </tab-content>
    <tab-content title="Last step" icon="ti-check">
      Yuhuuu! This seems pretty damn simple
    </tab-content>
  </form-wizard>
</template>

<script>
import { FormWizard, TabContent } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";
export default {
  name: "CustomButtonAndTitleText",
  components: {
    FormWizard,
    TabContent,
  },
  methods: {
    onComplete: function () {
      alert("Yay. Done!");
    },
  },
};
</script>

```

## Custom title slot

&nbsp;
<playground-custom-title-slot />
&nbsp;

```html
<template>
  <form-wizard @on-complete="onComplete" shape="tab" color="#e67e22">
    <template #title>This will replace my whole title</template>

    <tab-content title="Personal details" icon="ti-user">
      My first tab content
    </tab-content>
    <tab-content title="Additional Info" icon="ti-settings">
      My second tab content
    </tab-content>
    <tab-content title="Last step" icon="ti-check">
      Yuhuuu! This seems pretty damn simple
    </tab-content>
  </form-wizard>
</template>

<script>
import { FormWizard, TabContent } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";
export default {
  name: "CustomTitleSlost",
  components: {
    FormWizard,
    TabContent,
  },
  methods: {
    onComplete: function () {
      alert("Yay. Done!");
    },
  },
};
</script>


```

## Call a function before tab switch
## Complete form example integrated with vue-form-generator
## Element UI form integration
## Vuelidate integration
## Dynamic components for tabs
## Vue router integration 
## Async validation with error 
## Customized buttons with scoped slot