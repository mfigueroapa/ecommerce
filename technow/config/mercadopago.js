const mercadopago = require('mercadopago')
// console.log("mercadopago------"+process.env.MP_TOKEN)
mercadopago.configure({
  access_token: process.env.MP_TOKEN
})
module.exports = mercadopago