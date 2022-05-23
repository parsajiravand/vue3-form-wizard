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
## Tabbed steps
&nbsp;
<playground-tabbed-steps />
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

## Start from a specific index
## Custom button and title text
## Customize buttons with footer slot
## Call a function before tab switch
## Async validation