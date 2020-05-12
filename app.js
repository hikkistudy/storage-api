const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/Users');

// var indexRouter = require('./routes/index');
var storageRouter = require('./routes/storageList');
// var testAPIRouter = require('./routes/testAPI');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Configure Mongoose
mongoose.connect('mongodb://localhost:27017/storage');
mongoose.set('debug', true);

//Models & routes
mongoose.model('User', User);
require('./models/Users');
require('./config/passport');
app.use(require('./routes'));

// app.use('/', indexRouter);
app.use('/storageList', storageRouter);
// app.use('/testAPI', testAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function (request, response) {
  response.sendFile(__dirname + "/storage.json");
});

module.exports = app;
