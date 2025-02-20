const express = require('express');
const path = require('path');
const session = require('express-session');
const pageController = require('./controllers/pageController');

// Initialize Express app
const app = express();
// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
  })
);
// Routes

// app.get('/', authController.authenticate, taskController.getTasks);
// app.get('/view/:name', taskController.viewTask);
// app.get('/logout', authController.logout);
// app.get('/sort', authController.authenticate, taskController.sortTasksByPriority);
// app.get('/login', authController.showLoginPage);
// app.post('/login', authController.login);
// app.post('/add', authController.authenticate, taskController.addTask);
// app.post('/delete', authController.authenticate, taskController.deleteMultipleTasks);
// app.post('/search', authController.authenticate, taskController.searchTasksByName);

app.get('/', pageController.getPage);
app.post('/add', pageController.addClipboard);
app.post('/retrieve', pageController.retrieveClipboard);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});