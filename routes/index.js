// 
// routes/index.js – This file handles my public routes like home, register, login, and GitHub login

const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// GET / – This is the home page of my site
router.get('/', (req, res) => {
  // I'm rendering the home (splash) page with a welcoming message
  res.render('index', { title: 'Welcome to Student Directory' });
});

// GET /register – This route shows the registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// POST /register – This route handles user registration
router.post('/register', async (req, res) => {
  try {
    const user = new User({ username: req.body.username });

    // Await the async method to set and hash password
    await user.setPassword(req.body.password);

    await user.save();

    res.redirect('/login');
  } catch (err) {
    console.error('Error during registration:', err);
    res.redirect('/register');
  }
});

// GET /login – This route displays the login form
router.get('/login', (req, res) => {
  res.render('login');
});

// POST /login – This route checks credentials and logs the user in using passport-local
router.post('/login', passport.authenticate('local', {
  successRedirect: '/students', // If login is successful, go to student list
  failureRedirect: '/login', // If login fails, stay on login page
  failureFlash: true // I’m using flash messages to show login errors
}));

// GET /auth/github – This is where I start GitHub authentication
router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GET /auth/github/callback – GitHub redirects users back here after login
router.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login', // If GitHub login fails, go to login
    successRedirect: '/students' // If successful, go to student list
  })
);

// GET /logout – This logs the user out and redirects them to the home page
router.get('/logout', (req, res) => {
  // I’m logging out the user by calling logout()
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
