import { mount, flushPromises } from "@vue/test-utils";
import FormWizard from "../src/components/FormWizard.vue";
import TabContent from "../src/components/TabContent.vue";

describe("TabContent", () => {
  it("registers with FormWizard and toggles active state", async () => {
    const wrapper = mount(FormWizard, {
      slots: {
        default: {
          render() {
            return (
              <TabContent title="Only Step">
                <div>Only Step</div>
              </TabContent>
            );
          },
        } as any,
      },
      global: {
        components: { TabContent },
      },
    });

    await flushPromises();

    const panels = wrapper.findAll('[role="tabpanel"]');
    expect(panels.length).toBe(1);
    expect(panels[0].attributes("aria-hidden")).toBe("false");
  });
});
