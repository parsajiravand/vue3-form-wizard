<template>
  <form-wizard @on-complete="onComplete">
    <tab-content title="Personal details" icon="ti-user">
      My first tab content
    </tab-content>
    <tab-content title="Additional Info" icon="ti-settings">
      My second tab content
    </tab-content>
    <tab-content title="Last step" icon="ti-check">
      Yuhuuu! This seems pretty damn simple
    </tab-content>
  </form-wizard>
</template>

<script>
import {FormWizard} from "vue3-form-wizard";
import {TabContent} from "vue3-form-wizard";
export default {
  components: {
    FormWizard,
    TabContent,
  },
  methods: {
    onComplete: function () {
      alert("Yay. Done!");
    },
  },
};
</script>
<style >
    /*
 * vue3-form-wizard
 * Creator:parsa jiravand
 * vue3-form-wizard is a vue based component with no external depenendcies which simplifies tab wizard management.
 * v0.0.3
 * MIT License
 */

.vue-form-wizard .wizard-btn {
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.428571429;
  border-radius: 4px;
}
.vue-form-wizard .wizard-btn.disabled,
.vue-form-wizard .wizard-btn[disabled],
fieldset[disabled] .vue-form-wizard .wizard-btn {
  cursor: not-allowed;
  opacity: 0.65;
  filter: alpha(opacity=65);
  -webkit-box-shadow: none;
  box-shadow: none;
}
.vue-form-wizard * {
  box-sizing: border-box;
}
.vue-form-wizard a {
  text-decoration: none;
}
.vue-form-wizard .wizard-nav {
  margin-bottom: 0;
  padding-left: 0;
  list-style: none;
}
.vue-form-wizard .wizard-nav > li {
  position: relative;
  display: block;
}
.vue-form-wizard .wizard-nav > li > a {
  position: relative;
  display: block;
  padding: 10px 15px;
}
.vue-form-wizard .wizard-nav > li > a:hover,
.vue-form-wizard .wizard-nav > li > a:focus {
  text-decoration: none;
  background-color: #eee;
}
.vue-form-wizard .wizard-nav > li.disabled > a {
  color: #777;
}
.vue-form-wizard .wizard-nav > li.disabled > a:hover,
.vue-form-wizard .wizard-nav > li.disabled > a:focus {
  color: #777;
  text-decoration: none;
  background-color: transparent;
  cursor: not-allowed;
}
.vue-form-wizard .wizard-progress-bar {
  float: left;
  width: 0%;
  height: 100%;
  font-size: 12px;
  line-height: 20px;
  color: #fff;
  text-align: center;
  background-color: #337ab7;
  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 -1px #00000026;
  -webkit-transition: width 0.6s ease;
  -o-transition: width 0.6s ease;
  transition: width 0.6s ease;
}
.vue-form-wizard .wizard-btn,
.vue-form-wizard .navbar .navbar-nav > li > a.wizard-btn {
  box-sizing: border-box;
  border-width: 2px;
  background-color: transparent;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  min-width: 140px;
}
.vue-form-wizard .wizard-btn:hover,
.vue-form-wizard .wizard-btn:focus,
.vue-form-wizard .navbar .navbar-nav > li > a.wizard-btn:hover,
.vue-form-wizard .navbar .navbar-nav > li > a.wizard-btn:focus {
  outline: 0 !important;
}
.vue-form-wizard .wizard-nav-pills {
  margin-top: 0;
  position: relative;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
}
.vue-form-wizard .wizard-nav-pills li,
.vue-form-wizard .wizard-nav-pills a {
  flex: 1;
  align-items: center;
  flex-wrap: wrap;
  flex-grow: 1;
}
.vue-form-wizard .wizard-nav-pills a {
  display: flex;
}
.vue-form-wizard .wizard-nav-pills > li > a {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0 auto;
  color: #0003;
  position: relative;
  top: 3px;
}
.vue-form-wizard .wizard-nav-pills > li > a:hover,
.vue-form-wizard .wizard-nav-pills > li > a:focus {
  background-color: transparent;
  color: #0003;
  outline: 0 !important;
}
.vue-form-wizard .wizard-nav-pills > li > a.disabled {
  pointer-events: none;
  cursor: default;
}
.vue-form-wizard .wizard-nav-pills > li.active > a,
.vue-form-wizard .wizard-nav-pills > li.active > a:hover,
.vue-form-wizard .wizard-nav-pills > li.active > a:focus {
  background-color: transparent;
  -webkit-transition: font-size 0.2s linear;
  -moz-transition: font-size 0.2s linear;
  -o-transition: font-size 0.2s linear;
  -ms-transition: font-size 0.2s linear;
  transition: font-size 0.2s linear;
}
.vue-form-wizard .wizard-nav-pills > li.active > a .wizard-icon,
.vue-form-wizard .wizard-nav-pills > li.active > a:hover .wizard-icon,
.vue-form-wizard .wizard-nav-pills > li.active > a:focus .wizard-icon {
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-transition: all 0.2s linear;
  -moz-transition: all 0.2s linear;
  -o-transition: all 0.2s linear;
  -ms-transition: all 0.2s linear;
  transition: all 0.2s linear;
}
.vue-form-wizard {
  padding-bottom: 20px;
}
.vue-form-wizard .is_error {
  border-color: #c84513 !important;
}
.vue-form-wizard .is_error .icon-container {
  background: #c84513 !important;
}
.vue-form-wizard.xs .wizard-icon-circle {
  width: 40px;
  height: 40px;
  font-size: 16px;
}
.vue-form-wizard.xs .wizard-icon-circle.tab_shape {
  height: math(40px, 2) 5px;
}
.vue-form-wizard.xs .wizard-nav-pills > li.active > a .wizard-icon {
  font-size: 16px;
}
.vue-form-wizard.xs .wizard-navigation .wizard-progress-with-circle {
  position: relative;
  top: math(40px, 2) 5px;
  height: 4px;
}
.vue-form-wizard.sm .wizard-icon-circle {
  width: 50px;
  height: 50px;
  font-size: 20px;
}
.vue-form-wizard.sm .wizard-icon-circle.tab_shape {
  height: math(50px, 2) 5px;
}
.vue-form-wizard.sm .wizard-nav-pills > li.active > a .wizard-icon {
  font-size: 20px;
}
.vue-form-wizard.sm .wizard-navigation .wizard-progress-with-circle {
  position: relative;
  top: math(50px, 2) 5px;
  height: 4px;
}
.vue-form-wizard.md .wizard-icon-circle {
  width: 70px;
  height: 70px;
  font-size: 24px;
}
.vue-form-wizard.md .wizard-icon-circle.tab_shape {
  height: math(70px, 2) 5px;
}
.vue-form-wizard.md .wizard-nav-pills > li.active > a .wizard-icon {
  font-size: 24px;
}
.vue-form-wizard.md .wizard-navigation .wizard-progress-with-circle {
  position: relative;
  top: math(70px, 2) 5px;
  height: 4px;
}
.vue-form-wizard.lg .wizard-icon-circle {
  width: 90px;
  height: 90px;
  font-size: 28px;
}
.vue-form-wizard.lg .wizard-icon-circle.tab_shape {
  height: math(90px, 2) 5px;
}
.vue-form-wizard.lg .wizard-nav-pills > li.active > a .wizard-icon {
  font-size: 28px;
}
.vue-form-wizard.lg .wizard-navigation .wizard-progress-with-circle {
  position: relative;
  top: math(90px, 2) 5px;
  height: 4px;
}
.vue-form-wizard .wizard-icon-circle {
  font-size: 18px;
  border: 3px solid #f3f2ee;
  border-radius: 50%;
  font-weight: 600;
  width: 70px;
  height: 70px;
  background-color: #fff;
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
}
.vue-form-wizard .wizard-icon-circle.square_shape {
  border-radius: 0;
}
.vue-form-wizard .wizard-icon-circle.tab_shape {
  width: 100%;
  min-width: 100px;
  height: 40px;
  border: none;
  background-color: #f3f2ee;
  border-radius: 0;
}
.vue-form-wizard .wizard-icon-circle .wizard-icon-container {
  display: flex;
  justify-content: center;
  flex: 1;
  border-radius: 50%;
  margin: -3px;
}
.vue-form-wizard .wizard-icon-circle .wizard-icon-container.square_shape {
  border-radius: 0;
}
.vue-form-wizard .wizard-icon-circle .wizard-icon-container.tab_shape {
  border-radius: 0;
  margin: 0;
}
.vue-form-wizard .wizard-icon-circle .wizard-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.vue-form-wizard .wizard-tab-content {
  min-height: 100px;
  padding: 30px 20px 10px;
}
.vue-form-wizard .wizard-header {
  padding: 15px;
  position: relative;
  border-radius: 3px 3px 0 0;
  text-align: center;
}
.vue-form-wizard .wizard-title {
  color: #252422;
  font-weight: 300;
  margin: 0;
  text-align: center;
}
.vue-form-wizard .category {
  font-size: 14px;
  font-weight: 400;
  color: #9a9a9a;
  margin-bottom: 0;
  text-align: center;
}
.vue-form-wizard .wizard-navigation .wizard-progress-with-circle {
  position: relative;
  top: 40px;
  height: 4px;
}
.vue-form-wizard
  .wizard-navigation
  .wizard-progress-with-circle
  .wizard-progress-bar {
  box-shadow: none;
  -webkit-transition: width 0.3s ease;
  -o-transition: width 0.3s ease;
  transition: width 0.3s ease;
}
.vue-form-wizard .clearfix:after {
  content: "";
  clear: both;
  display: table;
}
.vue-form-wizard .wizard-card-footer {
  padding: 0 20px;
}
.vue-form-wizard .wizard-card-footer .wizard-footer-left {
  float: left;
}
.vue-form-wizard .wizard-card-footer .wizard-footer-right {
  float: right;
}
@media screen and (max-width: 350px) {
  .vue-form-wizard .wizard-card-footer {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .vue-form-wizard .wizard-card-footer .wizard-footer-left,
  .vue-form-wizard .wizard-card-footer .wizard-footer-right {
    float: none;
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .vue-form-wizard .wizard-card-footer .wizard-footer-right button {
    margin-top: 10px;
  }
}
.vue-form-wizard.vertical .wizard-card-footer {
  display: block;
}
.vue-form-wizard.vertical .wizard-nav-pills {
  flex-direction: column;
}
.vue-form-wizard.vertical .wizard-navigation {
  display: flex;
  flex-direction: row;
}
.vue-form-wizard.vertical .wizard-card-footer {
  padding-top: 30px;
}

</style>
