const stripe = Stripe('STRIPE_PUBLIC_KEY');
let elements = stripe.elements()
const form = document.getElementById('payment-form')
const increase = document.querySelector('.increase')
const decrease = document.querySelector('.decrease')
let quantity = document.querySelector('.quantity span')
const total = document.querySelector('.total')
const totalOriginal = parseInt(document.querySelector('.total').innerText)

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
  let hiddenInput = document.createElement('input')
  hiddenInput.setAttribute('type', 'hidden')
  hiddenInput.setAttribute('name', 'stripeToken')
  hiddenInput.setAttribute('value', token.id)
  let hiddenPrice = document.createElement('input')
  hiddenPrice.setAttribute('type', 'hidden')
  hiddenPrice.setAttribute('name', 'amount')
  hiddenPrice.setAttribute('value', parseInt(total.innerText) * 100)
  form.appendChild(hiddenInput)
  form.appendChild(hiddenPrice)

  // Submit the form
  form.submit()
}

// increase quantity
increase.addEventListener('click', () => {
  let quantityInteger = parseInt(quantity.innerText)
  let totalPrice

  if (quantityInteger < 1) {
    quantityInteger = 1
    totalPrice = totalOriginal
  }

  else {
    quantityInteger += 1
    totalPrice = quantityInteger * totalOriginal
  }

  quantity.innerText = quantityInteger
  total.innerText = totalPrice
  decrease.classList.remove('disable')
  decrease.disabled = false
})

// deccrease
decrease.addEventListener('click', () => {
  let quantityInteger = parseInt(quantity.innerText)
  let totalPrice

  if (quantityInteger !== 1 && quantityInteger > 1) {
    quantityInteger -= 1
    totalPrice = quantityInteger * totalOriginal
  }

  else {
    quantityInteger = 1
    totalPrice = totalOriginal
  }

  if (quantityInteger === 1) {
    decrease.classList.add('disable')
    decrease.disabled = true
  }

  quantity.innerText = quantityInteger
  total.innerText = totalPrice
})