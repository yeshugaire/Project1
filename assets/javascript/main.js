var loopEnd
// get access token from url
var hash = window.location.hash.substr(14);
var parsedHash = hash.split("&");
accessToken = parsedHash[0];

// make ajax call to get user playlist
$.ajax({
    url: "https://api.spotify.com/v1/me/playlists",
    headers: {
        "Authorization": "Bearer " + accessToken
    },
    success: function (response) {
        // display playlists in table
        for (var i = 0; i < response.items.length; i++) {
            var data = response.items[i]
            $("#user-playlist-table").append("<tr class='playlist' data-playlist-id= '" + data.id + "' data-total-tracks= '" + data.tracks.total + "'><td>" + data.name + "</td><td>" + data.tracks.total + "</td><td>" + data.owner.display_name + "</td></tr>");
        };
    },
});

//when you choose a playlist 
$(document).on("click", ".playlist", function () {
    // get playlist id
    var currentPlaylistID = $(this).attr("data-playlist-id");

    // variable for initializing datatables
    var tableInitialized = false;

    // make table and directions for current playlist
    var currentPlaylistTableDiv = $("<div>");
    var directionsDiv = $("<div>")
    var directions = $("<h3 class= 'text-center'>Click a column head to sort by that criteria.<br> Hold shift while clicking column head for ordered sorting. (i.e. secondary and tertiary sorting)</h3>")
    var currentPlaylistTable = $("<table id='playlist-table' class='display table-striped'><thead><tr><th>Name</th><th>Artist</th><th>Album</th><th>Length</th><th>Tempo(BPM)</th><th>Key</th><th>Mode</th><th>Energy</th><th>Danceability</th><th>Euphoria</th><th>Time Signature</th></tr></thead><tbody id= 'current-playlist-table'</tbody></table>");

    // clear playlist table if choosing new playlist
    currentPlaylistTableDiv.empty();

    // variables and loop for if playlist is >100 tracks
    var offset = 0;
    loopEnd = $(this).attr("data-total-tracks");
    for (i = 0; i < loopEnd / 100; i++) {
        //  ajax call for tracks
        $.ajax({
            url: "https://api.spotify.com/v1/playlists/" + currentPlaylistID + "/tracks?offset=" + offset,
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            success: function (response) {
                var trackIds = "";

                // loop through all tracks in response
                for (i = 0; i < response.items.length; i++) {
                    // add track id to trackIds string
                    var data = response.items[i].track;
                    trackIds = trackIds + data.id + ",";

                    // variables for table
                    var trackArtists = "";

                    // // loop through track artists for mulutiple artists
                    // if (data.artists.length > 1) {
                    //     for (i = 0; i < data.artists.length; i++) {
                    //         trackArtists = trackArtists + data.artists[i].name + ", ";
                    //     };
                    // };
                    // else {
                    trackArtists = data.artists[0].name;
                    // };

                    // make table row and add name, ablum and artist to it
                    var tableRow = $("<tr data-track-id='" + data.id + "' data-track-uri='" + data.uri + "'><td>" + data.name + "</td><td>" + trackArtists + "</td><td>" + data.album.name + "</td></tr>");
                    $("#current-playlist-table").append(tableRow);

                };
                // make ajax call for track features
                $.ajax({
                    url: "https://api.spotify.com/v1/audio-features?ids=" + trackIds,
                    headers: {
                        "Authorization": "Bearer " + accessToken
                    },
                    success: function (response) {
                        var info = response.audio_features;

                        // loop through tracks and display track features
                        for (f = 0; f < info.length; f++) {
                            var info = response.audio_features;

                            for (j = 0; j < loopEnd; j++)
                                if ($($("#current-playlist-table tr")[j]).attr("data-track-id") === info[f].id) {
                                    // variables for track features
                                    var key
                                    var mode
                                    var timeSignature

                                    // switch statements for key
                                    switch (info[f].key) {
                                        case 0:
                                            key = "C";
                                            break;
                                        case 1:
                                            key = "C#/Db";
                                            break;
                                        case 2:
                                            key = "D";
                                            break;
                                        case 3:
                                            key = "D#/Eb";
                                            break;
                                        case 4:
                                            key = "E";
                                            break;
                                        case 5:
                                            key = "F";
                                            break;
                                        case 6:
                                            key = "F#/Gb";
                                            break;
                                        case 7:
                                            key = "G";
                                            break;
                                        case 8:
                                            key = "G#/Ab";
                                            break;
                                        case 9:
                                            key = "A";
                                            break;
                                        case 10:
                                            key = "A#/Bb";
                                            break;
                                        case 11:
                                            key = "B";
                                            break;
                                        case 12:
                                            key = "C";
                                            break;
                                    };

                                    // if statements for mode
                                    if (info[f].mode === 0) {
                                        mode = "Minor";
                                    };

                                    if (info[f].mode === 1) {
                                        mode = "Major"
                                    };

                                    // switch statement for time signature
                                    switch (info[f].time_signature){
                                    case 3:
                                        timeSignature = "3/4";
                                        break;
                                    case 4:
                                        timeSignature = "4/4";
                                        break;
                                    case 5:
                                        timeSignature = "5/4";
                                        break;
                                    case 6:
                                        timeSignature = "6/4";
                                        break;
                                    case 7:
                                        timeSignature = "7/4";
                                        break;
                                    };

                                    // calulate duration
                                    function millisToMinutesAndSeconds(millis) {
                                        var minutes = Math.floor(millis / 60000);
                                        var seconds = ((millis % 60000) / 1000).toFixed(0);
                                        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                                    };

                                    // append features to table
                                    var appendToList = function (property) {
                                        $($("#current-playlist-table tr")[f]).append(property);
                                    };

                                    appendToList("<td>" + millisToMinutesAndSeconds(info[f].duration_ms) + "</td>");
                                    appendToList("<td>" + info[f].tempo + "</td>");
                                    appendToList("<td>" + key + "</td>");
                                    appendToList("<td>" + mode + "</td>");
                                    appendToList("<td>" + info[f].energy + "</td>");
                                    appendToList("<td>" + info[f].danceability + "</td>");
                                    appendToList("<td>" + info[f].valence + "</td>");
                                    appendToList("<td>" + timeSignature + "</td>");
                                };
                        };
                        // initailize datatables
                        if (tableInitialized === false) {
                            $('#playlist-table').DataTable({
                                paging: false,
                            });
                            tableInitialized = true;
                        };
                    },
                });
            },
        });
        // increment offset
        offset = offset + 100;
    };
    // append table and directions to div
    directionsDiv.append(directions);
    $(".container").append(directionsDiv);
    currentPlaylistTableDiv.append(currentPlaylistTable);
    $(".container").append(currentPlaylistTableDiv);

    // make save button
    if ($.trim($("#save-playlist-div").html()) == '') {
        $("#save-playlist-div").append("<button id= 'save-button1' class= ' btn-lg'>Save to Spotify</button>");
    };
});

// when you click on save button diaplay modal
$(document).on("click", "#save-button1", function () {
    $('#save-modal').css("display", "block");
});

//  when you click second save button
$(document).on("click", "#save-button", function () {
    var userId;
    var trackUris = [];
    var playlistName = $("#playlist-name").val().trim();

    // clear save button
    $("#save-button1").remove();

    if (playlistName == "") {
        alert("You must name your playlist")
    } else {

        // make modal disapear
        $('#save-modal').css("display", "none");

        // get ids from new playlist
        for (i = 0; i < loopEnd; i++) {
            trackUris.push($($("#current-playlist-table tr")[i]).attr("data-track-uri"));
        }

        // make ajax call for user id
        $.ajax({
            url: "https://api.spotify.com/v1/me",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            success: function (response) {
                userId = response.id;
                // make ajax to make empty playlist
                $.ajax({
                    url: "https://api.spotify.com/v1/users/" + userId + "/playlists",
                    type: "POST",
                    headers: {
                        "Authorization": "Bearer " + accessToken,
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify({
                        "name": playlistName,
                        "public": false,
                    }),
                    success: function (response) {

                        // add tracks to playlist
                        $.ajax({
                            url: "https://api.spotify.com/v1/playlists/" + response.id + "/tracks",
                            type: "POST",
                            headers: {
                                "Authorization": "Bearer " + accessToken,
                                "Content-Type": "application/json",
                            },
                            data: JSON.stringify({
                                uris: trackUris,
                            }),
                            success: function (response) {

                            },
                        });

                    },
                    Error: function () {
                        console.log("error:"());
                    },
                });
            },
        });
    };
});