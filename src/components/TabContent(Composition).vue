<template  >
  <div
    v-show="active"
    v-if="!lazy || active"
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
<script lang="ts">
export default {
      inject: ['addTab'],
    mounted () {
      this.addTab(this)
    },
}

</script>
<script setup lang="ts">
import { inject, ref,getCurrentInstance, computed, ComponentInternalInstance, onMounted, onUnmounted, onBeforeMount } from "vue";
const instance = getCurrentInstance() as ExtraComponentInternalInstance
type ExtraComponentInternalInstance = ComponentInternalInstance&{
  parent:{
    shape:string,
    color:string,
    errorColor:string,
  }

  ctx:{  $el:{
    parentNode:{
      removeChild:Function
    }
  },}
}
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  /***
   * Icon name for the upper circle corresponding to the tab
   */
  customIcon: {
    type: String,
    default: "",
  },
  /***
   * Only render the content when the tab is active
   */
  lazy: {
    type: Boolean,
    default: false,
  },

  /***
   * Function to execute before tab switch. Return value must be boolean
   * If the return result is false, tab switch is restricted
   */
  beforeChange: {
    type: Function,
  },
  /***
   * Function to execute after tab switch. Return void for now.
   * Safe to assume necessary validation has already occured
   */
  afterChange: {
    type: Function,
  },
  route: {
    type: [String, Object],
  },

  additionalInfo: {
    type: Object,
    default: () => {},
  },
});
const addTab:any = inject<object>("addTab");
const removeTab:any = inject<object>("removeTab");

const active =ref<boolean>(false)
const validationError =ref<any>(false)
const checked =ref<boolean>(false)
const tabId =ref<string>('')

const shape = computed<string>(() => {
  return instance.parent.shape
})
const color = computed<string>(() => {
  return instance.parent.color
})
const errorColor = computed<string>(() => {
  return instance.parent.errorColor
})

onUnmounted(() => {
   if (instance.ctx.$el && instance.ctx.$el.parentNode) {
        instance.ctx.$el.parentNode.removeChild(instance.ctx.$el)
      }
      removeTab(instance.ctx)
})
</script>
