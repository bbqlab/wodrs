
<h3 class='center'><%=game.player1.username%> VS <%=game.player2.username%></h3>
<h3 class='center'><%=game.score1%> - <%=game.score2%></h3>

<div class='center'>
  <a class='button' href='game_list'>Back</a>
  <% if(game.state=='running') { %>
    <a class='button' href='start_game/<%=game.gamesId%>'>PLAY!</a>
  <% } %>
</div>
