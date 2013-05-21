<div class='panel_header'>
  <a href='request_player' id='request_player_button' class='button right'>
      <span class='active'>New game</a>
      <span class='requesting_player'>Requesting player</span></a>
  <a href='start_game/-1' class='button left'>Training</a>
  <div class='panel_header'></div>
</div>
<div class='panel_content'>
  <% 
  if(games.running.length > 0) { %>
      <div class='box'>
        <h3>Your turn</h3>
        <ul id='running_games'>
        </ul>
      </div>
  <% 
    console.log('qui');
      $.each(games.running, function(index, game) {
        html = $.template('view_game_row', {game: game});
        $('#running_games').append(html);
      });
    }
  
    console.log('qu2i');
    if(games.running_opponent.length > 0) { %>
      <div class='box'>
        <h3>Opponent turn</h3>
        <ul id='opponent_games'>
        </ul>
      </div>
  <%

      $.each(games.running_opponent, function(index, game) {
        html = $.template('view_game_row', {game: game});
        $('#opponent_games').append(html);
      });
    }


  %>
   kdjaklsjdkl
   <%  


   if(games.topten.length > 0) { %>
      <div class="box">
        <h3>Top ten</h3>
        <ul id='topten'>
        </ul>
      </div>
  <% 
      $.each(games.topten, function(index, score) {
        html = $.template('view_topten_row', {game: score});
        $('#topten').append(html);
      });
    }
   if(games.completed.length > 0) { %>
      <div class="box">
        <h3>Completed</h3>
        <ul id='completed_games'>
        </ul>
      </div>
  <% 
      $.each(games.completed, function(index, game) {
        html = $.template('view_game_row', {game: game});
        $('#completed_games').append(html);
      });
    }
  %>
</div>
