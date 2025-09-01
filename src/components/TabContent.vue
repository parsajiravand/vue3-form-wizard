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
const addTab = inject<(tab: any, updateFn: (active: boolean) => void) => void>('addTab');
const removeTab = inject<(tab: any) => void>('removeTab');

// Reactive data
const active = ref(false);
const validationError = ref<string | null>(null);
const checked = ref(false);
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

// Create tab object to pass to parent
const tabObject = computed(() => ({
  title: props.title,
  icon: props.icon,
  customIcon: props.customIcon,
  beforeChange: props.beforeChange,
  afterChange: props.afterChange,
  route: props.route,
  active: active.value,
  checked: checked.value,
  validationError: validationError.value,
  tabId: tabId.value,
  color: color.value,
  errorColor: errorColor.value,
  shape: shape.value,
}));

// Function to update active state from FormWizard
const updateActiveState = (newActive: boolean) => {
  active.value = newActive;
};

// Lifecycle hooks
onMounted(() => {
  if (addTab) {
    addTab(tabObject.value, updateActiveState);
  }
});

onBeforeUnmount(() => {
  if (removeTab) {
    removeTab(tabObject.value);
  }
});
</script>
