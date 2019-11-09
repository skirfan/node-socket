const router = require('express').Router()
const HelloController = require('controller/hello')

router.get('/', HelloController.helloWorld)
router.get('/:name', HelloController.sayHello)

module.exports = router
