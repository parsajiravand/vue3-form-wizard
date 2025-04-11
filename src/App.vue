<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import FormWizard from "./components/FormWizard.vue";
import TabContent from "./components/TabContent.vue";
import "/node_modules/vue3-form-wizard/dist/style.css";

//please give me a random list of titls
const TabesToUse= [
  {
    title: "Adventure",
    icon: "fas fa-map",
    content: "This is the adventure tab",
  },
  {
    title: "Mystery",
    icon: "fas fa-search",
    content: "This is the mystery tab",
  },
  {
    title: "Fantasy",
    icon: "fas fa-magic",
    content: "This is the fantasy tab",
  },
  {
    title: "Science",
    icon: "fas fa-flask",
    content: "This is the science tab",
  },
  {
    title: "History",
    icon: "fas fa-book",
    content: "This is the history tab",
  },
  {
    title: "Travel",
    icon: "fas fa-plane",
    content: "This is the travel tab",
  },
  {
    title: "Music",
    icon: "fas fa-music",
    content: "This is the music tab",
  },
  {
    title: "Art",
    icon: "fas fa-paint-brush",
    content: "This is the art tab",
  },
  {
    title: "Technology",
    icon: "fas fa-laptop",
    content: "This is the technology tab",
  },
  {
    title: "Sports",
    icon: "fas fa-football-ball",
    content: "This is the sports tab",
  },
];

export default defineComponent({
  components: {
    FormWizard,
    TabContent,
  },
  data() {
    return {
      image: "../public/favicon.ico",
      aTab:[],
    };
  },
  mounted() {
    const randomIndex = Math.floor(Math.random() * TabesToUse.length);
    this.aTab.push(TabesToUse[randomIndex]);
  
  },
  methods: {
    onComplete() {
      alert("Yay. Done!");
    },
    addTab() {
      const randomIndex = Math.floor(Math.random() * TabesToUse.length);
      this.aTab.push(TabesToUse[randomIndex]);
    },
    removeTab() {
      if (this.aTab.length > 0) {
        this.aTab.pop();
      } else {
        alert("No more tabs to remove");
      }
    },
  },
});
</script>

<template>
  <button @click="addTab">Add Tab</button>
  <button @click="removeTab">Remove Tab</button>
  <pre>
    Size: {{ aTab.length }}
  </pre>
  <form-wizard @on-complete="onComplete" color="#9b59b6">

    <tab-content v-for="(wiz, index) in aTab" :title="wiz.title" :icon="wiz.icon">
      <pre>{{ wiz }}</pre>
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
