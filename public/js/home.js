const form = document.querySelector('.product_search_con')
const key = document.querySelector('.product_search_con input')
const categories = document.querySelectorAll('.category_btn')
const response = document.querySelector('.response_search')
const products = document.querySelector('.product_search')
let category_index = -1
let current_category = ''

form.addEventListener('submit', e => {
    e.preventDefault()
    if (key.value !== '') {
        products.innerHTML = ''
        response.innerText = 'Searching..'
        searchProduct()
    }
})

categories.forEach((category, index) => {
    category.addEventListener('click', () => {
        
        products.innerHTML = ''

        if (category_index >= 0 && index !== category_index)
            categories[category_index].classList.remove('active_category')
        
        category_index = index

        const contains = category.classList.contains('active_category')

        contains ? category.classList.remove('active_category') : category.classList.add('active_category')        
        current_category = contains ? '' : category.innerText
        response.innerText = 'Searching..'
        searchProduct()
    })
})


function searchProduct() {
    axios.get(`/search/product?key=${key.value.trim()}&category=${current_category}`)
        .then(res => {
            
            if (res.data.msg) {
                response.innerText = res.data.msg
                return
            }

            response.innerText = key.value === '' ? '' : `Results for: ${key.value}`

            if (res.data.length) {
                res.data.forEach(product => {
                    const { _id, folder, images, name, stocks, price } = product
                    let div = document.createElement('div')
                    div.classList.add('product')
                    const href = name.split(' ').join('-')
                    let content = `<div class='image_con'>
                        <img src='../uploads/${folder}/${images[0]}' />
                    </div>
                    <div class='pro_content'>
                        <a href="/product/${href}?r=${_id}" class='name'>${name}</a>
                        <p class='stocks'>${stocks > 0 ? stocks + ' stocks remaining' : 'Out Of stock'}</p>
                        <p>Price : &#x20B9; ${price}</p>
                    </div>`
                    div.innerHTML = content
                    products.appendChild(div)
                })
            }
            else
                products.innerHTML = '<h3>No Results</h3>'

        })
        .catch(err => {
            console.log(err)
            response.innerText = err
        })
}