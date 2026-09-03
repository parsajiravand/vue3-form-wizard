<template>
  <div
    :id="wizardId"
    class="vue-form-wizard"
    :class="[
      stepSize,
      {
        vertical: isVertical,
        'fw-rtl-content': rtl,
        'fw-horizontal-reverse': reverseHorizontal,
      },
    ]"
    @keyup.right="focusNextTab"
    @keyup.left="focusPrevTab"
  >
    <div class="wizard-header" v-if="$slots['title']">
      <slot name="title">
        <h4 class="wizard-title">{{ title }}</h4>
        <p class="category">{{ subtitle }}</p>
      </slot>
    </div>
    <div class="wizard-navigation">
      <div class="wizard-progress-with-circle" v-if="!isVertical">
        <div class="wizard-progress-bar" :style="progressBarStyle"></div>
      </div>
      <ul class="wizard-nav wizard-nav-pills" role="tablist" :class="[stepsClasses, { 'fw-steps-reverse': reverseHorizontal }]">
        <slot
          name="step"
          v-for="(item, index) in visibleTabs"
          :tab="item.tab"
          :index="index"
          :navigate-to-tab="navigateToTab"
          :step-size="stepSize"
          :transition="transition"
        >
          <wizard-step
            :tab="item.tab"
            :step-size="stepSize"
            @click="disableBackOnClickStep || disableBack ? false : navigateToTab(item.actualIndex)"
            @keyup.enter="navigateToTab(item.actualIndex)"
            :transition="transition"
            :index="index"
            :disable-back-on-click-step="disableBack ? true : disableBackOnClickStep"
          >
          </wizard-step>
        </slot>
      </ul>
      <div class="wizard-tab-content">
        <!-- Schema mode: render active step component if provided -->
        <template v-if="schema && schemaComponents && currentSchemaComponent">
          <component :is="currentSchemaComponent" :data="wizardData" :update-data="updateWizardData" />
        </template>

        <!-- Classic mode, or when no schema / component is found -->
        <slot v-else v-bind="slotProps"> </slot>
      </div>
    </div>

    <div class="wizard-card-footer clearfix" v-if="!hideButtons">
      <slot name="footer" v-bind="slotProps">
        <div class="wizard-footer-left" v-if="!disableBack">
          <span @click="prevTab" @keyup.enter="prevTab" v-if="displayPrevButton" role="button" tabindex="0">
            <slot name="prev" v-bind="slotProps">
              <wizard-button :style="fillButtonStyle" :disabled="loading">
                {{ backButtonText }}
              </wizard-button>
            </slot>
          </span>
          <slot name="custom-buttons-left" v-bind="slotProps"></slot>
        </div>

        <div class="wizard-footer-right">
          <slot name="custom-buttons-right" v-bind="slotProps"></slot>
          <span @click="nextTab" @keyup.enter="nextTab" v-if="isLastStep && !hideFinishButton" role="button" tabindex="0">
            <slot name="finish" v-bind="slotProps">
              <wizard-button :style="fillButtonStyle">
                {{ finishButtonText }}
              </wizard-button>
            </slot>
          </span>
          <span @click="nextTab" @keyup.enter="nextTab" role="button" tabindex="0" v-else-if="!isLastStep">
            <slot name="next" v-bind="slotProps">
              <wizard-button :style="fillButtonStyle" :disabled="loading">
                {{ nextButtonText }}
              </wizard-button>
            </slot>
          </span>
        </div>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, provide, getCurrentInstance } from 'vue'
import type { FormWizardSchema, WizardData } from '../types'
import { default as WizardButton } from './WizardButton.vue'
import { default as WizardStep } from './WizardStep.vue'
import { isPromise, findElementAndFocus, getFocusedElementId } from './helpers.js'

interface Tab {
  tabId: string
  title: string
  active: boolean
  checked: boolean
  validationError: string | null
  beforeChange?: () => boolean | Promise<boolean>
  afterChange?: () => void
  route?: string | object
  color: string
  errorColor: string
  shape: string
  icon?: string
  customIcon?: string
  hidden?: boolean
  updateActiveState?: (active: boolean, tabId?: string) => void
}

const props = withDefaults(
  defineProps<{
    id?: string
    title?: string
    subtitle?: string
    nextButtonText?: string
    backButtonText?: string
    finishButtonText?: string
    hideButtons?: boolean
    validateOnBack?: boolean
    color?: string
    errorColor?: string
    shape?: string
    layout?: string
    stepsClasses?: string | string[]
    stepSize?: 'xs' | 'sm' | 'md' | 'lg'
    transition?: string
    startIndex?: number
    disableBackOnClickStep?: boolean
    disableBack?: boolean
    skipValidationOnNext?: boolean
    schema?: FormWizardSchema
    modelValue?: WizardData
    schemaComponents?: Record<string, any>
    rtl?: boolean
    // Reverse horizontal layout: steps and footer buttons
    reverseHorizontal?: boolean
    hideFinishButton?: boolean
  }>(),
  {
    id: undefined,
    title: 'Awesome Wizard',
    subtitle: 'Split a complicated flow in multiple steps',
    nextButtonText: 'Next',
    backButtonText: 'Back',
    finishButtonText: 'Finish',
    hideButtons: false,
    hideFinishButton: false,
    validateOnBack: false,
    color: '#e74c3c',
    errorColor: '#8b0000',
    shape: 'circle',
    layout: 'horizontal',
    stepsClasses: '',
    stepSize: 'md',
    transition: '',
    startIndex: 0,
    disableBackOnClickStep: false,
    disableBack: false,
    skipValidationOnNext: false,
    rtl: false,
    reverseHorizontal: false,
  },
)

let wizardInstanceCounter = 0
const internalWizardId = `fw_${++wizardInstanceCounter}`

// Generate ID if not provided (stable per instance in a given runtime)
const wizardId = computed(() => props.id || internalWizardId)

const emit = defineEmits({
  'on-change': (prevIndex: number, nextIndex: number) => true,
  'update:startIndex': (index: number) => true,
  'on-complete': () => true,
  'on-loading': (loading: boolean) => true,
  'on-error': (error: any) => true,
  'on-validate': (result: boolean, index: number) => true,
  'update:modelValue': (data: WizardData) => true,
})

// Reactive state
const activeTabIndex = ref(0)
const maxStep = ref(0)
const loading = ref(false)
const tabs = ref<Tab[]>([])

// Shared wizard data (used in schema mode and optionally in classic mode)
const wizardData = ref<WizardData>({
  ...(props.schema?.initialData || {}),
  ...(props.modelValue || {}),
})

const updateWizardData = (partial: Record<string, any>) => {
  wizardData.value = {
    ...wizardData.value,
    ...partial,
  }
  emit('update:modelValue', wizardData.value)
}

// Schema mode helpers
const useSchemaMode = computed(() => !!props.schema)
const rawSchemaSteps = computed(() => props.schema?.steps || [])

const visibleSchemaSteps = computed(() => {
  if (!props.schema) return []

  return rawSchemaSteps.value.filter((step, index) => {
    if (!step.condition) return true

    const ctx = {
      data: wizardData.value,
      stepId: step.id,
      index,
    }

    const result = step.condition(ctx)

    if (isPromise(result)) {
      // For v1 keep it simple: async conditions are treated as truthy by default,
      // and should be expressed via validate instead.
      return true
    }

    return result === true
  })
})

const currentSchemaStep = computed(() => {
  if (!useSchemaMode.value) return null
  return visibleSchemaSteps.value[activeTabIndex.value] || null
})

const currentSchemaComponent = computed(() => {
  const step = currentSchemaStep.value
  if (!step || !props.schemaComponents) return null

  const key = step.component || step.id
  return props.schemaComponents[key] || null
})

// Store component instance and router references for later use
let componentInstance: any = getCurrentInstance()
let routerInstance: any = null

// Keep wizardData in sync when modelValue is controlled from the parent
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      wizardData.value = { ...newVal }
    }
  },
)

const resolveRouterInstance = () => {
  if (!componentInstance) {
    componentInstance = getCurrentInstance()
  }

  if (routerInstance || !componentInstance) {
    return routerInstance
  }

  const appContext = componentInstance.appContext

  // Try multiple ways to access the router
  if (appContext?.config?.globalProperties?.$router) {
    routerInstance = appContext.config.globalProperties.$router
  } else if (componentInstance.proxy && (componentInstance.proxy as any).$router) {
    routerInstance = (componentInstance.proxy as any).$router
  } else if (appContext?.app && (appContext.app as any).$router) {
    routerInstance = (appContext.app as any).$router
  } else if (componentInstance.provides && (componentInstance.provides as any).$router) {
    routerInstance = (componentInstance.provides as any).$router
  } else if (componentInstance.parent?.provides && (componentInstance.parent.provides as any).$router) {
    routerInstance = (componentInstance.parent.provides as any).$router
  }

  return routerInstance
}

const getCurrentRoute = () => {
  const instance = componentInstance
  const router = resolveRouterInstance()

  if (!instance && !router) {
    return null
  }

  const appContext = instance?.appContext

  const routeFromGlobals = appContext?.config?.globalProperties?.$route
  const routeFromProxy = instance?.proxy && (instance.proxy as any).$route
  const routeFromApp = appContext?.app && (appContext.app as any).$route
  const routeFromRouter = router?.currentRoute?.value

  return routeFromGlobals || routeFromProxy || routeFromApp || routeFromRouter || null
}

// Computed properties
const visibleTabs = computed(() =>
  tabs.value
    .map((tab, actualIndex) => ({ tab, actualIndex }))
    .filter((item) => !item.tab.hidden),
)

const visibleTabCount = computed(() => visibleTabs.value.length)

const tabCount = computed(() => visibleTabs.value.length)

const visibleActiveIndex = computed(() => visibleTabs.value.findIndex((item) => item.actualIndex === activeTabIndex.value))

const isLastStep = computed(() => visibleActiveIndex.value === visibleTabCount.value - 1)

const isVertical = computed(() => props.layout === 'vertical')

const reverseHorizontal = computed(() => !isVertical.value && !!props.reverseHorizontal)

const displayPrevButton = computed(() => visibleActiveIndex.value > 0)

const stepPercentage = computed(() => (1 / (visibleTabCount.value * 2)) * 100)

const progress = computed(() => {
  let percentage = 0
  if (visibleActiveIndex.value > 0) {
    const stepsToAdd = 1
    const stepMultiplier = 2
    percentage = stepPercentage.value * (visibleActiveIndex.value * stepMultiplier + stepsToAdd)
  } else {
    percentage = stepPercentage.value
  }
  return percentage
})

const progressBarStyle = computed(() => ({
  backgroundColor: props.color,
  width: `${progress.value}%`,
  color: props.color,
}))

const fillButtonStyle = computed(() => ({
  backgroundColor: props.color,
  borderColor: props.color,
  color: 'white',
}))

const slotProps = computed(() => ({
  nextTab,
  prevTab,
  activeTabIndex: activeTabIndex.value,
  isLastStep: isLastStep.value,
  fillButtonStyle: fillButtonStyle.value,
  tabs: tabs.value,
  tabCount: tabCount.value,
  wizardData: wizardData.value,
  updateWizardData,
}))

// Tab visibility helpers
const findNextVisibleTabIndex = (fromIndex: number): number => {
  for (let i = fromIndex + 1; i < tabs.value.length; i++) {
    if (!tabs.value[i]?.hidden) {
      return i
    }
  }
  return -1
}

const findPrevVisibleTabIndex = (fromIndex: number): number => {
  for (let i = fromIndex - 1; i >= 0; i--) {
    if (!tabs.value[i]?.hidden) {
      return i
    }
  }
  return -1
}

const getNearestVisibleTabIndex = (index: number): number => {
  const next = findNextVisibleTabIndex(index)
  if (next !== -1) {
    return next
  }
  const prev = findPrevVisibleTabIndex(index)
  if (prev !== -1) {
    return prev
  }
  return -1
}

// Methods
const emitTabChange = (prevIndex: number, nextIndex: number) => {
  emit('on-change', prevIndex, nextIndex)
  emit('update:startIndex', nextIndex)
}

const addTab = (item: Tab, updateFn?: (active: boolean, tabId?: string) => void) => {
  const index = tabs.value.length
  item.tabId = `${item.title.replace(/ /g, '')}${index}`
  item.updateActiveState = updateFn
  tabs.value.splice(index, 0, item)

  // Inform the child about the generated tabId and its initial active state
  if (updateFn) {
    updateFn(item.active, item.tabId)
  }

  // if a step is added before the current one, go to it
  if (index < activeTabIndex.value + 1) {
    maxStep.value = index
    changeTab(activeTabIndex.value + 1, index)
  }
}

const rebuildTabsFromSchema = () => {
  if (!useSchemaMode.value) return

  tabs.value = visibleSchemaSteps.value.map((step, index) => {
    const title = step.title || `Step ${index + 1}`

    const tab: Tab = {
      tabId: `${step.id || title.replace(/ /g, '')}${index}`,
      title,
      active: index === activeTabIndex.value,
      checked: index <= activeTabIndex.value,
      validationError: null,
      beforeChange: undefined,
      afterChange: undefined,
      route: step.route,
      color: props.color,
      errorColor: props.errorColor,
      shape: props.shape,
      icon: step.icon,
      customIcon: step.customIcon,
      hidden: step.hidden,
      updateActiveState: undefined,
    }

    return tab
  })

  // Clamp active index if needed
  if (activeTabIndex.value >= tabs.value.length) {
    activeTabIndex.value = Math.max(0, tabs.value.length - 1)
  }
}

const removeTab = (item: Tab) => {
  const index = tabs.value.indexOf(item)
  if (index > -1) {
    // Go one step back if the current step is removed
    if (index === activeTabIndex.value) {
      maxStep.value = activeTabIndex.value - 1
      changeTab(activeTabIndex.value, activeTabIndex.value - 1)
    }
    if (index < activeTabIndex.value) {
      maxStep.value = activeTabIndex.value - 1
      activeTabIndex.value = activeTabIndex.value - 1
      emitTabChange(activeTabIndex.value + 1, activeTabIndex.value)
    }
    tabs.value.splice(index, 1)
  }
}

const reset = () => {
  maxStep.value = 0
  tabs.value.forEach((tab) => {
    tab.checked = false
  })
  const firstVisible = visibleTabs.value[0]
  if (firstVisible) {
    navigateToTab(firstVisible.actualIndex)
  }
}

const activateAll = () => {
  maxStep.value = tabs.value.length - 1
  tabs.value.forEach((tab) => {
    tab.checked = true
  })
}

const hasBlockingValidationErrors = () => visibleTabs.value.some((item) => !!item.tab.validationError)

const navigateToTab = (index: number): boolean => {
  const actualIndex = tabs.value[index]?.hidden ? getNearestVisibleTabIndex(index) : index
  if (actualIndex === -1) {
    return false
  }
  const validate = actualIndex > activeTabIndex.value
  const allowContinueOnValidationError = validate && props.skipValidationOnNext
  if (actualIndex <= maxStep.value) {
    const cb = () => {
      if (validate && actualIndex > activeTabIndex.value) {
        // Move to the next visible step (skipping hidden ones) and validate recursively
        const nextVisible = findNextVisibleTabIndex(activeTabIndex.value)
        if (nextVisible !== -1 && nextVisible < actualIndex) {
          changeTab(activeTabIndex.value, nextVisible)
          beforeTabChange(activeTabIndex.value, cb, {
            continueOnValidationError: allowContinueOnValidationError,
          })
        } else {
          changeTab(activeTabIndex.value, actualIndex)
          afterTabChange(activeTabIndex.value)
        }
      } else {
        changeTab(activeTabIndex.value, actualIndex)
        afterTabChange(activeTabIndex.value)
      }
    }
    if (validate) {
      beforeTabChange(activeTabIndex.value, cb, {
        continueOnValidationError: allowContinueOnValidationError,
      })
    } else {
      setValidationError(null)
      cb()
    }
  }
  return actualIndex <= maxStep.value
}

const nextTab = () => {
  const nextVisibleIndex = findNextVisibleTabIndex(activeTabIndex.value)
  const movingToNextStep = nextVisibleIndex !== -1
  const allowContinueOnValidationError = movingToNextStep && props.skipValidationOnNext
  const cb = () => {
    if (movingToNextStep) {
      changeTab(activeTabIndex.value, nextVisibleIndex)
      afterTabChange(nextVisibleIndex)
    } else {
      if (hasBlockingValidationErrors()) {
        emit('on-error', 'Cannot complete wizard while validation errors exist')
        return
      }
      emit('on-complete')
    }
  }
  beforeTabChange(activeTabIndex.value, cb, {
    continueOnValidationError: allowContinueOnValidationError,
  })
}

const prevTab = () => {
  const prevVisibleIndex = findPrevVisibleTabIndex(activeTabIndex.value)
  const cb = () => {
    if (prevVisibleIndex !== -1) {
      setValidationError(null)
      changeTab(activeTabIndex.value, prevVisibleIndex)
    }
  }
  if (props.validateOnBack) {
    beforeTabChange(activeTabIndex.value, cb)
  } else {
    cb()
  }
}

const focusNextTab = () => {
  const visibleIndex = visibleTabs.value.findIndex((item) => `step-${item.tab.tabId}` === getFocusedElementId())
  if (visibleIndex !== -1 && visibleIndex < visibleTabs.value.length - 1) {
    const tabToFocus = visibleTabs.value[visibleIndex + 1].tab
    if (tabToFocus.checked) {
      // The DOM id used for the step element is `step-${tab.tabId}`
      findElementAndFocus(`step-${tabToFocus.tabId}`)
    }
  }
}

const focusPrevTab = () => {
  const visibleIndex = visibleTabs.value.findIndex((item) => `step-${item.tab.tabId}` === getFocusedElementId())
  if (visibleIndex !== -1 && visibleIndex > 0) {
    const toFocusId = visibleTabs.value[visibleIndex - 1].tab.tabId
    // The DOM id used for the step element is `step-${tab.tabId}`
    findElementAndFocus(`step-${toFocusId}`)
  }
}

const setLoading = (value: boolean) => {
  loading.value = value
  emit('on-loading', value)
}

const setValidationError = (error: any) => {
  if (tabs.value[activeTabIndex.value]) {
    tabs.value[activeTabIndex.value].validationError = error
  }
  emit('on-error', error)
}

const validateBeforeChange = (promiseFn: any, callback: () => void, options: { index: number; continueOnValidationError?: boolean }) => {
  setValidationError(null)
  // we have a promise
  if (isPromise(promiseFn)) {
    setLoading(true)
    promiseFn
      .then((res: any) => {
        setLoading(false)
        const validationResult = res === true
        executeBeforeChange(validationResult, callback, options)
      })
      .catch((error: any) => {
        setLoading(false)
        executeBeforeChange(false, callback, {
          ...options,
          errorMessage: error,
        })
      })
    // we have a simple function
  } else {
    const validationResult = promiseFn === true
    executeBeforeChange(validationResult, callback, options)
  }
}

const executeBeforeChange = (
  validationResult: boolean,
  callback: () => void,
  options: {
    index: number
    continueOnValidationError?: boolean
    errorMessage?: string
  },
) => {
  emit('on-validate', validationResult, options.index)
  if (validationResult) {
    if (tabs.value[options.index]) {
      tabs.value[options.index].validationError = null
    }
    callback()
  } else {
    const message = options.errorMessage ?? 'error'
    if (tabs.value[options.index]) {
      tabs.value[options.index].validationError = String(message)
    }
    emit('on-error', message)
    if (options.continueOnValidationError) {
      callback()
    }
  }
}

const beforeTabChange = (index: number, callback: () => void, options: { continueOnValidationError?: boolean } = {}) => {
  if (loading.value) {
    return
  }

  // Schema-mode validation
  if (useSchemaMode.value && props.schema) {
    const schemaStep = visibleSchemaSteps.value[index]
    if (schemaStep && schemaStep.validate) {
      const ctx = {
        data: wizardData.value,
        stepId: schemaStep.id,
        index,
      }

      const result = schemaStep.validate(ctx)

      if (isPromise(result)) {
        setLoading(true)
        ;(result as Promise<boolean | string>)
          .then((res) => {
            setLoading(false)
            if (res === true) {
              executeBeforeChange(true, callback, { index })
            } else {
              const message = res === false ? 'Validation failed' : res
              executeBeforeChange(false, callback, {
                index,
                errorMessage: String(message),
                continueOnValidationError: options.continueOnValidationError,
              })
            }
          })
          .catch((error) => {
            setLoading(false)
            executeBeforeChange(false, callback, {
              index,
              errorMessage: String(error),
              continueOnValidationError: options.continueOnValidationError,
            })
          })
      } else {
        if (result === true) {
          executeBeforeChange(true, callback, { index })
        } else {
          const message = result === false ? 'Validation failed' : result
          executeBeforeChange(false, callback, {
            index,
            errorMessage: String(message),
            continueOnValidationError: options.continueOnValidationError,
          })
        }
      }
      return
    }
  }

  // Classic per-tab beforeChange
  const oldTab = tabs.value[index]
  if (oldTab && oldTab.beforeChange !== undefined) {
    const tabChangeRes = oldTab.beforeChange()
    validateBeforeChange(tabChangeRes, callback, {
      index,
      continueOnValidationError: options.continueOnValidationError,
    })
  } else {
    callback()
  }
}

const afterTabChange = (index: number) => {
  if (loading.value) {
    return
  }
  const newTab = tabs.value[index]
  if (newTab && newTab.afterChange !== undefined) {
    newTab.afterChange()
  }
}

const changeTab = (oldIndex: number, newIndex: number, emitChangeEvent = true) => {
  const oldTab = tabs.value[oldIndex]
  const newTab = tabs.value[newIndex]
  if (oldTab) {
    oldTab.active = false
  }
  if (newTab) {
    newTab.active = true
  }
  if (emitChangeEvent && activeTabIndex.value !== newIndex) {
    emitTabChange(oldIndex, newIndex)
  }
  activeTabIndex.value = newIndex
  activateTabAndCheckStep(activeTabIndex.value)
  return true
}

const normalizeRouteTarget = (routeTarget: string | object | undefined, router: any) => {
  if (!routeTarget) {
    return { raw: null, path: null }
  }

  if (typeof routeTarget === 'string') {
    return { raw: routeTarget, path: routeTarget }
  }

  // For route objects, try to resolve to get a stable path/fullPath
  if (router && typeof router.resolve === 'function') {
    const resolved = router.resolve(routeTarget as any)
    const path = resolved?.fullPath || resolved?.path || null
    return { raw: routeTarget, path }
  }

  return { raw: routeTarget, path: null }
}

const tryChangeRoute = (tab: Tab) => {
  if (!tab.route) {
    return
  }

  const router = resolveRouterInstance()

  if (!router) {
    if (import.meta.env && import.meta.env.DEV) {
      console.warn('Vue Router not found. Make sure to install vue-router and use app.use(router) for route-based navigation.')
    }
    return
  }

  const current = getCurrentRoute()
  const currentPath = current?.fullPath || current?.path || undefined

  const target = normalizeRouteTarget(tab.route as any, router)

  // If we can determine a target path and it matches the current one, avoid redundant navigation
  if (target.path && currentPath === target.path) {
    return
  }

  router.push(target.raw as any).catch((err: any) => {
    // Ignore redundant navigation errors; surface others
    const message = err?.message || ''
    if (!message.includes('Avoided redundant navigation') && !message.includes('NavigationDuplicated')) {
      console.warn('Route navigation failed:', err)
    }
  })
}

const checkRouteChange = (route: any) => {
  const router = resolveRouterInstance()
  const routePath = route?.fullPath || route?.path || route || ''

  let matchingTabIndex = -1
  const matchingTab = tabs.value.find((tab, index) => {
    if (tab.hidden || !tab.route) {
      return false
    }

    // String route: compare directly to the current path
    if (typeof tab.route === 'string') {
      const match = tab.route === routePath
      if (match) {
        matchingTabIndex = index
      }
      return match
    }

    // Object route: resolve both and compare resulting paths
    if (router && typeof router.resolve === 'function') {
      const tabLocation = normalizeRouteTarget(tab.route as any, router)
      const match = !!tabLocation.path && tabLocation.path === routePath
      if (match) {
        matchingTabIndex = index
      }
      return match
    }

    return false
  })

  if (matchingTab && !matchingTab.active) {
    navigateToTab(matchingTabIndex)
  }
}

const deactivateTabs = () => {
  tabs.value.forEach((tab) => {
    tab.active = false
    // Call the update function if it exists
    if (tab.updateActiveState) {
      tab.updateActiveState(false)
    }
  })
}

const activateTab = (index: number) => {
  deactivateTabs()
  const tab = tabs.value[index]
  if (tab) {
    tab.active = true
    tab.checked = true

    // Call the update function if it exists
    if (tab.updateActiveState) {
      tab.updateActiveState(true)
    }

    tryChangeRoute(tab)
  }
}

const activateTabAndCheckStep = (index: number) => {
  activateTab(index)
  if (index > maxStep.value) {
    maxStep.value = index
  }
  activeTabIndex.value = index
}

const initializeTabs = () => {
  const firstVisible = visibleTabs.value[0]
  if (!firstVisible) {
    return
  }

  if (tabs.value.length > 0 && props.startIndex === 0) {
    activateTab(firstVisible.actualIndex)
  }
  if (props.startIndex < tabs.value.length) {
    const startIndex = tabs.value[props.startIndex]?.hidden ? getNearestVisibleTabIndex(props.startIndex) : props.startIndex
    if (startIndex !== -1) {
      activateTabAndCheckStep(startIndex)
    }
  } else {
    console.warn(
      `Prop startIndex set to ${props.startIndex} is greater than the number of tabs - ${tabs.value.length}. Make sure that the starting index is less than the number of tabs registered`,
    )
  }
}

// Expose methods
defineExpose({
  emitTabChange,
  addTab,
  removeTab,
  reset,
  activateAll,
  navigateToTab,
  nextTab,
  prevTab,
  focusNextTab,
  focusPrevTab,
  changeTab,
  deactivateTabs,
  activateTab,
  initializeTabs,
})

// Provide functions to child components
provide('addTab', addTab)
provide('removeTab', removeTab)

// Watchers
watch(
  () => props.startIndex,
  (newStartIndex) => {
    if (newStartIndex < tabs.value.length) {
      activateTabAndCheckStep(newStartIndex)
    }
  },
)

// Rebuild tabs when schema definition changes
watch(
  () => props.schema,
  () => {
    if (useSchemaMode.value) {
      rebuildTabsFromSchema()
    }
  },
  { deep: true },
)

// Re-run conditions when wizard data changes in schema mode
watch(
  () => wizardData.value,
  () => {
    if (useSchemaMode.value) {
      const prevActiveId = tabs.value[activeTabIndex.value]?.tabId
      rebuildTabsFromSchema()
      // Try to keep the same step active if still visible
      const newIndex = tabs.value.findIndex((t) => t.tabId === prevActiveId)
      if (newIndex !== -1 && !tabs.value[newIndex]?.hidden) {
        activateTabAndCheckStep(newIndex)
      } else if (visibleTabs.value.length > 0) {
        const fallback = getNearestVisibleTabIndex(newIndex !== -1 ? newIndex : activeTabIndex.value)
        if (fallback !== -1) {
          activateTabAndCheckStep(fallback)
        }
      }
    }
  },
  { deep: true },
)

// If the currently active tab becomes hidden, move to the nearest visible one
watch(
  visibleTabs,
  () => {
    if (tabs.value[activeTabIndex.value]?.hidden && visibleTabs.value.length > 0) {
      const fallback = getNearestVisibleTabIndex(activeTabIndex.value)
      if (fallback !== -1 && fallback !== activeTabIndex.value) {
        changeTab(activeTabIndex.value, fallback)
      }
    }
  },
  { flush: 'post' },
)

// Route watching with proper Vue Router integration
const currentRoute = ref('')
let routeWatcher: any = null
let hasLoggedRouterWarning = false

const setupRouteWatching = () => {
  const instance = componentInstance

  if (!instance) {
    if (!hasLoggedRouterWarning && import.meta.env && import.meta.env.DEV) {
      console.warn('Component instance not available for route watching')
      hasLoggedRouterWarning = true
    }
    return
  }

  const router = resolveRouterInstance()
  const route = getCurrentRoute()

  if (route) {
    // Watch for route changes
    routeWatcher = watch(
      () => getCurrentRoute()?.path,
      (newPath) => {
        const fullRoute = getCurrentRoute()
        const pathToUse = fullRoute?.fullPath || fullRoute?.path || newPath || ''

        if (pathToUse !== currentRoute.value) {
          currentRoute.value = pathToUse
          checkRouteChange(fullRoute || pathToUse)
        }
      },
      { immediate: true },
    )
  } else if (!router && !hasLoggedRouterWarning && import.meta.env && import.meta.env.DEV) {
    console.warn('Vue Router not detected. Route-based navigation will not work.')
    hasLoggedRouterWarning = true
  }
}

// Lifecycle
onMounted(() => {
  if (useSchemaMode.value) {
    rebuildTabsFromSchema()
    const startIndex = tabs.value[activeTabIndex.value]?.hidden ? getNearestVisibleTabIndex(activeTabIndex.value) : activeTabIndex.value
    if (startIndex !== -1 && tabs.value.length > 0) {
      activateTabAndCheckStep(startIndex)
    }
  } else {
    initializeTabs()
  }
  setupRouteWatching()
})

onBeforeUnmount(() => {
  if (routeWatcher) {
    routeWatcher()
  }
})
</script>
<style lang="scss">
@use '../assets/wizard.scss';
</style>

