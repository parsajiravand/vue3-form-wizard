import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import FormWizard from "../src/components/FormWizard.vue";
import TabContent from "../src/components/TabContent.vue";

const twoSteps = () => [h(TabContent, { title: "Step 1" }), h(TabContent, { title: "Step 2" })];

describe("FormWizard - ids", () => {
  it("gives each wizard on the page a distinct id", async () => {
    const Host = defineComponent({
      setup: () => () =>
        h("div", [
          h(FormWizard, null, { default: twoSteps }),
          h(FormWizard, null, { default: twoSteps }),
        ]),
    });

    const wrapper = mount(Host);
    await flushPromises();

    const ids = wrapper.findAll(".vue-form-wizard").map((el) => el.attributes("id"));
    expect(ids).toHaveLength(2);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it("keeps arrow-key focus inside the wizard that was navigated", async () => {
    const Host = defineComponent({
      setup: () => () =>
        h("div", [
          h(FormWizard, null, { default: twoSteps }),
          h(FormWizard, null, { default: twoSteps }),
        ]),
    });

    const wrapper = mount(Host, { attachTo: document.body });
    await flushPromises();

    const wizards = wrapper.findAllComponents(FormWizard);
    wizards.forEach((wizard) => (wizard.vm as any).activateAll());
    await flushPromises();

    // Both wizards use the same step titles, so both carry a `step-Step10`.
    const second = wizards[1];
    const secondSteps = second.findAll('[role="tab"]');
    (secondSteps[0].element as HTMLElement).focus();

    await second.find(".vue-form-wizard").trigger("keyup.right");

    expect(second.element.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).toBe(secondSteps[1].element);
    wrapper.unmount();
  });

  it("respects an explicitly provided id", async () => {
    const wrapper = mount(FormWizard, { props: { id: "checkout" }, slots: { default: twoSteps } });
    await flushPromises();
    expect(wrapper.find(".vue-form-wizard").attributes("id")).toBe("checkout");
  });

  it("keeps the historical step id shape", async () => {
    const wrapper = mount(FormWizard, {
      slots: { default: () => [h(TabContent, { title: "Step 1" }), h(TabContent, { title: "Step 2" })] },
    });
    await flushPromises();

    const ids = wrapper.findAll('[role="tab"]').map((el) => el.attributes("id"));
    expect(ids).toEqual(["step-Step10", "step-Step21"]);

    const panels = wrapper.findAll('[role="tabpanel"]').map((el) => el.attributes("id"));
    expect(panels).toEqual(["Step10", "Step21"]);
  });
});

describe("FormWizard - accessibility details", () => {
  it("marks unreachable steps as disabled and unfocusable, not the active one", async () => {
    const wrapper = mount(FormWizard, { slots: { default: twoSteps } });
    await flushPromises();

    const [current, upcoming] = wrapper.findAll('[role="tab"]');

    expect(current.attributes("aria-selected")).toBe("true");
    expect(current.attributes("aria-disabled")).toBe("false");
    expect(current.attributes("tabindex")).toBe("0");

    expect(upcoming.attributes("aria-selected")).toBe("false");
    expect(upcoming.attributes("aria-disabled")).toBe("true");
    expect(upcoming.attributes("tabindex")).toBe("-1");
  });

  it("does not leave listitem roles inside the tablist", async () => {
    const wrapper = mount(FormWizard, { slots: { default: twoSteps } });
    await flushPromises();

    wrapper.findAll(".wizard-nav li").forEach((li) => {
      expect(li.attributes("role")).toBe("presentation");
    });
  });

  it("activates footer controls with Space as well as Enter", async () => {
    const wrapper = mount(FormWizard, { slots: { default: twoSteps } });
    await flushPromises();
    const vm: any = wrapper.vm;

    await wrapper.find('.wizard-footer-right [role="button"]').trigger("keyup.space");
    expect(vm.activeTabIndex).toBe(1);

    await wrapper.find('.wizard-footer-left [role="button"]').trigger("keyup.space");
    expect(vm.activeTabIndex).toBe(0);
  });

  it("leaves Space alone for custom content inside the button slots", async () => {
    const wrapper = mount(FormWizard, {
      slots: {
        default: twoSteps,
        next: () => h("input", { class: "custom-next-input", type: "text" }),
      },
      attachTo: document.body,
    });
    await flushPromises();
    const vm: any = wrapper.vm;

    const input = wrapper.find(".custom-next-input");
    const event = new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true, cancelable: true });
    input.element.dispatchEvent(event);

    // The wizard must not swallow a space typed into slot content.
    expect(event.defaultPrevented).toBe(false);

    await input.trigger("keyup.space");
    expect(vm.activeTabIndex).toBe(0);

    wrapper.unmount();
  });

  it("disables the finish button while an async validation is in flight", async () => {
    let resolveValidation: (value: boolean) => void = () => {};
    const wrapper = mount(FormWizard, {
      slots: {
        default: () => [
          h(TabContent, { title: "A" }),
          h(TabContent, {
            title: "B",
            beforeChange: () => new Promise<boolean>((resolve) => { resolveValidation = resolve; }),
          }),
        ],
      },
    });
    await flushPromises();
    const vm: any = wrapper.vm;

    vm.nextTab();
    await flushPromises();
    expect(vm.isLastStep).toBe(true);

    vm.nextTab();
    await wrapper.vm.$nextTick();

    const finish = wrapper.findAll(".wizard-card-footer button").at(-1)!;
    expect(finish.text()).toBe("Finish");
    expect(finish.attributes("disabled")).toBeDefined();

    resolveValidation(true);
    await flushPromises();
    expect(wrapper.findAll(".wizard-card-footer button").at(-1)!.attributes("disabled")).toBeUndefined();
  });
});

describe("FormWizard - keyboard direction", () => {
  const focusStep = async (wrapper: any, index: number) => {
    const step = wrapper.findAll('[role="tab"]')[index];
    (step.element as HTMLElement).focus();
    return step;
  };

  const build = (reverseHorizontal: boolean) =>
    mount(FormWizard, {
      props: { reverseHorizontal },
      slots: {
        default: () => [
          h(TabContent, { title: "A" }),
          h(TabContent, { title: "B" }),
          h(TabContent, { title: "C" }),
        ],
      },
      attachTo: document.body,
    });

  it("moves forward with ArrowRight in normal layout", async () => {
    const wrapper = build(false);
    await flushPromises();
    (wrapper.vm as any).activateAll();
    await flushPromises();

    await focusStep(wrapper, 1);
    await wrapper.find(".vue-form-wizard").trigger("keyup.right");

    expect(document.activeElement?.id).toBe(wrapper.findAll('[role="tab"]')[2].attributes("id"));
    wrapper.unmount();
  });

  it("mirrors arrow keys when the steps are rendered right-to-left", async () => {
    const wrapper = build(true);
    await flushPromises();
    (wrapper.vm as any).activateAll();
    await flushPromises();

    await focusStep(wrapper, 1);
    await wrapper.find(".vue-form-wizard").trigger("keyup.right");

    expect(document.activeElement?.id).toBe(wrapper.findAll('[role="tab"]')[0].attributes("id"));
    wrapper.unmount();
  });
});
