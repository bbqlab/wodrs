var express = require('express'),
    wodrs = require('./app/wodrs'),
    users = require('./app/users'),
    games = require('./app/games'),
    config = require('./app/config');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

var app = express();
app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'tarapiatapiococomefosseantani' }));
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(app.router);
});

app.get('/login', users.login);
app.get('/logout', users.logout);
app.get('/register', users.register);

app.listen(config.port);

// PRIVATE

app.get('/games', function(req, res) {
    res.send([{name:'wine1'}, {name:'wine2'}]);
});

app.get('/start_game', games.start_game);
app.get('/stop_game', games.stop_game);
app.get('/list_games', games.list_games);

console.log('Listening on port ' + config.port);
