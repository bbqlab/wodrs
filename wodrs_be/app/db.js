var mongo = require('mongodb'),
    config = require('./config');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server(config.dbhost, config.dbport, {auto_reconnect: true});
db = new Db(config.dbname, server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'wodrsdb' database");
    }
});

exports.db = db;
exports.bson = BSON;

