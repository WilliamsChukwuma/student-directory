// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// require('dotenv').config();
// const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// const passport = require('passport');
// require('./config/passport');

// app.use(require('express-session')({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// module.exports = app;

// app.js – This is where I’m building the main Express application for my project.

require('dotenv').config(); // I’m loading environment variables like DB URI and session secret

const express = require('express'); // I'm using Express to create the server
const path = require('path'); // This helps me work with file paths easily
const mongoose = require('mongoose'); // I’m using Mongoose to talk to MongoDB
const passport = require('passport'); // Passport handles user authentication for me
const session = require('express-session'); // This keeps users logged in
const flash = require('connect-flash'); // Flash helps me show login errors/messages

// I’m pulling in my Passport config so it’s activated when the app starts
require('./config/passport');

// Bringing in my route files (for pages like login, register, and students)
const indexRouter = require('./routes/index');
const studentRouter = require('./routes/students');

const app = express(); // I’m starting up the Express app

// Connecting to MongoDB using the URI from my .env file
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

// Telling Express where my views are and to use Handlebars as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware: handles form input and static files like stylesheets
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup to store user login state between pages
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initializing Passport and connecting it to session
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware for showing error messages (like invalid login)
app.use(flash());

// Making user and error variables available to my templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.error = req.flash('error');
  next();
});

// Hooking up my route files
app.use('/', indexRouter);
app.use('/students', studentRouter);

// Exporting the app so it can be started from the `bin/www` file
module.exports = app;

