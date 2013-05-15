var express = require('express'),
    wodrs = require('./app/wodrs'),
    users = require('./app/users'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
    config = require('./app/config');

passport.use(new LocalStrategy(users.login));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var app = express();

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.get('/', function(req, res) { res.send({'msg': 'index'})});
 
app.get('/games', ensureLoggedIn('/'), function(req, res) {
    res.send([{name:'wine1'}, {name:'wine2'}]);
});

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.send({'msg': 'Auth successful ' + req.user.username});
  });

app.get('/logout', user.logout);
app.get('/login', function(req, res) { res.send({error:'not auth'})});
app.post('/register', users.register);

app.listen(config.port);

console.log('Listening on port 3000...');
