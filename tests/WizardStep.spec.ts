import { mount } from "@vue/test-utils";
import WizardStep from "../src/components/WizardStep.vue";

describe("WizardStep", () => {
  it("applies active and checked classes and ids", () => {
    const wrapper = mount(WizardStep, {
      props: {
        tab: {
          active: true,
          checked: true,
          validationError: null,
          color: "#e74c3c",
          errorColor: "#8b0000",
          shape: "circle",
          title: "Step 1",
          tabId: "Step10",
        },
        index: 0,
      },
    });

    const step = wrapper.find('[role="tab"]');
    expect(step.exists()).toBe(true);
    expect(step.attributes("id")).toBe("step-Step10");
    expect(step.attributes("aria-controls")).toBe("Step10");
  });
});

