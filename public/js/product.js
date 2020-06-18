const images = document.querySelectorAll('.aside_small_images img')
const on_view = document.querySelector('.full_image_size img')
const cart = document.querySelector('.add_to_cart')
const wishlist = document.querySelector('.wishlist')
const buy = document.querySelector('.buy')
let response_msg = document.querySelector('.response_msg')
let name = document.querySelector('.product_detail_con h2').innerText
let current_on_view = 0

const id = Qs.parse(location.search, { ignoreQueryPrefix: true })


// if only the product is found only then.. 
if(images.length > 0) {
    images[current_on_view].classList.add('on_view')

    images.forEach((image, index) => {
        image.addEventListener('mouseover', e => {
            if (current_on_view !== index) {
                images[current_on_view].classList.remove('on_view')
                e.target.classList.add('on_view')
                on_view.src = e.target.src
                current_on_view = index
            }
        })
    })

    // add to cart
    cart.addEventListener('click', e => addItem('cart', e))

    // add to wishlist
    wishlist.addEventListener('click', e => addItem('wishlist', e))

}

function addItem(type, event) {
    event.target.disabled = true
    response_msg.classList.remove('response_msg_active')
    response_msg.innerText = ''
    axios.post(`/add/${type}/${id.r}`)
        .then(res => {
            event.target.disabled = false
            responseTimeout(res.data)
        })
        .catch(err => {
            event.target.disabled = false
            responseTimeout(err)
        })
}

function responseTimeout(msg) {
    response_msg.classList.add('response_msg_active')
    response_msg.innerText = msg
    setTimeout(() => {
        response_msg.classList.remove('response_msg_active')
        response_msg.innerText = ''
    }, 5000)
}

buy.addEventListener('click', () => {
    name = name.split(' ').join('-')
    window.location.href = `/purchase/${name}?r=${id.r}&referrer=${authReferrer}` 
})