## Methods
By using [refs](https://vuejs.org/v2/api/#ref) on the `form-wizard` component, you can access some internal wizard properties and methods.
Some of them are intended for internal usage while others can be used for general purpose operations.

* **reset** - will reset the wizard to the initial state
* **activateAll** - will activate all steps as if the user went through all 
* **nextTab** - navigates to the next tab. The same method is used when clicking next button
* **prevTab** - navigates to the prev tab. The same method is used when clicking prev button
* **changeTab(oldIndex, newIndex)** - Navigates from one tab to another. Note that this method does not trigger validation methods. Use it with caution!

!> It's advised to use only the methods above, since the methods which are not listed here are internal and might change or get removed over time.