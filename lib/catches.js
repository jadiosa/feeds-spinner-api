
/*
 * GET Catch listing.
 */

var MongoClient = require('mongodb').MongoClient;
var BSON = require('mongodb').BSONPure;
var fs = require('fs');

var uri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pescadorescolombiadbtest';

// Create the "uploads" folder if it doesn't exist
fs.exists(__dirname + '/uploads', function (exists) {
    if (!exists) {
        console.log('Creating directory ' + __dirname + '/uploads');
        fs.mkdir(__dirname + '/uploads', function (err) {
            if (err) {
                console.log('Error creating ' + __dirname + '/uploads');
                process.exit(1);
            }
        })
    }
});


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

exports.addCatch = function(req, res) {
    MongoClient.connect(uri, function(err, db) {
	    if(err) throw err;
    	var catches = req.body;
	    db.collection('catches', function(err, collection) {
	        collection.insert(catches,function(err, result) {
	            if (err){
                	res.send({'error':'An error has occurred'});
	            } else {
	            	res.send(catches);
	            	db.close();
	            }
	        });
	    });
    });
};

exports.addImage = function(req, res) {
    var file = req.files.file,
        filePath = file.path,
        lastIndex = filePath.lastIndexOf("/"),
        tmpFileName = filePath.substr(lastIndex + 1),
        image = req.body;

    image.fileName = tmpFileName;

    fs.readFile(filePath, function (err, data) {
	  var newPath = __dirname + "/uploads/" + tmpFileName;
	  fs.writeFile(newPath, data, function (err) {
	    res.json(image);
	  });
	});
};