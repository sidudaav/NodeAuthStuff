const request = require('request')

// Middleware will run to update user properties when any frontend route is accessed
const updateUserProperties = async (req, res, next) => {
    if (!req.user) {
        return next()
    }

    // Get id of current user
    const userId = req.user._id

    // determine which user fields to update
    const lastActiveAt = new Date().toISOString()

    // Send patch request to update document
    request.patch({
        url:`http://${req.headers.host}/api/users/${userId}`, 
        body:{
            lastActiveAt: lastActiveAt
        },
        json: true
    }, function(err, response, body){
        return next()
    })

    return next()

}

module.exports.updateUserProperties = updateUserProperties