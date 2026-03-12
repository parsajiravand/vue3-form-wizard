import { mount } from "@vue/test-utils";
import FormWizard from "../src/components/FormWizard.vue";
import TabContent from "../src/components/TabContent.vue";

describe("FormWizard - accessibility", () => {
  it("renders tabs and panels with correct roles and aria attributes", () => {
    const wrapper = mount(FormWizard, {
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

    const tablist = wrapper.find('[role="tablist"]');
    expect(tablist.exists()).toBe(true);

    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs.length).toBeGreaterThan(0);

    const panels = wrapper.findAll('[role="tabpanel"]');
    expect(panels.length).toBeGreaterThan(0);

    const firstTab = tabs[0];
    const controls = firstTab.attributes("aria-controls");
    if (controls) {
      const panel = wrapper.find(`#${controls}`);
      expect(panel.exists()).toBe(true);
    }
  });
});

