
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
	        collection.find({},{fields:{like:0, comment:0, lastModified:0}}).toArray(function(err, items) {
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

	    console.log('findById: ' + id);
	    db.collection('feeds', function(err, collection) {
	        collection.findOne({'_id': id},function(err, item) {
	        	console.log('findById: ' + JSON.stringify(item));
	            myFilteredData = item.like.filter(function(obj) {
    				return obj.from.facebookid === '10152666156158057';
  				});
  				console.log(console.myFilteredData);
	            res.send(item); 
	            db.close();
	        });

	    });
    });
};

exports.addLike = function(req, res) {
    MongoClient.connect(uri, function(err, db) {
	    if(err) throw err;
	    var id = req.params.id;
    	var like = req.body;
    	console.log('addLike.Id: ' + id);
	    console.log(JSON.stringify(like));

	    db.collection('feeds', function(err, collection) {
	        collection.update({'_id': id}, {$push: {'like': like}, $inc: {'likes': 1}},function(err, result) {
	            if (err){
	            	console.log('Error adding like: ' + err);
                	res.send({'error':'An error has occurred'});
	            } else {
	            	res.send(like);
	            	db.close();
	            }
	        });
	    });
    });
};

exports.addComment = function(req, res) {
    MongoClient.connect(uri, function(err, db) {
	    if(err) throw err;
	    var id = req.params.id;
    	var comment = req.body;
	    console.log('addComment.Id: ' + id);
	    console.log(JSON.stringify(comment));
	    
	    db.collection('feeds', function(err, collection) {
	        collection.update({'_id': id}, {$push: {'comment': comment}, $inc: {'comments': 1}},function(err, err) {
	            if (err){
	            	console.log('Error adding comment: ' + err);
                	res.send({'error':'An error has occurred'});
	            } else {
	            	res.send(comment);
	            	db.close();
	            }
	        });
	    });
    });
};