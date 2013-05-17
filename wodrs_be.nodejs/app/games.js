var mongo = require('./db'),
    config = require('./config');


exports.start_game = function(req, res) {

  var game = { type: req.query.type,
               state: 'running',
               score: 0,
               player1: req.query.token };
  
  console.log("saving " + game.player1);
  console.log(config.games_table);
  mongo.db.collection(config.games_table, function(err, collection) {
     collection.insert(game, {safe:true}, function(err, result) {
         if (err) {
           res.send({'error': true, 'data': 'Error'});
         } else {
           console.log('Success: ' + JSON.stringify(result));
           res.send({'error': false, 'data': {id: result[0]['_id']}});
         }
     });
  });
};

exports.stop_game = function(req, res) {
  mongo.db.collection(config.games_table, function(err, collection) {
      collection.findOne({'_id': new mongo.bson.ObjectID(req.query.id)}, function(err, game) {
        game.state = 'completed';
        game.score = req.query.score;

        mongo.db.collection(config.games_table, function(err, collection) {
           collection.update({'_id': new mongo.bson.ObjectID(req.query.id)}, game,{safe:true}, function(err, result) {
               if (err) {
                 res.send({'error': true, 'data': 'Error'});
               } else {
                 console.log('game stopped: ' + JSON.stringify(result));
                 res.send({'error': false, 'data': {id: req.query.id}});
               }
           });
        });
      });
  });
};

exports.list_games = function(req, res) {
  mongo.db.collection(config.games_table, function(err, collection) {
      collection.find().toArray(function(err, items) {
          res.send({'games': items});
      });
  });
};
