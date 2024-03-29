
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var feed = require('./lib/feed');
var user = require('./lib/user');
var catches = require('./lib/catches');
var sign = require('./lib/sign');
var http = require('http');
var path = require('path');

var app = exports.app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//CORS on ExpressJS
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  	res.header("Access-Control-Allow-Headers", "X-Requested-With,content-Type");
  	next();
 });

app.use(express.static(path.join(__dirname, './lib/uploads')));

app.get('/', routes.index);

app.get('/feed', feed.findAll);
app.get('/feed/:id', feed.findById);
app.post('/feed', feed.addFeed);
app.put('/feed/:id/addLike', feed.addLike);
app.put('/feed/:id/removeLike', feed.removeLike);
app.put('/feed/:id/addComment', feed.addComment);

app.get('/catches/user/:userid', catches.findAll);
app.get('/catches/:id', catches.findById);
app.post('/catches', catches.addCatch);

app.post('/user', user.findByUserName);

app.post('/sign_s3', sign.sign_s3);

http.createServer(app).listen(app.get('port'));
