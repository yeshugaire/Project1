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
    success:  function(response) {
        console.log(response);


        
        // display playlists in table
        for (var i=0; i<response.items.length; i++) {
            var data= response.items[i]
            $("#user-playlist-table").append("<tr id='playlist' data-playlist-id= '"+ data.id + "'><td>"+ data.name +"</td><td>"+ data.tracks.total + "</td><td>"+ data.owner.display_name +"</td></tr>");
            console.log(data.name);
        };
        
    },
});

// //when you choose a playlist 
// $("#playlist").on("click", function() {
//     var currentPlaylistID= $(this).attr("data-playlist-id");

//     // make ajax call for playlists tracks
//     $.ajax({
//         url: "https://api.spotify.com/v1/playlists/" + currentPlaylistID + "/tracks",
//         headers: {
//             "Authorization": "Bearer " + accessToken
//         },
//         success: function(response) {
//             console.log(response);
//         },
//     });
// });
