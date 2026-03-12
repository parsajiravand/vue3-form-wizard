import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import FormWizard from "../src/components/FormWizard.vue";
import TabContent from "../src/components/TabContent.vue";

describe("FormWizard - router integration", () => {
  const routes = [
    { path: "/step1", name: "step1", component: { template: "<div />" } },
    { path: "/step2", name: "step2", component: { template: "<div />" } },
  ];

  const createWrapper = async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    const wrapper = mount(FormWizard, {
      global: {
        plugins: [router],
        components: { TabContent },
      },
      slots: {
        default: [
          {
            render() {
              return (
                <TabContent title="Step 1" route="/step1">
                  <div>Step 1</div>
                </TabContent>
              );
            },
          },
          {
            render() {
              return (
                <TabContent
                  title="Step 2"
                  route={{ name: "step2" } as any}
                >
                  <div>Step 2</div>
                </TabContent>
              );
            },
          },
        ] as any,
      },
    });

    await router.isReady();
    return { wrapper, router };
  };

  it("navigates router when tabs change", async () => {
    const { wrapper, router } = await createWrapper();

    (wrapper.vm as any).nextTab();
    await router.isReady();

    expect(router.currentRoute.value.path).toBe("/step2");
  });
});

