const Yup = require('yup')
const getErrors = require('utils/yup/getErrors')

const schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be longer than 2 characters')
    .max(70, "Name can't be longer than 16 characters")
    .required('Name is required')
    .typeError('Name must be a string'),
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid')
    .typeError('Email must be a string'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(16, "Password can't be longer than 16 characters")
    .matches(/[A-Z]/, 'Password must contain at least one uppercase character')
    .matches(/[a-z]/, 'Password must contain at least one lowercase character')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/\W/, 'Password must contain at least one special character')
    .typeError('Password  must be a string')
})

module.exports = object => getErrors(schema, object)
