var mongo = require('./db'),
    config = require('./config');

exports.login = function(req, res) {
    username = req.query.username;
    password = req.query.password;
    mongo.db.collection(config.users_table, function(err, collection) {
      collection.findOne({ 'username': username }, function (err, user) {
        if (err) { 
          res.send({error: true, data: "Error"});
          return; 
        }
        if (!user) {
          res.send({error: true, data: "Incorrect username"});
          return;
        }
        else if(user.password != password) {
          res.send({error: true, data: "Incorrect password"});
        }
        else
        {
          res.send({error: false, data: {'token' : req.sessionID}});
        }
      });
   });
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

exports.register = function(req, res) {
  console.log(req.query);
  user = { username: req.query.username,
           password: req.query.password,
           token: req.sessionID };

  
  console.log("Registering: " + user.username);
  mongo.db.collection(config.users_table, function(err, collection) {
      collection.findOne({'username':user.username}, function(err, item) {
         if(!item)
         {
           mongo.db.collection(config.users_table, function(err, collection) {
                 collection.insert(user, {safe:true}, function(err, result) {
                     if (err) {
                       res.send({'error': true, 'data': 'Error'});
                     } else {
                       console.log('Success: ' + JSON.stringify(result[0]));
                       res.send({'error': false, 'data': {token: req.sessionID}});
                     }
                 });
           });
         }
         else
         {
           res.send({'error': true, 'data': 'Username already taken.'});
         }

      });
  });
}

exports.findOne = function(params, callback) {
    console.log('Retrieving user: ' + params['username']);
    mongo.db.collection(config.users_table, function(err, collection) {
        collection.findOne(params, function(err, item) {
            callback(item);
        });
    });
};

exports.findAll = function(callback) {
    db.collection(config.users_table, function(err, collection) {
        collection.find().toArray(function(err, items) {
            callback(items);
        });
    });
};

exports.addUser = function(user, callback) {
    console.log('Adding user: ' + JSON.stringify(user));
    db.collection(config.users_table, function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                callback(result[0]);
            }
        });
    });
}
 
exports.updateUser = function(id, user, callback) {
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection(config.users_table, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
            } else {
                console.log('' + result + ' document(s) updated');
                callback(user);
            }
        });
    });
}
 
exports.deleteUser = function(id) {
    console.log('Deleting user: ' + id);
    db.collection(config.users_table, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                console.log({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
            }
        });
    });
}
