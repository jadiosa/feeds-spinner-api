
/*
 * GET Catch listing.
 */

var MongoClient = require('mongodb').MongoClient;
var BSON = require('mongodb').BSONPure;
var fs = require('fs');

var uri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pescadorescolombiadbtest';

exports.findByUserName = function(req, res) {
    MongoClient.connect(uri, function(err, db) {
	    if(err) throw err;
	    var credentials = req.body
	    var username = credentials.username;
	    var pass = credentials.pass;
	    db.collection('users', function(err, collection) {
	        collection.findOne({'username': username, 'pass' : pass }, {fields:{pass:0, username:0}}, function(err, item) {
	            res.send(item);
	            db.close();
	        });
	    });
    });
};