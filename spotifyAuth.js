var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const playlists = require('./spotifyPlaylistPuller');
const beatSaver = require('./beatsaverQuery');

// This file is copied from: https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js

const scopes = [
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
  ];
  
// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: '0e68c4c86fbe47538875e17cc7405c7a',
    clientSecret: '386f316c4c0140e88b8c8b54d0fedcb1',
    redirectUri: 'http://localhost:8888/callback/'
  });
  
  const app = express();
  
  app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
  });
  
  app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
  
    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
  
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
  
        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);
  
        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
        res.send('Success! You can now close the window.');
        async function getTracks(){
          let tracks = await playlists.playlistPuller(access_token);
          console.log(tracks);
          for(let track of tracks){
            console.log("Searching for: " + track + "\n")
            let trackQuery = await beatSaver.beatSaverQuery(track)
            console.log("List of Results: ")
            for(let result of trackQuery){
              console.log(result.name)
            }
            console.log("--------------------------------------------------------")
          }
        };
        getTracks();
        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
  
          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      });
  });
  
  app.listen(8888, () =>
    console.log(
      'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
    )
  );
