## Scoped slots

Form-wizard exposes multiple scoped slots which can be used to customize some parts of the wizard. Usage example and implementation details are presented in [0.6.2 release](https://github.com/cristijora/vue-form-wizard/releases/tag/v0.6.2)

Since [0.6.4](https://github.com/cristijora/vue-form-wizard/releases/tag/v0.6.4), button slots can be also used as scoped slots and have the following methods/properties exposed

* **nextTab** // will go to the next tab/step when called 
* **prevTab** //will got to the prev tab/step when called
* **activeTabIndex** // current active tab index 
* **isLastStep** // boolean to tell whether it's the last step or not
* **fillButtonStyle** // object with styles for wizard-buttons (contains background and color passed through wizard props)

These properties apply to the following slots: 

* **prev** - Previous button content (no need to worry about handling the button functionality)
* **next** - Next button content
* **finish** - Finish button content
* **custom-buttons-left** - Appears on right of "Back" button
* **custom-buttons-right** - Appears on the left of "Next/Finish" button

### Footer slot
The footer slot would be usually used to replace the whole content of your footer. By default it contains the wizard buttons (back, next, finish).
When using this slot, those buttons are replaced with your own content. You can achieve the same default wizard functionality and event tweak it with the help of the exposed methods/properties from slot `props`

Note that using this slot, means that you have to handle some of the wizard logic through the exposed methods/properties defined above and your template might get more verbose. 
If you need very fine customizations and more control over the wizard button actions,
then you could use this slot. Otherwise, you could stick with the buttons slots as they can be used as scoped slots as well.
One potential usage can be that you want to have a different button when completing the wizard. Maybe you want to position it in the center, give it a different color and click event

```html
<template slot="footer" slot-scope="props">
       <div class="wizard-footer-left">
           <wizard-button  v-if="props.activeTabIndex > 0 && !props.isLastStep" @click.native="props.prevTab()" :style="props.fillButtonStyle">Previous</wizard-button>
        </div>
        <div class="wizard-footer-right">
          <wizard-button v-if="!props.isLastStep"@click.native="props.nextTab()" class="wizard-footer-right" :style="props.fillButtonStyle">Next</wizard-button>
          
          <wizard-button v-else @click.native="alert('Done')" class="wizard-footer-right finish-button" :style="props.fillButtonStyle">  {{props.isLastStep ? 'Done' : 'Next'}}</wizard-button>
        </div>
</template>
```
This is just one example. You can add more buttons, hide or display conditionally based on the exposed properties.
Working fiddle for the [example above](https://jsfiddle.net/bt5dhqtf/717/)

### Step slot
This slot can be used to disable the click event on the step or to customize the UI of each step
One possible usage:
```html
<wizard-step 
    slot-scope="props"
    slot="step"
    :tab="props.tab"
    :transition="props.transition"
    :index="props.index">
</wizard-step>
```
#### Exposed props for the `step` slot
- tab (the tab object which contains the tab-content component corresponding to the step) This object contains several fields such as `active, checked, shape, color` and so on. You can check how these are used [here](https://github.com/cristijora/vue-form-wizard/blob/master/src/components/WizardStep.vue): 
- index (The index of the step)
- transition (Transition prop passed from form-wizard)

[Fiddle example](https://jsfiddle.net/bt5dhqtf/705/) You can notice that steps are not longer clickable.