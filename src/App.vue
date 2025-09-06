<script setup lang="ts">
import { ref, onMounted } from "vue";
import FormWizard from "./components/FormWizard.vue";
import TabContent from "./components/TabContent.vue";
import "/node_modules/vue3-form-wizard/dist/style.css";

const image = ref("../public/favicon.ico");

const onComplete = () => {
  alert("Yay. Done!");
};

onMounted(() => {
  // App is ready
});
</script>

<template>
  <div>
    <form-wizard @on-complete="onComplete" color="#9b59b6">
      <tab-content title="Personal details" icon="fa fa-user">
        <div>First Step</div>
      </tab-content>
      <tab-content title="Additional Info">
        <div>Second Step</div>
      </tab-content>
      <tab-content title="before step" icon="fa fa-step-forward">
        <div>Third Step</div>
      </tab-content>
      <tab-content title="Last step" icon="fa fa-check">
        <div>Last Step</div>
      </tab-content>
    </form-wizard>
  </div>
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
