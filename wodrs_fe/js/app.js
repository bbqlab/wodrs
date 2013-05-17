function App()
{
  this.state = 0;          // using this to know if i'm ready to start application

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

  app.start_game();
  return;

  if(!app.is_logged())
  {
    $.ui.loadContent('#login', false, false, 'fade');
  }
  else
  {
    app.show_game_list();
  }
};

app.show_game_list = function() {
  console.log
  $.getJSON(app.backend + 'list_games', {token: app.token}, function(res) {
    $('#game_details').html('');
    $.each(res.games, function(index, game) {
      $('#game_details').append("<li>" + game.type + ": " + game.state + " SCORE: " + game.score + "</li>");
    });
    $.ui.loadContent('#game_list', false, false, 'fade');
  });
};

app.start_game = function() {
//  $.getJSON(app.backend + 'start_game', {token: app.token, type: 'alone'}, function(res) { 
    console.log("Start Game!"); 
    $.ui.loadContent('#game_play',false,false,'fade');
    app.current_game = new WodrsGame();//res.data.id);
    app.current_game.start();
//  });
};

app.stop_game = function() {
  $.getJSON(app.backend + 'stop_game', {token: app.token, 
                                        id: app.current_game.id,
                                        score: app.current_game.score}, function(res) { 
    app.current_game.stop();
  });
}

app.show_register = function() {
  $.ui.loadContent('#register',false,false,'fade');
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
                localStorage.setItem('token', JSON.stringify(app.token))
                $.ui.loadContent('#game_list', false, false, 'fade');
              }
    });
};

app.is_logged = function() {
  return app.token != '';
};

app.login = function() {
  username = $('#login_username').val();
  password = $('#login_password').val();
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
                $.ui.loadContent('#game_list', false, false, 'fade');
              }
    });
};

app.logout = function() {
  localStorage.setItem('token', '')
  $.ui.loadContent('#login', false, false, 'fade');
};

