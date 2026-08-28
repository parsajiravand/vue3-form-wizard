import { mount, flushPromises } from "@vue/test-utils";
import FormWizard from "../src/components/FormWizard.vue";
import TabContent from "../src/components/TabContent.vue";

describe("FormWizard - hidden tabs", () => {
  const createWrapper = () =>
    mount(FormWizard, {
      slots: {
        default: [
          {
            render() {
              return (
                <TabContent title="Step 1">
                  <div>Step 1</div>
                </TabContent>
              );
            },
          },
          {
            render() {
              return (
                <TabContent title="Step 2">
                  <div>Step 2</div>
                </TabContent>
              );
            },
          },
          {
            render() {
              return (
                <TabContent title="Step 3" hidden>
                  <div>Step 3 Hidden</div>
                </TabContent>
              );
            },
          },
          {
            render() {
              return (
                <TabContent title="Step 4">
                  <div>Step 4</div>
                </TabContent>
              );
            },
          },
        ] as any,
      },
      global: {
        components: { TabContent },
      },
    });

  it("does not render hidden steps in the navigation", async () => {
    const wrapper = createWrapper();
    await flushPromises();
    const navItems = wrapper.findAll('[role="tablist"] [role="tab"]');
    expect(navItems.length).toBe(3);
    const navText = navItems.map((item) => item.text()).join(" ");
    expect(navText).not.toContain("Step 3");
  });

  it("skips hidden step when navigating forward and backward", async () => {
    const wrapper = createWrapper();

    expect((wrapper.vm as any).activeTabIndex).toBe(0);

    (wrapper.vm as any).nextTab();
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).activeTabIndex).toBe(1);

    (wrapper.vm as any).nextTab();
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).activeTabIndex).toBe(3);

    (wrapper.vm as any).prevTab();
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).activeTabIndex).toBe(1);
  });

  it("keeps hidden step content mounted", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Step 3 Hidden");
    expect(wrapper.findAll(".wizard-tab-container").length).toBe(4);
  });

  it("reacts to dynamic hidden prop changes", async () => {
    const wrapper = mount({
      components: { FormWizard, TabContent },
      data() {
        return { isHidden: true };
      },
      render() {
        return (
          <FormWizard ref="wizard">
            <TabContent title="Step 1">
              <div>Step 1</div>
            </TabContent>
            <TabContent title="Step 2" hidden={this.isHidden}>
              <div>Step 2 Hidden</div>
            </TabContent>
            <TabContent title="Step 3">
              <div>Step 3</div>
            </TabContent>
          </FormWizard>
        );
      },
    });

    await flushPromises();
    let navItems = wrapper.findAll('[role="tablist"] [role="tab"]');
    expect(navItems.length).toBe(2);

    await wrapper.setData({ isHidden: false });
    await flushPromises();
    navItems = wrapper.findAll('[role="tablist"] [role="tab"]');
    expect(navItems.length).toBe(3);
  });
});

describe("FormWizard - hide finish button", () => {
  const createWrapper = (hideFinishButton = false) =>
    mount(FormWizard, {
      props: {
        hideFinishButton,
      },
      slots: {
        default: [
          {
            render() {
              return (
                <TabContent title="Step 1">
                  <div>Step 1</div>
                </TabContent>
              );
            },
          },
          {
            render() {
              return (
                <TabContent title="Step 2">
                  <div>Step 2</div>
                </TabContent>
              );
            },
          },
        ] as any,
      },
      global: {
        components: { TabContent },
      },
    });

  it("shows the finish button by default on the last step", async () => {
    const wrapper = createWrapper();
    (wrapper.vm as any).nextTab();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Finish");
    expect(wrapper.text()).not.toContain("Next");
  });

  it("hides the finish button when hideFinishButton is true", async () => {
    const wrapper = createWrapper(true);
    (wrapper.vm as any).nextTab();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain("Finish");
    expect(wrapper.text()).not.toContain("Next");
  });
});
