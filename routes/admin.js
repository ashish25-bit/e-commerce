const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const path = require('path')
const multer = require('multer')
const random = require('random-id')
const fs = require('fs')

const app = express()
const Admin = require('../models/Admin')
const Product = require('../models/Product')

// for body parser
app.use(express.urlencoded({ extended: false }))
// setting the static folder
app.use(express.static(path.join(__dirname, 'public')))

// setting the views folder
app.set('views', path.join(__dirname, 'views'))

// register-admin page render
router.get('/register', (req, res) => {
    if (!req.session.user) {
        return res.render('admin/Register', {
            title: 'Admin Login - E-Commerce',
        })
    }
    res.send(`Hello signup ${req.session.user.name}`)
})

// register the admin
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body

    try {
        let admin = await Admin.findOne({ email })
        if (admin)
            return res.send('Admin Already exixts.')

        admin = new Admin({
            name,
            email,
            password
        })

        const salt = await bcrypt.genSalt(10)
        admin.password = await bcrypt.hash(password, salt)

        await admin.save()
        req.session.user = admin
        res.redirect('dashboard')
    }
    catch (err) {
        console.log(err)
        res.send(err.message)
    }
})

// login admin page render 
router.get('/login', (req, res) => {
    if (!req.session.user) {
        return res.render('admin/Login', {
            title: 'Admin Login - E-Commerce',
            action: 'auth_form admin',
            error: ''
        })
    }
    res.redirect('dashboard')
})

// verifying and logging in admin
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        let admin = await Admin.findOne({ email })
        if (!admin)
            return res.render('admin/Login', {
                title: 'Admin Login - E-Commerce',
                action: 'auth_form admin',
                error: 'Admin does not exists'
            })

        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch)
            return res.render('admin/Login', {
                title: 'Admin Login - E-Commerce',
                action: 'auth_form admin',
                error: 'Invalid Credentials'
            })

        req.session.user = admin
        res.redirect('dashboard')
    }
    catch (err) {
        console.log(err)
        res.send(err.message)
    }
})

// admin dashboard
router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        return res.render('admin/Dashboard', {
            title: 'Admin Dashboard',
            user: req.session.user
        })
    }
    res.redirect('login')
})

// get the product page
router.get('/add/product', (req, res) => {
    if (req.session.user)
        return res.render('admin/AddProducts', {
            title: 'Add Products',
            user: req.session.user
        })
    res.redirect('../login')
})

// add the product into the database
router.post('/add/product', async (req, res) => {
    // use random-id module to generate random folder ids
    const folderName = random(30, 'aA0')
    fs.mkdirSync(`./public/uploads/${folderName}`)
    let storage = multer.diskStorage({  
        destination: `./public/uploads/${folderName}`,
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    })

    const upload = multer({ storage: storage }).array('myfile', 5)

    upload(req, res, async function (err) {
        if (err) {
            console.log(err)
            return res.send('There was an error')
        }
        let images = []
        for(let i=0; i<req.files.length; i++) 
            images.push(req.files[i].filename)

        try {
            const product = {
                name: req.body.name,
                category: req.body.category,
                stocks: req.body.stocks,
                price: req.body.price,
                folder: folderName,
                description: req.body.description,
                images,
                sold: 0
            }
            const newProduct = new Product(product)
            await newProduct.save()
            res.send('Product Added')
        } 
        catch (err) {
            console.log(err)
            res.send('Server error')
        }
    })
})

// get the added products page
router.get('/products', (req, res) => {
    if (req.session.user)
        return res.render('admin/Products', {
            title: 'Products',
            user: req.session.user
        })
    res.redirect('login')
})

// api for getting all the uploaded products
router.get('/api/products', async (req, res) => {
    try {
        const result = await Product.find({})
        res.json(result)
    } 
    catch (err) {
        console.log(err)
        res.json({ err: 'Server Error' })
    }
})

module.exports = router