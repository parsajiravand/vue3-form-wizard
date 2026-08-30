import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import FormWizard from "../src/components/FormWizard.vue";
import TabContent from "../src/components/TabContent.vue";

const titles = (wrapper: any) =>
  (wrapper.findComponent(FormWizard).vm as any).tabs.map((t: any) => t.title);

describe("FormWizard - dynamic steps", () => {
  it("unregisters a step when its <tab-content> is removed", async () => {
    const show = ref(true);
    const Host = defineComponent({
      setup: () => () =>
        h(FormWizard, null, {
          default: () => [
            h(TabContent, { title: "A" }),
            ...(show.value ? [h(TabContent, { title: "Optional" })] : []),
            h(TabContent, { title: "C" }),
          ],
        }),
    });

    const wrapper = mount(Host);
    await flushPromises();
    expect(titles(wrapper)).toEqual(["A", "Optional", "C"]);

    show.value = false;
    await flushPromises();

    expect(titles(wrapper)).toEqual(["A", "C"]);
    expect(wrapper.findAll(".wizard-nav li")).toHaveLength(2);
  });

  it("inserts a late-mounting step at its markup position, not at the end", async () => {
    const show = ref(false);
    const Host = defineComponent({
      setup: () => () =>
        h(FormWizard, null, {
          default: () => [
            h(TabContent, { title: "First" }),
            ...(show.value ? [h(TabContent, { title: "Middle" })] : []),
            h(TabContent, { title: "Last" }),
          ],
        }),
    });

    const wrapper = mount(Host);
    await flushPromises();
    expect(titles(wrapper)).toEqual(["First", "Last"]);

    show.value = true;
    await flushPromises();

    expect(titles(wrapper)).toEqual(["First", "Middle", "Last"]);
  });

  it("orders a lazy step correctly even while its panel is not rendered", async () => {
    const show = ref(false);
    const Host = defineComponent({
      setup: () => () =>
        h(FormWizard, null, {
          default: () => [
            h(TabContent, { title: "First" }),
            ...(show.value ? [h(TabContent, { title: "Middle", lazy: true })] : []),
            h(TabContent, { title: "Last", lazy: true }),
          ],
        }),
    });

    const wrapper = mount(Host);
    await flushPromises();
    show.value = true;
    await flushPromises();

    expect(titles(wrapper)).toEqual(["First", "Middle", "Last"]);
  });

  it("never leaves a negative active index when the active step is removed", async () => {
    const wrapper = mount(FormWizard, {
      slots: { default: () => [h(TabContent, { title: "A" }), h(TabContent, { title: "B" })] },
    });
    await flushPromises();
    const vm: any = wrapper.vm;

    vm.removeTab(vm.tabs[0]);
    await flushPromises();

    expect(vm.activeTabIndex).toBe(0);
    expect(vm.maxStep).toBeGreaterThanOrEqual(0);
    expect(vm.tabs.map((t: any) => t.title)).toEqual(["B"]);
    expect(vm.tabs[0].active).toBe(true);
  });

  it("resets cleanly when every step is gone", async () => {
    const wrapper = mount(FormWizard, {
      slots: { default: () => [h(TabContent, { title: "Only" })] },
    });
    await flushPromises();
    const vm: any = wrapper.vm;

    vm.removeTab(vm.tabs[0]);
    await flushPromises();

    expect(vm.tabs).toHaveLength(0);
    expect(vm.activeTabIndex).toBe(0);
    expect(() => vm.reset()).not.toThrow();
    expect(() => vm.nextTab()).not.toThrow();
  });
});

describe("FormWizard - inserting before the active step", () => {
  it("keeps every step in markup order and the user on a valid step", async () => {
    const show = ref(false);
    const Host = defineComponent({
      setup: () => () =>
        h(FormWizard, null, {
          default: () => [
            h(TabContent, { key: "first", title: "First" }),
            ...(show.value ? [h(TabContent, { key: "extra", title: "Extra" })] : []),
            h(TabContent, { key: "second", title: "Second" }),
            h(TabContent, { key: "third", title: "Third" }),
          ],
        }),
    });

    const wrapper = mount(Host);
    await flushPromises();
    const vm: any = wrapper.findComponent(FormWizard).vm;

    vm.nextTab();
    vm.nextTab();
    await flushPromises();
    expect(vm.tabs[vm.activeTabIndex].title).toBe("Third");

    show.value = true;
    await flushPromises();

    expect(vm.tabs.map((t: any) => t.title)).toEqual(["First", "Extra", "Second", "Third"]);
    // The user keeps their place instead of being pulled back to the new step.
    expect(vm.tabs[vm.activeTabIndex].title).toBe("Third");
    expect(vm.tabs.filter((t: any) => t.active)).toHaveLength(1);
    expect(vm.maxStep).toBeGreaterThanOrEqual(vm.activeTabIndex);
  });

  it("appends a step added after the active one without moving the user", async () => {
    const show = ref(false);
    const Host = defineComponent({
      setup: () => () =>
        h(FormWizard, null, {
          default: () => [
            h(TabContent, { key: "a", title: "A" }),
            h(TabContent, { key: "b", title: "B" }),
            ...(show.value ? [h(TabContent, { key: "c", title: "C" })] : []),
          ],
        }),
    });

    const wrapper = mount(Host);
    await flushPromises();
    const vm: any = wrapper.findComponent(FormWizard).vm;

    show.value = true;
    await flushPromises();

    expect(vm.tabs.map((t: any) => t.title)).toEqual(["A", "B", "C"]);
    expect(vm.tabs[vm.activeTabIndex].title).toBe("A");
  });
});
