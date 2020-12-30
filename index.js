const express = require('express')
const mainRouter = require('./app/routes/mainRoutes.js')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', path.join(__dirname, './app/views'))

app.use('/static', express.static(path.join(__dirname, 'app/public')))
app.use('/', mainRouter)

const port = process.env.PORT || 3000
app.listen(port)

console.log('Express server running on port', port)
