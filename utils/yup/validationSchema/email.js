const Yup = require('yup')
const getErrors = require('utils/yup/getErrors')

const schema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid')
    .typeError('Email must be a string')
})

module.exports = object => getErrors(schema, object)
