var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var { verify_token } = require('./jwt/index');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var portRouter = require('./routes/port');
var subscribeRouter = require('./routes/subscribe');
var driverRouter = require('./routes/driver');

var app = express();

var db = require('./db/connect');

/* 设置白名单 */
const whiteList = ['/user/login', '/user/regist', '/admin/login', '/admin',];

// 验证token
app.use((req, res, next) => {
    if(!whiteList.includes(req.url)){// 非白名单验证
        verify_token(req.headers.accesstoken).then(res => next())
        .catch(e => res.json({
            code: '4001',
            data: 'Invalid Token'
        }))
    }else{// 白名单跳过
      next();
    }
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);
app.use('/port', portRouter);
app.use('/subscribe', subscribeRouter)
app.use('/driver', driverRouter)

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
