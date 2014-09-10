
/*
 * GET feeds listing.
 */

var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

  
//Se crea con el fin de encontrar una base de datos apropiada para conectar.
var uri = process.env.MONGOHQ_URL || 'localhost';
  
// Servidor http escuchara en un puerto apropiado, o el puerto 5050 por defecto
var port = process.env.PORT || 27017; 

var server = new Server(uri, port, {auto_reconnect: true});
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