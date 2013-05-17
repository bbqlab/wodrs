App.prototype.load_settings = function() 
{
  // first parameter is default value, if second parameter is true
  // is encoded in JSON
  //console.log("LOAD SETTINGS");
  var default_settings = { 
                            backend: ['http://be.wodrs.com/wodrs/',false],
                            username: ['',false],
                            password: ['',false],
                            token:['', false],
                            game_time: [60,false],
                            app_name: ['Wodrs',false],
                            current_version: [0,false],
                            user: [null,true],
                         };

  $.each(default_settings,
    function(idx,value)
    {
      var tmp_value = localStorage.getItem(idx);
      if( tmp_value != null && tmp_value != undefined )
      {
        // settings is JSON encoded ?
        if( value[1] )
          app[idx]=JSON.parse(tmp_value);
        else
          app[idx]=tmp_value;
      }
      else
      {
        app[idx]=value[0];
      }
    }); 
 
};


