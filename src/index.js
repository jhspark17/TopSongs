const axios = require('axios');

import render from './render';
document.addEventListener('DOMContentLoaded', () => {
 const displayLoader = () => {
   let icon = document.getElementsByTagName("div")[3]; 
   icon.className += "loader";
   getData();
 }
  const getData = () => {
    d3.select("svg").remove();
    let country = document.getElementById("country").value;
    let limit = document.getElementById("limit").value;
    makeCall(country, limit);
 };

const makeCall = async (country, limit) => {
  let final = [];
  let data = await axios.post(`/artists`, {
    country: country,
    limit: limit,
  });
 

  data = data.data.message.body.artist_list;

  for (let i = 0; i < data.length; i ++) {
    
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

  render(final, country, limit);
};




  let submit = document.getElementById('submit');
  submit.addEventListener("click", displayLoader);

  window.addEventListener("keyup", function(e) {
    if (e.keyCode === 13) {
      displayLoader();
    }
  }, false)
});

  






  

