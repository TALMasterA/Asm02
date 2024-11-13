var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var equipmentRouter = require('./routes/equipment');

var app = express();
const port = 3000;

// view engine setup
app.set('json spaces', 2);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/equipment', equipmentRouter);

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

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to display all available equipment for rent
app.get('/equipments', async (req, res) => {
  try {
      const equipments = await Equipment.find();
      res.render('equipments', { equipments });
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

// Route to fetch equipment data
app.get('/', async (req, res) => {
  try {
      const equipments = await Equipment.find();
      res.render('index', { equipments });
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: err
  });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
