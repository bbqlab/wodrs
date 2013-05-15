var mongo = require('mongodb'),
    config = require('./config');

DBNAME = 'wodrsdb';
DBHOST = 'localhost';

var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;
 
var server = new Server(DBHOST, 27017, {auto_reconnect: true});
db = new Db(DBNAME, server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'wodrsdb' database");
        db.collection('wodrsdb', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});

exports.db = db;

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var users = [
    {
        name: "test",
    },
    {
        name: "test2",
    }];
 
    db.collection('wodrsdb', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });
 
};

