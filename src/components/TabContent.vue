<template>
  <div
    v-show="active"
    v-if="!lazy || active || hidden"
    class="wizard-tab-container"
    role="tabpanel"
    :id="tabId"
    :aria-hidden="!active"
    :aria-labelledby="`step-${tabId}`"
  >
    <slot :active="active"> </slot>
    <slot name="customIcon"></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, inject, onMounted, onBeforeUnmount, getCurrentInstance, watch, reactive } from 'vue'
import type { Tab } from '../types'

const props = withDefaults(
  defineProps<{
    title?: string
    icon?: string
    customIcon?: string
    lazy?: boolean
    beforeChange?: () => boolean | Promise<boolean>
    afterChange?: () => void
    route?: string | object
    additionalInfo?: Record<string, any>
    hidden?: boolean
  }>(),
  {
    title: '',
    icon: '',
    customIcon: '',
    lazy: false,
    additionalInfo: () => ({}),
    hidden: false,
  },
)

// Injected functions from parent FormWizard
const addTab = inject<(tab: Tab, updateFn: (active: boolean) => void) => void>('addTab')
const removeTab = inject<(tab: Tab) => void>('removeTab')

// Reactive data (driven by FormWizard via updateActiveState)
const active = ref(false)
const tabId = ref('')

// Get current instance for accessing parent
const instance = getCurrentInstance()

// Computed properties for accessing parent properties
const shape = computed(() => {
  const parent = instance?.parent
  return parent?.props?.shape || 'circle'
})

const color = computed(() => {
  const parent = instance?.parent
  return parent?.props?.color || '#e74c3c'
})

const errorColor = computed(() => {
  const parent = instance?.parent
  return parent?.props?.errorColor || '#8b0000'
})

// Create reactive tab object shared with FormWizard so prop changes (like hidden) propagate
const tab = reactive<Tab>({
  tabId: '',
  title: props.title,
  active: false,
  checked: false,
  validationError: null,
  color: color.value as string,
  errorColor: errorColor.value as string,
  shape: shape.value as string,
  icon: props.icon as string,
  customIcon: props.customIcon as string,
  beforeChange: props.beforeChange as any,
  afterChange: props.afterChange as any,
  route: props.route as any,
  hidden: props.hidden as boolean,
})

// Keep the reactive tab in sync with prop updates
watch(() => props.title, (val) => (tab.title = val))
watch(() => props.icon, (val) => (tab.icon = val as string))
watch(() => props.customIcon, (val) => (tab.customIcon = val as string))
watch(() => props.beforeChange, (val) => (tab.beforeChange = val as any))
watch(() => props.afterChange, (val) => (tab.afterChange = val as any))
watch(() => props.route, (val) => (tab.route = val as any))
watch(() => props.hidden, (val) => (tab.hidden = val as boolean))
watch(color, (val) => (tab.color = val as string))
watch(errorColor, (val) => (tab.errorColor = val as string))
watch(shape, (val) => (tab.shape = val as string))

// Function to update active state (and initial tabId) from FormWizard
const updateActiveState = (newActive: boolean, newTabId?: string) => {
  active.value = newActive
  tab.active = newActive

  if (newTabId && !tabId.value) {
    tabId.value = newTabId
    tab.tabId = newTabId
  }
}

// Lifecycle hooks
onMounted(() => {
  if (addTab) {
    addTab(tab, updateActiveState)
  }
})

onBeforeUnmount(() => {
  if (removeTab) {
    removeTab(tab)
  }
})
</script>

