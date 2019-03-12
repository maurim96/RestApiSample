var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const PORT = 3000;
var bodyParser = require('body-parser');
var restful = require('node-restful');
var methodOverride = require('method-override');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mongoose = require('mongoose');

var products = require('./routes/products');

var app = express();
app.use(cors());
var Category = app.resource = restful.model('category', mongoose.Schema({
  cat_name: String,
}))
.methods(['get', 'post', 'put', 'delete']);

//Mongoose config and connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/RestApiSample')
  .then((z) => console.log('connection succesful'))
  .catch((err) => console.error(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', products);
Category.register(app, '/category');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT);
});

module.exports = app;
