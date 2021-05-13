# INTRODUCTION
The form handler as a __*slice*__ of __*@reduxjs/toolkit*__ . You can handle form with your redux toolkit easily.

## installation
```angular2html
npm install redux-toolkit-form
```

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
In the component with inputs
```jsx
import { useDispatch, useSelector } from "react-redux";
import { changeValue, formValues, initForm, formErrors, isValid, setErrors, validateForm} from "redux-toolkit-form";
import { useEffect } from "react";

// import validators
import emailValidate from "./Validators/emailValidate";
import lengthValidate from "./Validators/lengthValidate";


function App() {

    const dispatch = useDispatch()


    // first define the form structure to init to store
    const form = {
        values : {
            email: {
                // if the field is required
                required: true,
                // all vlidators have to pass in this array
                validators: [
                    new emailValidate('Email is not valid!')
                ]
            },
            username: {
                required: true,
                validators:  [
                    new lengthValidate(4, 'min', 'Minimum 4 character allow!'),
                    new lengthValidate(15, 'max', "Maximum 15 character allow!"),
                ]
            },
            mobile: {
                // this field is not required
                required: false,
                
                // if no validators required
                validators: []
            }
        }
    }


    // fire initForm action with form structure 
    // this will set the form errors and value in store
    useEffect(() => {
        dispatch(initForm(form))
    }, [])




    // this selector return the form errors
    const formError = useSelector(formErrors)
    
    
    // this selector return the form valid status true or false
    const ValidStatus = useSelector(isValid)
    
    // this selector return all the value of form
    const FormValue = useSelector(formValues)


    // you can validate form by dispatch validateForm() action
    dispatch(validateForm())

    
    // you can set custome error by fire setErrors fucntion
    dispatch(setErrors({
        email: 'Emali already exists!',
        username: 'Invalid username'
    }))
    // this will help you set dynamic error from server



    return (
        <div className={'bg-blue-300 h-screen flex content-center justify-center flex-wrap'}>
            <div className="bg-blue-50 md:w-1/3 sm:w-11/12  w-full rounded-sm shadow-md p-2">
                <h2 className={'form-title'}>Login</h2>
                <div className="my-2 px-1">
                    <label className={'label-control'}>Email</label>


                    {/** Here we have to name the input field as defined structure
                        
                        we have to fire changeValue with param event in dispatch like this to change value in store
                        
                        this will track all error on every change based on validators
                     */}
                    <input autoComplete={'off'} type={'text'} className={'input-control'} onChange={(e) => dispatch(changeValue(e))} name={'email'} placeholder={'Email address'} />
                    
                    
                    {/**
                     track on error message like this
                        */}
                    <span className={'error-feedback'}>{formError.email}</span>

                </div>

                <div className="my-2 px-1">
                    <label className={'label-control'}>Username</label>
                    
                    
                    {/** here another exmple */}
                    <input onChange={(e) => dispatch(changeValue(e))} type={'text'} className={'input-control'} name={'username'} placeholder={'Username'} />
                        
                        
                    <span className={'error-feedback'}>{formError.username}</span>

                </div>

                <div className="my-2 px-1">
                    <label className={'label-control'}>Mobile</label>
                    <input type={'text'} className={'input-control'} onChange={(e) => dispatch(changeValue(e))} name={'mobile'} placeholder={'Mobile'} />
                </div>

                <div className="my-2 px-1">
                    <button onClick={() => dispatch(validateForm())} className="button w-full text-white bg-blue-500 my-2">Submit</button>
                </div>

            </div>
        </div>
    );
}

export default App;

```

# Validator Setup
> For create validator with this package you have to follow this rules
> Please follow the exact same as this validator to working with this package
>
In this example we re showing one file. You can separate file to make code reusable
```jsx
class lengthValidate{
    
    
    constructor(length, minOrMax, message='') {
        this.length = length
        this.minOrMax = minOrMax
        this.message = message
    }

    /** 
     * every validator should have this validate method
     * automatically input will inject from store the exact value form this key
     * return error message
     * */
    validate(value){
        if(this.minOrMax === 'min'){
            if(value.length < this.length){
                return this.message || 'Minimum '+ this.length + ' character allow!'
            }
        }

        if(this.minOrMax === 'max'){
            if(value.length > this.length){
                return this.message || `Maximum ${this.length} character allow!`
            }
        }


        return ''
    }
}


// we are not showing full component hope you will get it
function App() {



    // first define the form structure to init to store
    const form = {
        values: {

            username: {
                required: true,
                validators: [
                    new lengthValidate(4, 'min', 'Minimum 4 character allow!'),
                    new lengthValidate(15, 'max', "Maximum 15 character allow!"),
                ]
            }
        }
    }

}

```

