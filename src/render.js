import { makeD3 } from "./makeD3";

const render = (nodes, country, num) => {
  
  let nodeData = {
    name: `Top ${num} Artists in ` + country.toUpperCase(),
    children: []
  };
  for (let i = 0; i < nodes.length; i++) {
    let temp = {};
    let currentNode = nodes[i];
    temp.name = currentNode.artistName;
    temp.rating = currentNode.artistRating;
    temp.children = [];

    for (let j = 0; j < currentNode.albums.length; j++) {
      let currentAlbum = currentNode.albums[j];
      let tempAlbum = {};
      tempAlbum.name = currentAlbum.album.album_name;
      tempAlbum.rating = currentAlbum.album.album_rating;
      tempAlbum.children = [];
      for (let k = 0; k < currentAlbum.album.tracks.length; k++) {
        let track = currentAlbum.album.tracks[k];
        let tempTrack = {};
        tempTrack.name = track.track.track_name;
        tempTrack.trackUrl = track.track.track_share_url;
        tempTrack.rating = track.track.track_rating;
        tempTrack.favorites = track.track.num_favourite;
        tempTrack.size = 1000;
        tempTrack.display = [tempTrack.name, tempTrack.url]
        tempAlbum.children.push(tempTrack);
      }
      let a = 0;
      let check = true;
      while (check) {
        let cur = temp.children[a];
        if (temp.children.length === 0 || temp.children.length === a) {
          temp.children.push(tempAlbum);
          check = false;
        } else if (tempAlbum.name === cur.name) {
          check = false;
        }
        a++;
      }
    }
    nodeData.children.push(temp);
  }
  makeD3(nodeData);
};

export default render;

// }
