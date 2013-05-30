<div class='panel_header'></div>
<div class='panel_content'>
    <% if (settings.image != null) {
        var img = "<img" + " src='" + settings.image +"' />";
        %>
    <div class='thumbnail'>
        <%=img%>
    </div>
    <% } else { %>
    <input type='file' class='jq-ui-forms' />
    <% } %>
    <input class='jq-ui-forms' id='username' read-only value='<%=settings.username%>' />
    <input class='jq-ui-forms' id='save_profile' type='button' value='Save' />
</div>
