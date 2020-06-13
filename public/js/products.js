const products = document.querySelector('.products')

// setTimeout(() => getProducts() , 5000)

function getProducts() {
    document.querySelector('.loading').innerText = 'Getting the Products. Please Wait.'
    axios('/admin/api/products')
        .then(res => {
            document.querySelector('.loading').innerText = ''
            if(res.data.length) {
                res.data.forEach(product => {
                    const { folder, images, name, category, stocks } = product
                    let div = document.createElement('div')
                    div.classList.add('product')
                    let content = `<div class='image_con'>
                        <img src='../uploads/${folder}/${images[0]}' />
                    </div>
                    <div class='pro_content'>
                        <h4 class='name'>${name}</h4>
                        <p class='category'>${category}</p>
                        <p class='stocks'>${stocks}</p>
                        <a href='#'>Edit Details</a>
                    </div>`
                    div.innerHTML = content
                    products.appendChild(div)
                })
            }            
        })
        .catch(err => {
            console.log(err)
        })
}

getProducts()