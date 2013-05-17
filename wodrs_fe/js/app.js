function App()
{
  this.state = 0;          // using this to know if i'm ready to start application
  this.online = false;

  this.views = ['game_row','results'];

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
    if(app.state==2)
    {
      app.setup();
      app.main();
    }
  }

  App.prototype.setup = function()
  {
    console.log("STARTING");
    this.load_views();

    if(typeof AppMobi.device!='undefined')
    {
      AppMobi.device.setRotateOrientation('portrait');
      AppMobi.device.setAutoRotate(false);
      AppMobi.device.managePower(false,false);
      AppMobi.device.hideSplashScreen();
    }
    $.ui.transitionTime = '4';
    $.ui.customClickHandler = this.clickHandler;
    $.ui.showBackbutton=false
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
        return false;
      }
    }
    catch(e){
      app.log("ERROR IN CLICKHANDLER " + e);
      //console.trace();
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
  console.log("Main token:" + app.token);

  $('#running_games').delegate('.game_playable', 'click', function(ev) {
    console.log($(this).attr('id'));
    $.ui.loadContent('#results');
  });

//  app.start_game();
//  return;
  if(app.username != '')
  {
    app.login(true, function() {
      console.log('try login');
      app.online = true;
      if(!app.is_logged())
      {
        console.log('not logged');
        $.ui.loadContent('#login', false, false);
      }
      else
      {
        console.log('show list');
        app.show_game_list();
      }
    });
  }
};

app.show_game_list = function() {
  console.log('show games');
  $.getJSON(app.backend + 'list_games', {token: app.token}, function(res) {
    app.fill_game_list(res.data.games);
  });
};

app.fill_game_list = function(games) {
  var html = '';
  $('#game_details').html(html);
  console.log(games);
  $.each(games.running, function(index, game) {
    console.log(game);
    html = $.template('game_row', {game: game});
    $('#running_games').append(html);
  });

  $.each(games.completed, function(index, game) {
    html = $.template('games_row', {game: game});
    $('#running_games').append(html);
  });

  if(games.pending && games.pending.length > 0)
  {
    $('#searching_player').show();
  }

  $.ui.loadContent('#game_list', false, false);
};

app.request_player = function() {
  if(!app.random_game) 
  {
    $.getJSON(app.backend + 'request_player', {token: app.token}, function(res) {
      app.game_check_interval = setTimeout(app.check_games,1000);
    });
  }
};

app.check_games = function() {
  $.getJSON(app.backend +'list_games', {token:app.token}, function(res) {
    console.log(res);
    if(res.data.games.running.length > 0)
    {
      clearInterval(app.game_check_interval);
      app.fill_game_list(res.data.games);
    }
    else
    {
      app.game_check_interval = setTimeout(app.check_games,1000);
    }
  });
};

app.start_game = function() {
 // $.getJSON(app.backend + 'start_game', {token: app.token, type: 'alone'}, function(res) { 
    console.log("Start Game!"); 
    window.scrollTo(0,1);
    $.ui.loadContent('#game_play',false,false);
    app.current_game = new WodrsGame();//res.data.id);
    app.current_game.start();
 // });
};

app.stop_game = function() {
  console.log("Dentro stopgame");
  //$.getJSON(app.backend + 'stop_game', {token: app.token, 
  //                                      id: app.current_game.id,
  //                                      score: app.current_game.score}, function(res) { 
    app.current_game.stop();
 // });
}

app.show_register = function() {
  $.ui.loadContent('#register',false,false);
};

app.register = function() {
  username = $('#reg_username').val();
  password = $('#reg_password').val();
  console.log("Registering " + username +"/"+ password);
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
                $.ui.loadContent('#game_list', false, false);
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
    console.log('storage login');
  }
  else
  {
    console.log('normal login');
    username = $('#login_username').val();
    password = $('#login_password').val();
  }
  console.log("Login of " + username +"/"+ password);
  console.log(app.backend + 'login');
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
                  $.ui.loadContent('#game_list', false, false);
                }
              }
    });
};

app.logout = function() {
  app.random_game = false;
  localStorage.setItem('token', '')
  localStorage.setItem('username', '')
  localStorage.setItem('passsword', '')
  $.ui.loadContent('#login', false, false);
};

