const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const bodyParser = require("body-parser");  
const PORT = process.env.PORT || 5000; // process.env accesses heroku's environment variables


app.use(express.static('dist'));

app.get('/', (request, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.use(bodyParser.urlencoded({  //allows our app to respond to other software like postman
  extended: false
}));

app.use(bodyParser.json()); //allows our app to respond to json


app.post('/artists', (request, response) => {
  fetch(
    `http://api.musixmatch.com/ws/1.1/chart.artists.get?apikey=8f1e02a00118dbdc0cf0c0fc1683c0d0&page=1&page_size=${
      request.body.limit
    }&country=${request.body.country}`
  )
    .then(response => {
      return response.text();
    })
    .then(body => {
      let results = JSON.parse(body);
      response.send(results); 
    });

  });

app.post('/albums', (request, response) => {
  fetch(
    `http://api.musixmatch.com/ws/1.1/artist.albums.get?apikey=8f1e02a00118dbdc0cf0c0fc1683c0d0&artist_id=${
      request.body.id
    }&s_release_date=ascc&page_size=4`
  )
    .then(response => {
      return response.text();
    })
    .then(body => {
      let results = JSON.parse(body);
      response.send(results); 
    });

});
  
app.post('/tracks', (request, response) => {
    fetch(
      `http://api.musixmatch.com/ws/1.1/album.tracks.get?apikey=8f1e02a00118dbdc0cf0c0fc1683c0d0&album_id=${
        request.body.id
      }&page_size=10`
    )
      .then(response => {
        return response.text();
      })
      .then(body => {
        let results = JSON.parse(body);
        response.send(results); // sends to frontend
      });
    
});

app.listen(PORT, () => console.log(`listening to ${PORT}`));