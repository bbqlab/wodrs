var mongo = require('./db'),
    config = require('./config');

exports.login = function(username, password, done) {
    console.log('auth: ' + username);
    mongo.db.collection(config.users_table, function(err, collection) {
      collection.findOne({ 'username': username }, function (err, user) {
        console.log(JSON.stringify(user));
        if (err) { return done(err); }
        console.log('noerr');
        console.log(JSON.stringify(user));
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        console.log('testing ' + user.password +' == ' + password);
        if (user.password != password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
   });
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
});

exports.register = function(req, res) {
  user = req.body;
  console.log("Registering: " + user.username);
  mongo.db.collection(config.users_table, function(err, collection) {
      collection.findOne({'username':user.username}, function(err, item) {
         if(!item)
         {
           mongo.db.collection(config.users_table, function(err, collection) {
                 collection.insert(user, {safe:true}, function(err, result) {
                     if (err) {
                       res.send({'error':'An error has occurred'});
                     } else {
                       console.log('Success: ' + JSON.stringify(result[0]));
                       res.send('Success: ' + JSON.stringify(result[0]));
                     }
                 });
           });
         }
         else
         {
           res.send({'error':'Item exists'});
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
