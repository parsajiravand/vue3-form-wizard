<template>
  <div v-show="active" v-if="!lazy || active" class="wizard-tab-container"
       role="tabpanel"
       :id="tabId"
       :aria-hidden="!active"
       :aria-labelledby="`step-${tabId}`">
    <slot :active="active">
    </slot>
          <slot name="customIcon"></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, inject, onMounted, onBeforeUnmount, getCurrentInstance, watch } from 'vue';

const props = withDefaults(defineProps<{
  title?: string;
  icon?: string;
  customIcon?: string;
  lazy?: boolean;
  beforeChange?: () => boolean | Promise<boolean>;
  afterChange?: () => void;
  route?: string | object;
  additionalInfo?: Record<string, any>;
}>(), {
  title: '',
  icon: '',
  customIcon: '',
  lazy: false,
  additionalInfo: () => ({}),
});

// Injected functions from parent FormWizard
const addTab = inject<
  (
    tab: any,
    updateFn: (active: boolean, tabId?: string) => void,
    meta?: { uid?: number; el?: Node | null }
  ) => void
>('addTab');
const removeTab = inject<(tab: any) => void>('removeTab');
const updateTab = inject<(uid: number | undefined, patch: any) => void>('updateTab');

// Reactive data (driven by FormWizard via updateActiveState)
const active = ref(false);
const tabId = ref('');

// Get current instance for accessing parent
const instance = getCurrentInstance();

// Computed properties for accessing parent properties
const shape = computed(() => {
  const parent = instance?.parent;
  return parent?.props?.shape || 'circle';
});

const color = computed(() => {
  const parent = instance?.parent;
  return parent?.props?.color || '#e74c3c';
});

const errorColor = computed(() => {
  const parent = instance?.parent;
  return parent?.props?.errorColor || '#8b0000';
});

// Everything the wizard derives from this component's props, kept separate so
// it can be pushed again whenever the props change.
const tabProps = computed(() => ({
  title: props.title,
  icon: props.icon,
  customIcon: props.customIcon,
  beforeChange: props.beforeChange,
  afterChange: props.afterChange,
  route: props.route,
  color: color.value,
  errorColor: errorColor.value,
  shape: shape.value,
}));

// Create tab object to pass to parent (FormWizard manages active/checked/validationError)
const tabObject = computed(() => ({
  ...tabProps.value,
  active: false,
  checked: false,
  validationError: null as string | null,
  tabId: tabId.value,
}));

// Function to update active state (and initial tabId) from FormWizard
const updateActiveState = (newActive: boolean, newTabId?: string) => {
  active.value = newActive;

  if (newTabId && !tabId.value) {
    tabId.value = newTabId;
  }
};

// Lifecycle hooks
onMounted(() => {
  if (addTab) {
    // The uid identifies this step on unregister, the element (a comment node
    // while lazy and inactive) tells the wizard where it sits among siblings.
    addTab(tabObject.value, updateActiveState, {
      uid: instance?.uid,
      el: (instance?.vnode.el as Node | null) ?? null,
    });
  }
});

// `post` so the element reference reflects the DOM after this update.
watch(
  tabProps,
  (value) => {
    updateTab?.(instance?.uid, {
      ...value,
      el: (instance?.vnode.el as Node | null) ?? null,
    });
  },
  { flush: 'post' }
);

onBeforeUnmount(() => {
  if (removeTab) {
    removeTab(instance?.uid);
  }
});
</script>
