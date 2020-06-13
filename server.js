const express = require('express')
const session = require('express-session')
const path = require('path')
const connectDb = require('./core/db')

const app = express()
connectDb()

// for body parser
app.use(express.urlencoded({ extended: false }))
// setting the static folder
app.use(express.static(path.join(__dirname, '/public')))
app.use('/admin', express.static('public'))
app.use('/product', express.static('public'))
app.use('/purchase', express.static('public'))
app.use('/admin/add', express.static('public'))

//set template engine 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// setting the proxy
app.set('trust proxy', 1)
// setting the session
app.use(session({
    secret: 'e_commerce',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 5 * 24 * 60 * 60 * 1000 } // 5 days cookie
}))

app.use('/', require('./routes/user'))
app.use('/admin', require('./routes/admin'))
app.use('/add', require('./routes/add'))
app.use('/purchase', require('./routes/purchase'))

//errors
app.use((req, res, next) => {
    var err = new Error('Page Not found')
    err.status = 404
    next(err)
})

//handling error
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err.message)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))