const router = require('express').Router()
const User = require('../models/user.model')
const bcrypt = require('bcrypt')

const passport = require('passport')

// Set up middlewares
const { checkAuthenticated } = require('../middlewares/auth.middlewares')


// AUTHORIZATION ROUTES
router.post('/register', async (req, res) => {
    const {username, password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
        username,
        password: hashedPassword,
    })
    await newUser.save()

    res.json(newUser)
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}))

router.post('/follow/:id', checkAuthenticated, async (req, res) => {
    const userId = req.user.id
    const followedId = req.params.id

    const user = await User.findById(userId)
    const followedUser = await User.findById(followedId)
   
    // Determine whether to follow or unfollow a user
    if (!user.following.includes(followedId)) {
        user.following.push(followedId)
        followedUser.followers.push(userId)
    } else {
        console.log('here')
        user.following = user.following.filter(id => id != followedId)
        followedUser.followers = followedUser.followers.filter(id => id != userId)
    }

    user.save()
    followedUser.save()

    res.json('OK')
})


// GENERAL API ROUTES
router.get('/', async (req, res) => {
    const users = await User.find()
    res.json(users)
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    res.json(user)
})

router.patch('/:id', async (req, res) => {
    let user = await User.findById(req.params.id)
    
    for ([key, value] of Object.entries(req.body)) {
        user[key] = value
    }

    const updatedUser = await user.save()
    res.json(updatedUser)
})

module.exports = router