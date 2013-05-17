function WodrsGame(id){
  this.id = id;
  this.words = [];
  this.current_word = [];
  this.game_time = 60;//app['game_time'];
  this.rules = { letter_weight: 10 };
  this.score = 0;
  this.words_slider = $('#words_slider');
  this.n_key_pressed=0;
  this.n_key_matched=0;
  this.audio_time = new Audio('drop.wav');
  /*this.audio_key = new Audio('key.wav');*/
}

WodrsGame.prototype.start = function() {
  this.word_list = new WordList();
  this.populate_list();
  this.bind_events();
  window.scrollTo(0,1);

  this.game_interval = window.setInterval( this.timer_tick, 1000 );
  setTimeout( "$('#typing')[0].focus();", 10);

  this.words_slider.addClass('animate');
};


WodrsGame.prototype.timer_tick = function() {
  var game = app.current_game;
  var game_time = --game.game_time;

  if(game_time==0){  app.stop_game(); return; };

  if(game_time<10)
  {
    //game.audio_time.play();
    if(game_time%2)
      $('.game_timer').removeClass('bounce');
    else
      $('.game_timer').addClass('bounce');
  }

  $('.game_timer').html('0:'+game_time);

  
};

WodrsGame.prototype.stop = function() {
    window.clearInterval(this.game_interval);
    $('#words_slider').removeClass('animate');
    //new Audio('stop.wav').play();
    
    var precision = (100*this.n_key_matched/this.n_key_pressed).toPrecision(2);

    $.ui.loadContent('#results', false, false );
    $('#results_score').html('Score: ' + this.score );
    $('#results_precision').html('Precision: ' + precision + '%' );
    $('#results_n_key_pressed').html('Pressed keys: ' + this.n_key_pressed );
    $('#results_n_key_matched').html('Matched keys: ' + this.n_key_matched );

    setTimeout( "$('#typing')[0].blur();", 10);
    function set_results()
    {
      var game = app.current_game;
      var precision = (100*game.n_key_matched/game.n_key_pressed);
      var stats_n_key_pressed = (100*game.n_key_pressed/600);
      var stats_n_key_matched = (100*game.n_key_matched/360);
      $('#stats_precision').css('width',precision + '%');
      $('#stats_n_key_pressed').css('width',stats_n_key_pressed + '%');
      $('#stats_n_key_matched').css('width',stats_n_key_matched + '%');

    }

    setTimeout(set_results,500);//$('#stats_precision').css('width','"+ precision + "%');",500);

};

WodrsGame.prototype.key_down = function(evt) {
  var key = evt.which;


  // check if keycode è un ascii lettera US no numeri, caratteri speciali
  if( key >= 65 &&  key <= 90 )
  {
    app.current_game.add_letter(String.fromCharCode(key));
    app.current_game.check_word();
  }


  if( key == 13 )
  {
    app.current_game.clear_current_word();
  }

};

WodrsGame.prototype.check_word = function() {
  var word = this.current_word.join('');
  var id = this.word_list.check_word(word);
  var new_word;

  this.n_key_pressed++;

  // the word matched !! 
  if( id>=0 )
  {
    this.word_hit(word);
    new_word = this.word_list.get_word(id);
    $('#word_'+id).html(new_word);
    this.clear_current_word();
  }
  else if(id==-2)
  {
    //this.audio_time.play();
    this.clear_current_word();
  }

  $('.game_score').html(this.n_key_pressed + '/' + this.n_key_matched + ' (' + this.score + ')');

};

WodrsGame.prototype.word_hit = function(word) {
  this.score += word.length*this.rules.letter_weight;
  this.n_key_matched+=word.length;
  $('.game_score').html(this.score);
};

WodrsGame.prototype.clear_current_word = function() {
  this.current_word = [];
  this.refresh_word();
};

WodrsGame.prototype.add_letter = function(letter) {
  this.current_word.push(letter);
  this.refresh_word();
};

WodrsGame.prototype.refresh_word = function() {
  $('.word_typer').html(this.current_word.join(''));
};

WodrsGame.prototype.bind_events = function() {
  $('#typing').on('keydown',this.key_down );
  this.words_slider.on('webkitAnimationEnd',function(){ 

    this.style.webkitAnimationDuration = app.current_game.game_time/6+1 + 's';
    this.style.webkitAnimationPlayState = "paused";
    this.style.webkitAnimationPlayState = "running";

  });

};

WodrsGame.prototype.populate_list = function() {
  
  this.word_list.each( function(id,word){ 
    $('#word_'+id).html(word);
  });

};
