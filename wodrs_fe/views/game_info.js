
<div class='panel_header'>
    <% if(game.state=='running' && game.score1==-1) { %>
      <a class='button right' href='start_game/<%=game.gamesId%>'>PLAY!</a>
    <% } %>
    <a class='button left' href='show_game_list'>Back</a>
</div>


<div class='panel_content'>
  <div class='box box_big center'>
    <h3>
     <%if(game.score1==-1){%>Your turn!<%}
       else if(game.score2==-1) {%>Opponent turn!<%}
       else if(game.score1>game.score2) {%>You won!<%} 
       else if(game.score2>game.score1) {%>You lose!<%} 
       else {%>Draw!<%}%> 
    </h3>
    <div>

       <span class='avatar right'>
         <div class='player_name'>
           <%=game.player2%>
         </div>
         <div class='player_avatar'>
           <img src='<%=game.player2_img%>'>
         </div>
       </span>

       <span class='avatar left'>
         <div class='player_name'>
           <%=game.player1%>
         </div>
         <div class='player_avatar'>
           <img src='<%=game.player1_img%>'>
         </div>
       </span>

       <span class='game_score'>
         <%if( game.score2 == -1 ) { %>
           <span>X</span>
         <% } else { %>
           <span><%=game.score2%></span>
         <% } %>
          -
         <%if( game.score1 == -1 ) { %>
           <span>X</span>
         <% } else { %>
           <span><%=game.score1%></span>
         <% } %>
     </span>
    </div>
  </div>
</div>

