const sayHello = (req, res) => {
  return res.send(`Hello, ${req.params.name}!`)
}

module.exports = sayHello
