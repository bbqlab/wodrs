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
  console.log("Main");
  app.load_settings();
  app.start_game();
};

app.start_game = function() {
  console.log("Start Game!"); 
  $.ui.loadContent('#game_play',false,false,'fade');
  app.current_game = new WodrsGame();
  app.current_game.start();
  window.scrollTo(0,1);
};

