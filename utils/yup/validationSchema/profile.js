const Yup = require('yup')
const getErrors = require('utils/yup/getErrors')

const schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be longer than 2 characters')
    .max(70, "Name can't be longer than 70 characters")
    .required('Name is required')
    .typeError('Name must be a string'),
  avatar: Yup.string()
    .trim()
    .min(10, 'Filename must be longer than 10 characters')
    .max(70, "Filename can't be longer than 70 characters")
    .typeError('Filename must be a string')
})

module.exports = object => getErrors(schema, object)
