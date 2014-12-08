
/*
 * GET Catch listing.
 */

var MongoClient = require('mongodb').MongoClient;
var BSON = require('mongodb').BSONPure;

var uri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pescadorescolombiadbtest';


exports.findAll = function(req, res) {
    MongoClient.connect(uri, function(err, db) {
	    if(err) throw err;
	    var userid = req.params.userid;

	    db.collection('catches', function(err, collection) {
	        collection.find({'user.facebookid' : userid}).toArray(function(err, items) {
	            res.send(items);
	            db.close();
	        });
	    });
    });
};

exports.findById = function(req, res) {
    MongoClient.connect(uri, function(err, db) {
	    if(err) throw err;
	    var id = req.params.id;
	    db.collection('catches', function(err, collection) {
	        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
	            res.send(item);
	            db.close();
	        });
	    });
    });
};