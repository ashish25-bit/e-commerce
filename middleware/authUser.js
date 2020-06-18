const { customer, admin } = require('../secret')

module.exports = (req, res, next) => {

    const authType = req.session['x-auth-type']
    const queryValue = req.query.referrer

    // if param is undefined i.e. not present
    if (queryValue == undefined)
        return (
            authType === customer ?
                res.redirect(`/home?referrer=${customer}`) :
                res.redirect(`/admin/dashboard?referrer=${admin}`)
        )

    const pathname = req._parsedOriginalUrl.pathname

    // if param is present and same as the original key
    if (authType === queryValue) {
        // if customer is logged in and tried to access admin page
        if(authType === customer && pathname.includes('admin')) 
            return res.redirect(`/home?referrer=${customer}`)

        // if admin is logged in and tried to access customer page
        if(authType === admin && !pathname.includes('admin')) 
            return res.redirect(`/admin/dashboard?referrer=${admin}`)
    }

    // if parameters is present but doesn't matches with the session variable
    else {
        if (authType === customer) 
            return res.redirect(`/home?referrer=${customer}`)
        else if (authType === admin) 
            return res.redirect(`/admin/dashboard?referrer=${admin}`)
    }
    next()
}