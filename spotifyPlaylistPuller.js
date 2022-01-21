//Takes as input a spotify access token, returns an array of strings created from songs with artist name and song name in the strings.
async function playlistPuller(access_token){
    const prompt = require('prompt-sync')({ sigint: true});
    const fs = require('fs');
    const SpotifyWebApi = require('spotify-web-api-node');
    const ACCESS_TOKEN = access_token

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(ACCESS_TOKEN);

    async function getUserInfo() {
        const me = await spotifyApi.getMe();
        let tracks = await getUserPlaylists(me.body.id);
        return tracks;
    }

    async function getUserPlaylists(spotifyID){
        const data = await spotifyApi.getUserPlaylists(spotifyID)
        let playlists = [];
        let playNum = 0;
        for(let playlist of data.body.items){
            console.log("[" + playNum + "]: " + playlist.name);
            playNum++;
        }
        var playlistSelect = data.body.items[parseInt(prompt("Pick one of the above playlists by the given ID number:"))]; 
        console.log("Selected playlist is: ", playlistSelect.name);
        let tracks = await getPlayListTracks(playlistSelect.id, playlistSelect.name);
        return tracks;
    }

    async function getPlayListTracks(playlistId, playlistName){
        const data = await spotifyApi.getPlaylistTracks(playlistId, {
            offset: 1,
            limit: 100,
            fields: 'items'
        })
        let tracks = [];
        for(let trackObj of data.body.items){
            const track = trackObj.track
            let artists = [];
            for(const artist of track.artists){
                artists.push(artist.name)
            }
            tracks.push(track.name + " by " + artists[0]);
        }
    return tracks;
    }
    return (await getUserInfo());
}

exports.playlistPuller = playlistPuller;