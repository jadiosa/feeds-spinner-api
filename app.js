
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var feed = require('./routes/feed');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
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
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE');
  	res.header("Access-Control-Allow-Headers", "X-Requested-With");
  	next();

  //res.header("Access-Control-Allow-Origin", "*");
  //res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE');
  //res.header("Access-Control-Allow-Headers", "content-Type,x-requested-with");
  //next();
 });

app.get('/', routes.index);
app.get('/feed', feed.findAll);
app.get('/feed/:id', feed.findById);
app.put('/feed/:id/addLike', feed.addLike);
app.put('/feed/:id/addComment', feed.addComment);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
