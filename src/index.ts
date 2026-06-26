import { App } from "vue";
import FormWizard from "./components/FormWizard.vue";
import TabContent from "./components/TabContent.vue";
import WizardButton from "./components/WizardButton.vue";
import WizardStep from "./components/WizardStep.vue";

// Export all types for TypeScript users
export * from "./types";

const VueFormWizard = {
  install(Vue: App) {
    Vue.component("form-wizard", FormWizard);
    Vue.component("tab-content", TabContent);
    Vue.component("wizard-button", WizardButton);
    Vue.component("wizard-step", WizardStep);
  },
};

// Automatic installation if Vue has been added to the global scope.
/* if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueFormWizard)
} */

export default VueFormWizard;
export { FormWizard, TabContent, WizardButton, WizardStep };
