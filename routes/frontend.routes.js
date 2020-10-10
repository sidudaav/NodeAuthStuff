const router = require('express').Router()
const request = require('request');

// Set up middlewares
const { checkAuthenticated, checkNotAuthenticated} = require('../middlewares/auth.middlewares')
const { updateUserProperties } = require('../middlewares/users.middlewares')

router.use(updateUserProperties)

// Set up routes
router.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs')
})

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

router.post('/register', checkNotAuthenticated, (req, res) => {
    const { username, password } = req.body

    request.post({
        url:`http://${req.headers.host}/api/users/register`, 
        body:{
            username,
            password
        },
        json: true
    }, function(err, response, body){
        if (body) {
            return res.redirect('/login')
        }

        res.redirect('/register')
    })
})

module.exports = router