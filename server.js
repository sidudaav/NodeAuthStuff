require('dotenv').config()
const express = require('express')
const logger = require('morgan')

const app = express()
app.use(logger('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Set up Flash and Session
const flash = require('express-flash')
const session = require('express-session')

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// Initialize Passport Local
const passport = require('passport')
const initializePassport = require('./config/passport.config')

initializePassport(passport)
app.use(passport.initialize())
app.use(passport.session())

// Set frontend routes
const frontendRouter = require('./routes/frontend.routes')
app.use('/', frontendRouter)

// Set API routes
const usersRouter = require('./routes/users.routes')
app.use('/api/users', usersRouter)

// Initalize MongoDB
const initializeDB = require('./config/db.config')
initializeDB()

// Run server on port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
