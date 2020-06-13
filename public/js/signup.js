const name = document.querySelector('.name_input')
const email = document.querySelector('.email_input')
const pwd = document.querySelector('.pwd_input')
const login = document.querySelector('.login_btn')
const form = document.querySelector('.auth_form')
const actions = {
    'admin': '/admin/signup', 
    'user': '/signup'
}
const action = form.classList[1] === 'admin' ? actions.admin : actions.user

login.addEventListener('click', e => {
    if(name.value=== '' || email.value === '' || pwd.value === '') {
        e.preventDefault()
        alert('Please enter all fields')
    }
        
    else 
        document.querySelector('.auth_form').setAttribute('action', action)
})
