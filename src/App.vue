<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import FormWizard from "./components/FormWizard.vue";
import TabContent from "./components/TabContent.vue";
import "/node_modules/vue3-form-wizard/dist/style.css";

export default defineComponent({
  components: {
    FormWizard,
    TabContent,
  },
  data() {
    return {
      image: "../public/favicon.ico",
    };
  },
  mounted() {
    console.log(this);
  },
  methods: {
    onComplete() {
      alert("Yay. Done!");
    },
  },
});
</script>

<template>
  <form-wizard @on-complete="onComplete" color="#9b59b6">
    <tab-content
      title="Personal details"
      icon="fa fa-user"
      :customIcon="`<img  src='${image}' />`"
    >
      My first tab content
    </tab-content>
    <tab-content title="Additional Info"> My second tab content </tab-content>
    <tab-content title="before step" icon="fa fa-check">
      Yuhuuu! This seems pretty damn simple
    </tab-content>
    <tab-content title="Last step" icon="fa fa-check">
      Yuhuuu! This seems pretty damn simple
    </tab-content>
  </form-wizard>
</template>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
