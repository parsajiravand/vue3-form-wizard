<script lang="ts">
import FormWizard from "./components/FormWizard.vue";
import TabContent from "./components/TabContent.vue";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  components: {
    FormWizard,
    TabContent,
  },
  mounted() {
    console.log(this);
  },
  methods: {
    onComplete() {
      alert("Yay. Done!");
    },
    beforeTabSwitch() {
      console.log("switch");
    },
  },
});
</script>

<template>
  <form-wizard @on-complete="onComplete" shape="tab" color="#9b59b6">
    <tab-content
      title="Personal details"
      icon="ti-user"
      :before-change="beforeTabSwitch"
    >
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
