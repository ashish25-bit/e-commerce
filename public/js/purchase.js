const stripe = Stripe('STRIPE_PUBLIC_KEY');
let elements = stripe.elements()
const form = document.getElementById('payment-form')
const increase = document.querySelector('.increase')
const decrease = document.querySelector('.decrease')
let quantity = document.querySelector('.quantity span')
let quantityTable = document.querySelector('.gross_total .quantity')
const additional = document.querySelector('.gross_total .additional')
const total = document.querySelector('.total')
const totalOriginal = parseInt(document.querySelector('.gross_total .price').innerText)
const feePercent = 0.036

const id = Qs.parse(location.search, { ignoreQueryPrefix: true })

let style = {
  base: {
    // Add your base input styles here. For example:
    fontSize: '16px',
    color: '#32325d'
  },
}

// Create an instance of the card Element.
let card = elements.create('card', { style: style })

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element')

form.addEventListener('submit', function (event) {
  event.preventDefault()

  stripe.createToken(card).then(function (result) {
    if (result.error) {
      let errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      stripeTokenHandler(result.token)
    }
  })
})

function stripeTokenHandler(token) {
  // token element
  let hiddenInput = document.createElement('input')
  hiddenInput.setAttribute('type', 'hidden')
  hiddenInput.setAttribute('name', 'stripeToken')
  hiddenInput.setAttribute('value', token.id)
  // id of the product
  let hiddenId = document.createElement('input')
  hiddenId.setAttribute('type', 'hidden')
  hiddenId.setAttribute('name', 'id')
  hiddenId.setAttribute('value', id.r)
  // quantity
  let hiddenQuantity = document.createElement('input')
  hiddenQuantity.setAttribute('type', 'hidden')
  hiddenQuantity.setAttribute('name', 'quantity')
  hiddenQuantity.setAttribute('value', parseInt(quantity.innerText) < 1 ? 1 : parseInt(quantity.innerText))

  form.appendChild(hiddenInput)
  form.appendChild(hiddenId)
  form.appendChild(hiddenQuantity)

  // Submit the form
  form.submit()
}

// increase quantity
increase.addEventListener('click', () => {
  let quantityInteger = parseInt(quantity.innerText)
  let totalPrice
  let addFee

  if (quantityInteger < 1) {
    quantityInteger = 1
    addFee = totalOriginal * feePercent
    totalPrice = totalOriginal + addFee
  }

  else {
    quantityInteger += 1
    addFee = totalOriginal * quantityInteger * feePercent
    totalPrice = (totalOriginal * quantityInteger) + addFee
  }

  quantity.innerText = quantityInteger
  quantityTable.innerText = quantityInteger
  total.innerText = totalPrice
  additional.innerText = addFee
  decrease.classList.remove('disable')
  decrease.disabled = false
})

// deccrease
decrease.addEventListener('click', () => {
  let quantityInteger = parseInt(quantity.innerText)
  let totalPrice
  let addFee

  if (quantityInteger !== 1 && quantityInteger > 1) {
    quantityInteger -= 1
    addFee = totalOriginal * quantityInteger * feePercent
    totalPrice = (totalOriginal * quantityInteger) + addFee
  }

  else {
    quantityInteger = 1
    addFee = totalOriginal * feePercent
    totalPrice = totalOriginal + addFee
  }

  if (quantityInteger === 1) {
    decrease.classList.add('disable')
    decrease.disabled = true
  }

  quantity.innerText = quantityInteger
  quantityTable.innerText = quantityInteger
  additional.innerText = addFee
  total.innerText = totalPrice
})