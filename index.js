import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
    name: 'form',
    initialState: {
        value: {},
        files: {},
        valid: false,
        validators: {},
        errors: {},

    },
    reducers: {
        initForm: (state, action) => {

            // make all fields empty first
            state.value = {};
            state.valid = false;
            state.validators = {};
            state.errors = {};

            // init all values
            for(let keyField in action.payload.values){


                state.value[keyField] = '';
                state.errors[keyField] = '';
                state.validators[keyField] = {
                    required: false,
                    validate: []
                }
                state.validators[keyField]['required'] = !!action.payload.values[keyField].required
                state.validators[keyField]['validate'] = action.payload.values[keyField].validators?.length ? [...action.payload.values[keyField].validators] : [];
            }
        },
        changeValue: (state, action) => {
            const {value, name} = action.payload.target;
            const errors = []
            if(state.validators[name].required){
                if(!value){
                    errors.push('Field is required!')
                }
            }

            errors.push(...state.validators[name]['validate'].map(validator => (
                validator.validate(value)
            )))


            state.errors[name] = errors?.length ? errors.filter(v => v !== '' )[0] : '';
            state.value[name] = value;
            let valid = true

            for(let FieldKey in state.validators){
                if(state.validators[FieldKey].required){
                    if(!state.value[FieldKey]){
                        valid = false;
                    }
                }


                for(let validator of state.validators[FieldKey].validate){

                    if(validator.validate(state.value[FieldKey])){
                        valid = false;
                    }
                }
            }

            state.valid = valid;

        },
        setErrors: (state, action) => {
            state.valid = false;
            state.errors = {...state.errors, ...action.payload}
        },
        validateForm: (state, action) => {
            let valid = true;

            let errors = {};

            for(let FieldKey in state.validators){
                if(state.validators[FieldKey].required){
                    if(!state.value[FieldKey]){
                        errors[FieldKey] = 'Field is required!'
                    }
                }


                for(let validator of state.validators[FieldKey].validate){

                    let msg = validator.validate(state.value[FieldKey])

                    if(msg){
                        valid = false
                        if(!errors[FieldKey]){
                            errors[FieldKey] = msg
                        }
                    }else{
                        if(!errors[FieldKey]){
                            errors[FieldKey] = ''
                        }
                    }
                }
            }

            state.valid = valid
            state.errors = errors

        }
    }
})



export const {initForm, changeValue, setErrors, validateForm} = formSlice.actions
const FormReducer = formSlice.reducer
export default FormReducer

export const formValues = state => state.form.value
export const formErrors = state => state.form.errors
export const isValid = state => state.form.valid
