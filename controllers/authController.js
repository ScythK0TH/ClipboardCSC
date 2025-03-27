const Encryption = require('../util');
const path = require('path');
const User = require('../models/userModel');

// Initialize the User model
const credentials = new User();
const usersFilePath = path.join(__dirname, '../user.json');

// Load users from file on app start
credentials.loadUsersFromFile(usersFilePath);

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
exports.register = (req, res) => {
  const { username, password, cpassword } = req.body;
  const secret = util.encrypt(password);

  if (!username || !password || !cpassword) {
    const error = 'All fields are required';
    res.render('index', { regiserror: error, registering: true });
  } else if (username.length < 3) {
    const error = 'Username must be at least 3 characters';
    res.render('index', { regiserror: error, registering: true });
  } else if (password !== cpassword) {
    const error = 'Passwords do not match';
    res.render('index', { regiserror: error, registering: true });
  } else if (password.length < 8) {
    const error = 'Password must be at least 8 characters';
    res.render('index', { regiserror: error, registering: true });
  } else if (credentials.getAllUsers().some((user) => user.username === username)) {
    const error = `Username: ${username} already exists`;
    res.render('index', { regiserror: error, registering: true });
  } else {
    credentials.addUser({ username, password: secret });
    credentials.saveUsersToFile(usersFilePath);
    res.redirect('/login');
  }
};

// Handle login
exports.login = (req, res) => {
  const { username, password } = req.body;
  const secret = util.encrypt(password);

  const user = credentials.getAllUsers().find(
    (user) => user.username === username && user.password === secret
  );

  if (user) {
    req.session.user = username;
    console.log(`${username} has logged in`);
    res.redirect('/');
  } else {
    const error = `Invalid credentials`;
    res.render('index', { loginerror: error, registering: null, logining: true });
  }
};

