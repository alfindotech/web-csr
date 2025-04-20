'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', ({ response }) => {
  return response.redirect('/login')
})

Route.get('/login', ({ view }) => {
  return view.render('login')
})

Route.post('/login', async ({ request, response, session }) => {
  const email = request.input('email')
  const password = request.input('password')

  // Simple hardcoded user credentials for demonstration
  const validEmail = 'user@example.com'
  const validPassword = 'password123'

  if (email === validEmail && password === validPassword) {
    // On successful login, set session and redirect to welcome page
    session.put('user', email)
    return response.redirect('/')
  } else {
    // On failure, flash error message and redirect back to login
    session.flash({ error: 'Invalid email or password' })
    return response.redirect('/login')
  }
})

Route.get('/register', ({ view }) => {
  return view.render('register')
})

const User = use('App/Models/User')

Route.post('/register', async ({ request, response, session, view }) => {
  const name = request.input('name')
  const email = request.input('email')
  const password = request.input('password')
  const passwordConfirmation = request.input('password_confirmation')

  // Basic validation
  if (!name || !email || !password || password !== passwordConfirmation) {
    session.flash({ error: 'Please fill all fields correctly and ensure passwords match.' })
    return response.redirect('/register')
  }

  // Save user to database
  const user = new User()
  user.username = name
  user.email = email
  user.password = password
  await user.save()

  // Render user details page with user data
  return view.render('user', { user })
})
