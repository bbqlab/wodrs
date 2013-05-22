function App()
{
  this.state = 0;          // using this to know if i'm ready to start application
  this.online = false;

  this.views = ['game_row','results','game_info','games_list','topten_row'];

  App.prototype.load_views = function() {
    $.each(this.views, function(index, view) {
      $.get('views/' + view + '.js', function(data) {
        $('body').append('<script id="view_' + view + '" type="text/html">' + data + '</script>');
      });
    });
  }

  App.prototype.try_to_start = function()
  {
    app.state++;
    if(app.state==3)
    {
      app.setup();
      app.main();
    }
  }

  App.prototype.setup = function()
  {
    this.load_views();

    if(typeof AppMobi.device!='undefined')
    {
      AppMobi.device.setRotateOrientation('landscape');
      AppMobi.device.setAutoRotate(false);
      AppMobi.device.managePower(false,false);
      AppMobi.device.hideSplashScreen();
    }
    $.ui.transitionTime = '4';
    $.ui.customClickHandler = this.clickHandler;
    $.ui.showBackbutton=false

    this.fill_background();

  }

  // clickhandler: each touch on active object pass here
  // TODO: check if reaction on back button touch
  App.prototype.clickHandler = function(target)
  {
    if($(target).hasClass('button_disabled')) return true;

    app.target = target;
    url = $(target).attr('href');
    args = url.split('/');
    controller = args[0];
    
    try
    {
      if( typeof app[controller] == 'function' )
      {
        if(args.length==1)
          app[controller]();
        else if(args.length==2)
          app[controller](args[1]);
        else if(args.length==3)
          app[controller](args[1],args[2]);
        else if(args.length==4)
          app[controller](args[1],args[2],args[3]);
      }
      else if( controller != '' ){
        $.ui.loadContent('#'+controller,true,false);
        return true;
      }
    }
    catch(e){
      app.log("ERROR IN CLICKHANDLER " + e);
      return false;
    }
    //returning true prevent default jq.ui event to be handled
    return true;
  }

}

var app = new App();

document.addEventListener("DOMContentLoaded",app.try_to_start,false);
document.addEventListener("jq.ui.ready",app.try_to_start,false);
document.addEventListener("appMobi.device.ready",app.try_to_start,false);
document.addEventListener("appMobi.device.update.available",onUpdateAvailable,false); 

function onUpdateAvailable(evt) 
{
  if (evt.type == "appMobi.device.update.available") 
    if (confirm(evt.updateMessage)==true) 
      AppMobi.device.installUpdate()
}

app.main = function(){
  app.load_settings();

  if(app.username != '')
  {
    app.login(true, function() {
      app.online = true;
      if(!app.is_logged())
      {
        $.ui.loadContent('#login', false, false);
      }
      else
      {
        app.show_game_list();
      }
    });
  }
};

app.show_game_list = function() {
  $.getJSON(app.backend + 'list_games', {token: app.token}, function(res) {
    app.fill_game_list(res.data.games);
  });
};

app.fill_game_list = function(games) {
  var html = '';
  app.game_list=games;
  $('#game_list').html($.template('view_games_list',{ games: app.game_list }));
  $.ui.loadContent('#game_list', false, false);
};

app.set_game_score = function(id,score){
  $.each(app.game_list.running, function(index, game) {
    if( game.gamesId == id ){
      app.game_list.running[index].score1 = score;
      return false;
    }
  });

}

app.get_game = function(id){
  var game_found = null;

  $.each(app.game_list.running, function(index, game) {
    if( game.gamesId == id ){
      game_found = game;
      return false;
    }
  });


  if(! game_found )
  {
    $.each(app.game_list.running_opponent, function(index, game) {
      if( game.gamesId == id ){
        game_found = game;
        return false;
      }
    });
  } 


  if(! game_found )
  {
    $.each(app.game_list.completed, function(index, game) {
      if( game.gamesId == id ){
        game_found = game;
        return false;
      }
    });
  } 

  return game_found;
};

app.request_player = function() {
  $('#request_player_button').addClass('spin').html('Waiting..').addClass('button_disabled');
  $.getJSON(app.backend + 'request_player', {token: app.token}, function(res) {
    app.game_check_interval = setTimeout(app.check_games,1000);
  });
};

app.check_games = function() {
  $.getJSON(app.backend +'list_games', {token:app.token}, function(res) {
    if(res.data.games.running.length > 0)
    {
      $('#request_player_button').removeClass('spin').html('New game').removeClass('button_disabled');
      clearInterval(app.game_check_interval);
      app.fill_game_list(res.data.games);
    }
    else
    {
      app.game_check_interval = setTimeout(app.check_games,1000);
    }
  });
};

app.start_game = function(game_id) {
  window.scrollTo(0,1);
  $('#wodrs_title').addClass('title_out');
  $.ui.loadContent('#game_play',false,false);
    
  app.current_game = new WodrsGame(game_id);
  app.current_game.start();
};

app.stop_game = function() {
  $('#wodrs_title').removeClass('title_out');
  app.current_game.stop();
}

app.show_register = function() {
  $.ui.loadContent('#register',false,false);
};

app.register = function() {
  username = $('#reg_username').val();
  password = $('#reg_password').val();
  $.getJSON(app.backend + 'register', {username: username, password: password },
            function(data) {
              if(data.error)
              {
                $('body').popup({title: "Error", message: data.data });
              }
              else
              {
                app.token = data.data.token;
                localStorage.setItem('token', JSON.stringify(app.token));
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                app.show_game_list();
                window.scrollTo(0,1);
              }
    });
};

app.is_logged = function() {
  return app.token != '';
};

app.login = function(storage, callback) {
  if(storage)
  {
    username = app.username;
    password = app.password;
  }
  else
  {
    username = $('#login_username').val();
    password = $('#login_password').val();
  }
  $.getJSON(app.backend + 'login', {username: username, password: password },
            function(data) {
              if(data.error)
              {
                $('body').popup({title: "Error", message: data.data });
              }
              else
              {
                app.token = data.data.token;
                localStorage.setItem('token', app.token)
                localStorage.setItem('username', username)
                localStorage.setItem('password', password)
                if(callback)
                { 
                  callback();
                }
                else
                {

                  app.show_game_list();
                  //$.ui.loadContent('#game_list', false, false);
                }
              }
    });
};

app.logout = function() {
  localStorage.setItem('token', '')
  localStorage.setItem('username', '')
  localStorage.setItem('password', '')
  $.ui.loadContent('#login', false, false);
};

app.send_results = function(game_id,score){
  $.getJSON( app.backend + 'send_results', 
            { game_id: game_id, score: score, token: app.token }, 
            function(res){

            });
};


app.show_game_info = function(game_id){
  if(typeof game_id=='undefined')
    game_id=app.current_game.id;

  // training mode 
  if(game_id==-1)
  {
    $.ui.loadContent('#game_list');
    return;
  }

  var game = app.get_game(game_id);
  $('#game_info').html($.template('view_game_info',{ game: game }));
  $.ui.loadContent('#game_info');
};


app.animate_logo = function(ev) {
};

app.fill_background = function() {
  $('#background').height($('body').height());

  html = '';
  for(i = 0; i < 140; i++)
  {
    html += randomString(10);
  }

  $('#background').html(html);

};

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}


app.focus_keyboard = function(){
  app.current_game.typing[0].blur();
  app.current_game.typing[0].click();
  app.current_game.typing[0].focus();
};
