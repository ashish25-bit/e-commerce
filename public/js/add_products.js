const ul = document.querySelector('.des')
const input = document.querySelector('.des_input')
const img = document.querySelector('#image_input')
const preview = document.querySelector('.preview_images')
const name = document.querySelector('#add_name')
const category = document.querySelector('#add_category')
const price = document.querySelector('#add_price')
const stocks = document.querySelector('#add_stocks')
let response_msg = document.querySelector('.response_msg')
const add = document.querySelector('.add_prod_btn button')
let description = []

document.querySelector('.add_des_btn').addEventListener('click', e => {
    e.preventDefault()
    if(input.value !== '') {
        const li = document.createElement('li')
        li.innerText = input.value.trim()
        ul.appendChild(li)
        description.push(input.value.trim())
        input.value= ''
    }
})

img.addEventListener('change', e => {
    if (e.target.files.length) {
        for(let i=0; i<e.target.files.length; i++) {
            let reader = new FileReader()
            const upload = document.createElement('img')
            reader.onload = () => upload.src = reader.result 
            reader.readAsDataURL(e.target.files[i])
            upload.classList.add('uploaded_product_image')
            preview.appendChild(upload)
        }
    }
})

name.addEventListener('focus', removeStyle)
category.addEventListener('focus', removeStyle)
price.addEventListener('focus', removeStyle)
stocks.addEventListener('focus', removeStyle)

add.addEventListener('click', e => {
    e.preventDefault()

    // if name is empty
    if(name.value === '') {
        emptyField(name)
        return
    }

    // if category is empty
    if(category.value === '') {
        emptyField(category)
        return
    }

    // if price is empty
    if(price.value === '') {
        emptyField(price)
        return
    }

    // if stocks is empty
    if(stocks.value === '') {
        emptyField(stocks)
        return
    }

    // if description is empty
    if(!description.length) {
        alert('Enter atleast one point in description')
        return
    }

    add.disabled = true
    add.style.backgroundColor = '#9cc4f0'
    let formData = new FormData()
    formData.append('name', name.value)
    formData.append('category', category.value)
    formData.append('price', price.value)
    formData.append('stocks', stocks.value)

    for(let i=0; i<description.length; i++) 
        formData.append('description', description[i])

    for(let i=0; i<img.files.length; i++) 
        formData.append('myfile', img.files[i])

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    axios.post('/admin/add/product', formData, config)
        .then(res => {
            response_msg.classList.add('response_msg_active')
            response_msg.innerText = res.data
            add.disabled = false
            add.style.backgroundColor = '#3C8CE7'

            // reinitializing everything to empty
            description = []
            name.value = ''
            category.value = ''
            price.value = ''
            stocks.value = ''
            preview.innerHTML = ''
            ul.innerHTML = ''

            setTimeout(() => {
                response_msg.classList.remove('response_msg_active')
                response_msg.innerText = ''
            }, 5000)
        })
        .catch(err => {
            response_msg.classList.add('response_msg_active')
            response_msg.innerText = err
            add.disabled = false
            add.style.backgroundColor = '#3C8CE7'
            setTimeout(() => {
                response_msg.classList.remove('response_msg_active')
                response_msg.innerText = ''
            }, 5000)
        })  
})

function emptyField (field) {
    field.style.border = '1.3px red solid'
}

function removeStyle(e) {
    e.target.style = '1.3px #ccc solid'
}