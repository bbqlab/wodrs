
<div class='panel_header'>
</div>

<div class='panel_content'>
  <h3 class='score center'><%=game.player1%> VS <%=game.player2%></h3>

  <h3 class='score center'>
    <%if (game.score1==-1){%>X<%}else{%><%=game.score1%><%}%> - 
    <%if (game.score2==-1){%>X<%}else{%><%=game.score2%><%}%>
  </h3>
</div>
  <div class='panel_footer'>
    <a class='button' href='game_list'>Back</a>
    <% if(game.state=='running' && game.score1==-1) { %>
      <a class='button' href='start_game/<%=game.gamesId%>'>PLAY!</a>
    <% } %>
  </div>

