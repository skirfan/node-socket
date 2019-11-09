const Yup = require('yup')
const getErrors = require('utils/yup/getErrors')

const schema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid')
    .typeError('Email must be a string'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(16, "Password can't be longer than 16 characters")
    .typeError('Password  must be a string')
})

module.exports = object => getErrors(schema, object)
