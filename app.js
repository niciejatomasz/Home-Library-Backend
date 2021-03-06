let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')

let app = express()

let indexRouter = require('./routes/index')
let usersRouter = require('./routes/users')
let apiStatusRouter = require('./routes/api/status')
let apiUsersRouter = require('./routes/api/users')
let apiBooksRouter = require('./routes/api/books')
let apiAuthenticateRouter = require('./routes/api/authenticate')

let db = require('./db')

// API documentation
let swaggerJSDoc = require('swagger-jsdoc')
let swaggerDefinition = {
  info: {
    title: 'HomeLibrary Swagger API',
    version: '0.0.2',
    description: 'Documentation for REST API with Swagger'
  },
  host: 'localhost:3000',
  basePath: '/'
}

let options = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./routes/api/*.js', './models/*.js']
}

let swaggerSpec = swaggerJSDoc(options)

app.set('superSecret', 'HomeLibrarySecret')

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

app.use('/api/status', apiStatusRouter)
app.use('/api/authenticate', apiAuthenticateRouter)
app.use('/api/users', apiUsersRouter)
app.use('/api/books', apiBooksRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
