const Encryption = require('../util');
const path = require('path');
const User = require('../models/userModel');

// Initialize the User model
const credentials = new User();

const util = new Encryption();

// Middleware to check authentication
exports.authenticate = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Handle logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    console.log('User logged out');
    res.redirect('/');
  });
};

// Show login page
exports.showLoginPage = (req, res) => {
  res.render('index', { error: req.query.error || null, registering: null, logining: true });
};

// Show register page
exports.showRegisterPage = (req, res) => {
  res.render('index', { error: req.query.error || null, registering: true });
};

// Handle registration
exports.register = async (req, res) => {
  try {
    const { username, password, cpassword } = req.body;
    const secret = util.encrypt(password);

    if (!username || !password || !cpassword) {
      const error = 'All fields are required';
      return res.render('index', { regiserror: error, registering: true });
    } else if (username.length < 3) {
      const error = 'Username must be at least 3 characters';
      return res.render('index', { regiserror: error, registering: true });
    } else if (password !== cpassword) {
      const error = 'Passwords do not match';
      return res.render('index', { regiserror: error, registering: true });
    } else if (password.length < 8) {
      const error = 'Password must be at least 8 characters';
      return res.render('index', { regiserror: error, registering: true });
    }

    // Check if username exists
    const existingUser = await credentials.findByUsername(username);
    if (existingUser) {
      const error = `Username: ${username} already exists`;
      return res.render('index', { regiserror: error, registering: true });
    }

    // Create new user with username as the default name
    await credentials.addUser({
      username,
      password: secret,
      name: username // Set name to username by default
    });
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('index', { regiserror: 'An error occurred during registration', registering: true });
  }
};

// Handle login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const secret = util.encrypt(password);

    // Find user by username
    const user = await credentials.findByUsername(username);

    if (user && user.password === secret) {
      req.session.user = username;
      console.log(`${username} has logged in`);
      res.redirect('/');
    } else {
      const error = `Invalid credentials`;
      res.render('index', { loginerror: error, registering: null, logining: true });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render('index', { loginerror: 'An error occurred during login', registering: null, logining: true });
  }
};

