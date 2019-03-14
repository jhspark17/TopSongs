const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const bodyParser = require("body-parser");  
const PORT = process.env.PORT || 5000; // process.env accesses heroku's environment variables

app.use(express.static('dist'))

app.get('/', (request, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'))
})

app.use(bodyParser.urlencoded({  //allows our app to respond to other software like postman
  extended: false
}));

app.use(bodyParser.json()); //allows our app to respond to json


app.get('/tracks', (request, response) => {
  // make api call using fetch
  fetch(
    `http://api.musixmatch.com/ws/1.1/track.search?apikey=8f1e02a00118dbdc0cf0c0fc1683c0d0&chart_name=${request.params.chart}&page=1&s_track_rating=desc`
  )
    .then(response => {
      return response.text();
    })
    .then(body => {
      let results = JSON.parse(body);
      console.log(results); // logs to server
      response.send(results); // sends to frontend
    });
});

app.listen(PORT, () => console.log(`listening to ${PORT}`))