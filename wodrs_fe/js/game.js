function WodrsGame(id){
  this.id = id;
  this.words = [];
  this.current_word = [];
  this.game_time = 60;//app['game_time'];
  this.rules = { letter_weight: 10 };
  this.score = 0;
  this.words_slider = $('#words_slider');
}

WodrsGame.prototype.start = function() {
  this.word_list = new WordList();
  this.populate_list();
  this.bind_events();
  this.game_interval = window.setInterval( this.timer_tick, 1000 );
  $('#typing')[0].focus();
  this.words_slider.addClass('animate');
};


WodrsGame.prototype.timer_tick = function() {
  var game = app.current_game;
  var game_time = --game.game_time;

  //if(game_time==0) game.stop();

  $('.game_timer').html('0:'+game_time);

  // speed up animation
  //this.words_slider[0].style

  
};

WodrsGame.prototype.stop = function() {
    window.clearInterval(this.game_interval);
    $('#words_slider').removeClass('animate');
    $('#results_content').html("<h1>You did " + this.score + ' points!</h1>');
    $.ui.loadContent('#results', false, false, 'fade');
};

WodrsGame.prototype.key_down = function(evt) {
  var key = evt.which;

  // check if keycode è un ascii lettera US no numeri, caratteri speciali
  if( key >= 65 &&  key <= 90 )
  {
    app.current_game.add_letter(String.fromCharCode(key));
  }

  if( key == 13 )
  {
    app.current_game.check_word();
  }

};

WodrsGame.prototype.check_word = function() {
  var word = this.current_word.join('');
  var id = this.word_list.check_word(word);
  var new_word;

  if( id>0 )
  {
    this.word_hit(word);
    new_word = this.word_list.get_word(id);
    $('#word_'+id).html(new_word);
  }
  else
  {
    console.log("PERSO!");
  }

  this.clear_current_word();

};

WodrsGame.prototype.word_hit = function(word) {
  this.score += word.length*this.rules.letter_weight;
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
};

WodrsGame.prototype.populate_list = function() {
  
  this.word_list.each( function(id,word){ 
    $('#word_'+id).html(word);
  });

};
