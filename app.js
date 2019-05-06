var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var file = require('./models/file.js');

mongoose.connect('mongodb + srv: //kamal:kamal123@learning-oxyrk.mongodb.net/test?retryWrites=true',{useNewUrlParser:true})

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})

var upload = multer({storage:storage})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



indexRouter.post('/api/upload/',upload.single('myfile'),(req,res,next)=>{

  var upload = new file({
    name:req.file.originalname,
    type:req.file.mimetype,
    fileSize:req.file.size,
    path:req.file.path
  })

  upload.save(error=>{
    if(error)
        return res.send(error);
  })
  res.send({originalname:req.file.originalname,type:req.file.mimetype,size:req.file.size})
  // next()
})
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

module.exports = app;
