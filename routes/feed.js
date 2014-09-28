
/*
 * GET feeds listing.
 */

var MongoClient = require('mongodb').MongoClient
  
//Se crea con el fin de encontrar una base de datos apropiada para conectar.
var uri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pescadorescolombiadb';


exports.findAll = function(req, res) {
    MongoClient.connect(uri, function(err, db) {
	    if(err) throw err;

	    db.collection('feeds', function(err, collection) {
	        collection.find({},{fields:{like:0, comment:0}}).toArray(function(err, items) {
	            res.send(items);
	            db.close();
	        });
	    });
    });
};