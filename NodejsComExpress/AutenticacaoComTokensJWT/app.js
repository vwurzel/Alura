const express = require('express')
const app = express()
const passport = require('passport')

const { estrategiasAutenticacao } = require('./src/usuarios')

app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

module.exports = app
