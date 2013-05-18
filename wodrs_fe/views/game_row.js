<% 
  if(game.state=='completed') { 
    if(parseInt(game.score1)>parseInt(game.score2)){ %>
      <li class='game_<%=game.state%> game_won' game_id='<%=game.gamesId%>'>
    <% } else { %>
      <li class='game_<%=game.state%> game_lost' game_id='<%=game.gamesId%>'>
<% } } else {  %>
      <li class='game_<%=game.state%>' game_id='<%=game.gamesId%>'>
<% } %>

<a href='show_game_info/<%=game.gamesId%>'>
 <%if( game.score2 == -1 ) { %>
   <span class='right'>X</span>
 <% } else { %>
   <span class='right'><%=game.score2%></span>
 <% } %>

 <%if( game.score1 == -1 ) { %>
   <span class='left'>X</span>
 <% } else { %>
   <span class='left'><%=game.score1%></span>
 <% } %>

 <span class='center'><%=game.player1%> VS <%=game.player2%></span>
 </a>
</li>
