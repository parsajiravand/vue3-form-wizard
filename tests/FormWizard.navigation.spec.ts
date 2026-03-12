import { mount } from "@vue/test-utils";
import FormWizard from "../src/components/FormWizard.vue";
import TabContent from "../src/components/TabContent.vue";

describe("FormWizard - navigation", () => {
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
        ] as any,
      },
      global: {
        components: { TabContent },
      },
    });

  it("starts at first step and moves forward/backward", async () => {
    const wrapper = createWrapper();

    // initial active tab index 0
    expect((wrapper.vm as any).activeTabIndex).toBe(0);

    (wrapper.vm as any).nextTab();
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).activeTabIndex).toBe(1);

    (wrapper.vm as any).prevTab();
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).activeTabIndex).toBe(0);
  });
}

