
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
	    var username = req.params.username;
	    db.collection('users', function(err, collection) {
	        collection.findOne({'username': username }, function(err, item) {
	            res.send(item);
	            db.close();
	        });
	    });
    });
};