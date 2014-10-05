
/*
 * GET feeds listing.
 */

var MongoClient = require('mongodb').MongoClient
 
//Se crea con el fin de encontrar una base de datos apropiada para conectar.
var uri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pescadorescolombiadb';


exports.findAll = function(req, res) {
    MongoClient.connect(uri, function(err, db) {
	    if(err) throw err;
	    var userid = req.query.userid;

	    console.log('findAll.userid: ' + userid);
	    db.collection('feeds', function(err, collection) {
	        collection.find({},{fields:{comment:0, lastModified:0}}).toArray(function(err, items) {

	        	/* Se agrega el campo likedByUser al array de Feeds que se devuelven */
	        	items.forEach(function(item) {
	        		if (item.like){
		        		like = item.like.filter(function(obj) {
		    				return obj.from.facebookid === userid;
		  				});
			            
			            if(like.length > 0){
			            	item.likedByUser = true;
			            }else{
			            	item.likedByUser = false;
			            }
		        	}else{
		        		item.likedByUser = false;
		        	}
	        	});
		        	
	        	/* ------------------------------------  */

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
	    var userid = req.query.userid;

	    console.log('findById.id: ' + id);
	    console.log('findById.userid: ' + userid);
	    db.collection('feeds', function(err, collection) {
	        collection.findOne({'_id': id},function(err, item) {
	        	
	        	/* Se agrega el campo likedByUser al JSON que sde devuelve */
	        	if (item.like){
	        		like = item.like.filter(function(obj) {
	    				return obj.from.facebookid === userid;
	  				});
		            
		            if(like.length > 0){
		            	item.likedByUser = true;
		            }else{
		            	item.likedByUser = false;
		            }
	        	}else{
	        		item.likedByUser = false;
	        	}
	        	/* ------------------------------------  */
	            
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

exports.removeLike = function(req, res) {
    MongoClient.connect(uri, function(err, db) {
	    if(err) throw err;
	    var id = req.params.id;
    	var like = req.body;
    	console.log('remove.Id: ' + id);
	    console.log(JSON.stringify(like));

	    db.collection('feeds', function(err, collection) {
	        collection.update({'_id': id}, {$pull: {'like': like}, $inc: {'likes': -1}},function(err, result) {
	            if (err){
	            	console.log('Error removing like: ' + err);
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