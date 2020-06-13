const remove = document.querySelectorAll('.remove_btn')
const response_msg = document.querySelector('.response_msg')
const container = document.querySelector('.extras_con')

if (remove.length) {
    remove.forEach(btn => {
        btn.addEventListener('click', () => {
            let type = getType()
            response_msg.classList.remove('response_msg_active')
            response_msg.innerText = ''
            const parent = btn.parentElement
            btn.disabled = true
            let id = btn.getAttribute('data-item-id')
            axios.post(`/add/${type}/${id}`)
                .then(res => {
                    parent.remove()
                    if(!container.childElementCount) {
                        document.body.append(`No products in your ${type}`)
                        if(type === 'cart')
                            document.querySelector('.buy_all').remove()
                    }
                    responseTimeout(res.data)
                })
                .catch(err => {
                    btn.disabled = false
                    responseTimeout(err)
                })
        })
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

function getType() {
    return document.querySelector('.wish-cart').innerText.toLowerCase()
}