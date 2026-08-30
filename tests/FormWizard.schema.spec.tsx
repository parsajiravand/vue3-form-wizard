import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import FormWizard from "../src/components/FormWizard.vue";

const Stub = (label: string) =>
  defineComponent({ props: ["data", "updateData"], render: () => h("div", label) });

describe("FormWizard - schema mode", () => {
  const schema = {
    initialData: { wantsGift: true },
    steps: [
      { id: "account", title: "Account" },
      { id: "gift", title: "Gift", condition: (ctx: any) => ctx.data.wantsGift === true },
      { id: "review", title: "Review" },
    ],
  };

  const build = () => {
    const model = ref<any>({});
    const wrapper = mount(FormWizard, {
      props: {
        schema,
        schemaComponents: { account: Stub("account"), gift: Stub("gift"), review: Stub("review") },
        modelValue: model.value,
        "onUpdate:modelValue": (v: any) => { model.value = v; },
      },
    });
    return wrapper;
  };

  it("keeps the active step when a conditional step is removed elsewhere", async () => {
    const wrapper = build();
    await flushPromises();
    const vm: any = wrapper.vm;

    expect(vm.tabs.map((t: any) => t.title)).toEqual(["Account", "Gift", "Review"]);

    vm.activateAll();
    vm.navigateToTab(2);
    await flushPromises();
    expect(vm.tabs[vm.activeTabIndex].title).toBe("Review");

    // Hiding the middle step must not drag the user onto a different step.
    vm.updateWizardData({ wantsGift: false });
    await flushPromises();

    expect(vm.tabs.map((t: any) => t.title)).toEqual(["Account", "Review"]);
    expect(vm.tabs[vm.activeTabIndex].title).toBe("Review");
  });

  it("gives schema steps stable ids that survive a rebuild", async () => {
    const wrapper = build();
    await flushPromises();
    const vm: any = wrapper.vm;

    const before = vm.tabs.map((t: any) => t.tabId);
    vm.updateWizardData({ unrelated: 1 });
    await flushPromises();

    expect(vm.tabs.map((t: any) => t.tabId)).toEqual(before);
  });
});
