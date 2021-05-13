# INTRODUCTION
The form handler as a __*slice*__ of __*@reduxjs/toolkit*__ . You can handle form with your redux toolkit easily.

## installation

> _npm install redux-toolkit-form_

####  - pre-requirement
> _You have to setup __@reduxjs/toolkit___ with your project

```javascript
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import RootReducer from "./CombineReducer";

const store = configureStore({
    reducer: RootReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['form/initForm', 'form/changeValue', "form/setErrors", "form/validateForm"]
        }

    })

})


export default store
```
**Ensure your middleware have this snippet**

### - Now configure your combine reducer
```javascript
import { combineReducers } from "@reduxjs/toolkit";
import FormReducer from "redux-toolkit-form";


const RootReducer = combineReducers({
    form: FormReducer
})


export default RootReducer
```
You should register ___FormReducer___ with ___form___ key in combimeReducers

Now you are done to work with it.

# Usages
This package come with some action and selector to handle form from component.

#### - Actions
You have to dispatch this actions to handle form
  ```javascript
import { changeValue, initForm, validateForm} from "redux-toolkit-form";
```
#### - Selector functions
You have to use useSelector with this selector function to get values, errors, valid status of form
```javascript
import { formErrors, formValues, isValid } from "redux-toolkit-form";
```

## Example



