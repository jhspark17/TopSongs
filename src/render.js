import makeD3 from './makeD3'

const render = (nodes, country) => {
  let nodeData = {
    name: `top songs in ${country}`,
    children: []
  };

  for (let i = 0; i < nodes.length; i ++) {
    let temp = {};
    let currentNode = nodes[i];
    temp.artistName = currentNode.artistName;
    temp.artistRating = currentNode.artistRating;
  
    temp.children = [];
    
    for (let j = 0; j < currentNode.albums.length; j++) {
      let currentAlbum = currentNode.albums[j];
      let tempAlbum = {};
      tempAlbum.albumName = currentAlbum.album.album_name;
      tempAlbum.children = [];

      for (let k = 0; k < currentAlbum.album.tracks.length; k++) {
        let track = currentAlbum.album.tracks[k];
        let tempTrack = {};
        tempTrack.trackName = track.track.track_name;
        tempTrack.trackUrl = track.track.track_share_url;
        tempTrack.rating = track.track.track_rating;
        tempTrack.favorites = track.track.num_favourite;
        tempTrack.size = 3;
        tempAlbum.children.push(tempTrack);
      }
      temp.children.push(tempAlbum);
    }
    nodeData.children.push(temp);
  }
  makeD3(nodeData);
}

export default render;





// }