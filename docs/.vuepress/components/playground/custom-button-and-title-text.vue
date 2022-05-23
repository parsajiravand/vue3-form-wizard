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
