
/*
 * GET feeds listing.
 */

var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

  
//Se crea con el fin de encontrar una base de datos apropiada para conectar.
var uri = process.env.MONGOLAB_URI || 'localhost';
console.log("Uri: "+uri) ; 

var server = new Server(uri, 27017, {auto_reconnect: true});
db = new Db('pescadorescolombiadb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'pescadorescolombiadb' database");
        db.collection('feeds', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'feeds' collection doesn't exist");
            }
        });
    }
});

exports.findAll = function(req, res) {
    db.collection('feeds', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};