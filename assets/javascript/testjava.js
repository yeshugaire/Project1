// get access token from url
var hash = window.location.hash.substr(14);
var parsedHash = hash.split("&");
accessToken = parsedHash[0];
console.log(accessToken);


// make ajax call to get user playlist
$.ajax({
    url: "https://api.spotify.com/v1/me/playlists",
    headers: {
        "Authorization": "Bearer " + accessToken
    },
    success: function (response) {
        console.log(response);

        // make table for user playlists
        var userPlaylistDiv = $("<div>");
        userPlaylistDiv.append("<table class='table'> <thead><tr><th scope='col'>Playlist Name</th><th scope='col'>Tracks</th><th scope='col'>Owner</th></tr></thead><tbody id= 'user-playlist-table'></tbody>");

        // display playlists in table
        for (var i = 0; i < response.items.length; i++) {
            var data = response.items[i]
            var userPlaylistTableRow = $("<tr id='playlist' data-playlist-id= '" + data.id + "'>");
            userPlaylistTableRow.append("<td>" + data.name + "</td><td>" + data.tracks.total + "</td><td>" + data.owner.display_name + "</td>");
            $("#user-playlist-table").append(userPlaylistTableRow);
            console.log(data.name);

        };
        $(".container").append(userPlaylistDiv);
    },
});

//when you choose a playlist
$("#playlist").on("click", function () {
    // get playlist id
    var currentPlaylistID = $(this).attr("data-playlist-id");

    // make ajax call for playlists tracks
    $.ajax({
        url: "https://api.spotify.com/v1/playlists/" + currentPlaylistID + "/tracks",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        success: function (response) {
            console.log(response);


        },
    });
});