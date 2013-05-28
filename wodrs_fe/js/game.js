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
  this.audio_ok = [];
  this.audio_ok.push(new Audio('audio/ok1.wav'));
  this.audio_ok.push(new Audio('audio/ok2.wav'));
  this.audio_ok.push(new Audio('audio/ok3.wav'));
  this.typing = $('#typing');
  this.faders = { 'correct': $('#correct_letters')[0], 'wrong': $('#wrong_letters')[0] };

  for(i in this.audio_ok)
  {
    this.audio_ok[i].load();
  }
  this.audio_error = new Audio('audio/error.wav');
  this.audio_error.load();
  this.audio_panic = new Audio('audio/panic.wav');
  this.audio_panic.load();

  this.audio_gong = new Audio('audio/gong.wav');
  this.audio_gong.load();
}

WodrsGame.prototype.start = function() {
  app.log("Dentro start del game!");
  this.word_list = new WordList();
  this.populate_list();
  this.bind_events();
  window.scrollTo(0,0);

  this.game_interval = window.setInterval( this.timer_tick, 1000 );

  window.scrollTo(0,0);
  this.words_slider.addClass('animate');
  app.focus_keyboard();

};


WodrsGame.prototype.timer_tick = function() {
  var game = app.current_game;
  var game_time = --game.game_time;

  if(game_time==0)
  {
    game.audio_gong.play();
    app.stop_game(); return; 
  };

  if(game_time<10)
  {
    if(game_time%2)
      $('.game_timer').removeClass('bounce');
    else
      $('.game_timer').addClass('bounce');
  }

  if(game_time==10)
  {
    game.audio_panic.play();
  }

  $('.game_timer').html('0:'+game_time);
};

WodrsGame.prototype.stop = function() {
    window.clearInterval(this.game_interval);
    $('#words_slider').removeClass('animate');//[0].style.webkitAnimationDuration='7s';


    app.send_results(this.id,this.score);

    var precision = (100*this.n_key_matched/this.n_key_pressed).toFixed(2);
    this.unbind_events();

    $.ui.loadContent('#results', false, false );
    app.set_game_score(this.id,this.score);
    $('#results_score').html('Score: ' + this.score );
    $('#results_precision').html('Precision: ' + precision + '%' );
    $('#results_n_key_pressed').html('Pressed keys: ' + this.n_key_pressed );
    $('#results_n_key_matched').html('Matched keys: ' + this.n_key_matched );

    setTimeout( "$('#typing')[0].blur();", 40);

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
    var letter = String.fromCharCode(key);
    app.current_game.add_letter(letter);
    app.current_game.check_word(letter);
  }


  if( key == 13 )
  {
    app.current_game.clear_current_word();
  }

};

WodrsGame.prototype.check_word = function(letter) {
  var word = this.current_word.join('');
  var id = this.word_list.check_word(word);
  var new_word;
  var audio_ok;

  this.n_key_pressed++;

  // the word matched !! 
  if( id>=0 )
  {
    this.word_hit(word);
    new_word = this.word_list.get_word(id);
    $('#word_'+id).html(new_word);
    audio_ok = this.random_ok();
    audio_ok.play();
    this.clear_current_word();
  }
  else if(id==-1) // right letter on uncompleted word
  {
    this.add_letter_fader(letter, 'correct');
  }
  else if(id==-2) // wrong letter
  {
    this.add_letter_fader(letter, 'wrong');
    this.audio_error.play();
    this.clear_current_word();
  }

  $('.game_score').html(this.score);
};

WodrsGame.prototype.add_letter_fader = function(letter, fader) {
  var span = document.createElement('span');
  span.innerHTML=letter;

  this.faders[fader].appendChild(span);

  setTimeout( function() {span.className='fade_out'; }, 50);
  setTimeout(function() {span.remove() }, 2000);
};

WodrsGame.prototype.random_ok = function() {
  var rand =  Math.floor(Math.random() * 3);
  return this.audio_ok[rand];
}

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
};

WodrsGame.prototype.unbind_events = function() {
  $('#typing').off('keydown', this.key_down);
};

/* 
WodrsGame.prototype.accelerate_slider = function() {
    if(app.current_game.game_time>1) 
    {
      this.style.webkitAnimationPlayState = "paused";
      this.style.webkitAnimationDuration = ((app.current_game.game_time/10)+1).toFixed(2) + 's';

      this.style.webkitAnimationPlayState = "running";
    }
    else{
      this.style.webkitAnimationPlayState = "paused";
      this.style.webkitAnimationDuration = '7s';
      this.style.webkitAnimationPlayState = "running";
    }

};*/


WodrsGame.prototype.populate_list = function() {
  
  this.word_list.each( function(id,word){ 
    $('#word_'+id).html(word);
  });

};
