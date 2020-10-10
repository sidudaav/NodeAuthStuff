const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { getUserByUsername, getUserById } = require('../utils/users.utils')

const initializePassport = (passport) => {
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username)
        
        if (!user) {
            return done(null, false, { message: 'No user exists with that email'})
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password is incorrect'})
            }
        } catch (e) {
            return done(e, false)
        }
    }

    passport.use(new LocalStrategy(authenticateUser))
    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser(async (id, done) => done(null, await getUserById(id)))
}

module.exports = initializePassport