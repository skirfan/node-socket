const getErrors = async (schema, object) => {
  if (await schema.isValid(object)) return false
  try {
    await schema.validate(object)
  } catch (error) {
    return { message: error.message || error.errors[0] }
  }
  return { message: 'Unknown validation error' }
}

module.exports = getErrors
