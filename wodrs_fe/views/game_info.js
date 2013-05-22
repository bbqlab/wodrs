
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
      <%=game.player1%> VS <%=game.player2%><br>
      <%if (game.score1==-1){%>X<%}else{%><%=game.score1%><%}%> - 
      <%if (game.score2==-1){%>X<%}else{%><%=game.score2%><%}%>
    </div>
  </div>
</div>

