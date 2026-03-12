import { mount } from "@vue/test-utils";
import FormWizard from "../src/components/FormWizard.vue";
import TabContent from "../src/components/TabContent.vue";

describe("FormWizard - validation hooks", () => {
  it("respects synchronous beforeChange returning false", async () => {
    const wrapper = mount(FormWizard, {
      slots: {
        default: [
          {
            render() {
              return (
                <TabContent
                  title="Step 1"
                  beforeChange={() => false}
                >
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

    (wrapper.vm as any).nextTab();
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).activeTabIndex).toBe(0);
  });
});

