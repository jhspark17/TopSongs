
const axios = require('axios');

import render from './render';
document.addEventListener('DOMContentLoaded', () => {
 
  const getData = () => {
    let type = document.getElementById("type").value;
    let country = document.getElementById("country").value;
    let chart = document.getElementById("chart").value;
    let limit = document.getElementById("limit").value;
    
  
  makeCall(type, country, chart, limit);
 };

const makeCall = async (type, country, chart, limit) => {
  let final = [];
  let data = await axios.post(`/${type}`, {
    country: country,
    chart: chart,
    limit: limit,
  });
 

  data = data.data.message.body.artist_list;

  for (let i = 0; i < data.length; i ++) {
    debugger
    let current = data[i];
    let temp = {};
    temp.artistName = current.artist.artist_name;
    temp.artistRating = current.artist.artist_rating;
    temp.artistId = current.artist.artist_id;
    let albums = await axios.post(`/albums`, {
      id: temp.artistId
    });
    
    temp.albums = albums.data.message.body.album_list;
   
   
    let currentAlbums = temp.albums;
   
    for (let j = 0; j < currentAlbums.length; j++) {
      let curAlbumId = currentAlbums[j].album.album_id;
      let album = currentAlbums[j].album;
      album.tracks = [];
      let albumTracks = await axios.post(`/tracks`, {
        id: curAlbumId
      });
      albumTracks.data.message.body.track_list.map(track => 
          album.tracks.push(track)
        );
    }
    final.push(temp);
    
  }
  debugger
  render(final, country);
};




  let submit = document.getElementById('submit');
  submit.addEventListener("click", getData);
});