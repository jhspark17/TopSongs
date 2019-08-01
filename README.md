[Live Demo](https://topsongs-sunburst.herokuapp.com)

# Welcome to TopSongs!!

TopSongs is a javascript and D3 application where users can see the number of top artists in a country of their choice.

### Technologies Used
  * Javascript
  * Express & Node
  * D3
  * Musixmatch API
  
 ### Features
  * User interaction through selecting artists and number of artists
  * Interactive D3 sunburst chart to select specific arcs to zoom in and out.
  
 
### Splash Page
Once user accesses website, they can select the country and number of artists they want to see.
<img width="1277" alt="Screen Shot 2019-05-08 at 5 38 16 PM" src="https://user-images.githubusercontent.com/42100510/57417197-61c91500-71b8-11e9-915b-e77f03cbfec4.png">





### D3 Sunburst Chart
Will retrieve data on artist and limit, which will then be portrayed in a Sunburst Chart.
<img width="1277" alt="Screen Shot 2019-05-08 at 5 38 38 PM" src="https://user-images.githubusercontent.com/42100510/57417174-4cec8180-71b8-11e9-998e-bb019361485e.png">




### Interacting with Sunburst Chart
Users can select specific arcs to zoom in on arcs.
<img <img width="1277" alt="Screen Shot 2019-05-08 at 5 38 49 PM" src="https://user-images.githubusercontent.com/42100510/57417156-3ba37500-71b8-11e9-997f-620269c70725.png">

### D3 functions to create sunburst

```
newSlice
    .append("path")
    .attr("class", "hidden-arc")
    .attr("id", (_, i) => `hiddenArc${i}`)
    .attr("d", middleArcLine);

  const text = newSlice
    .append("text")
    .attr("display", d => (textFits(d) ? d.data.name : d.data.rating));

  text
    .append("textPath")
    .attr("startOffset", "50%")
    .attr("xlink:href", (_, i) => `#hiddenArc${i}`)
    .text(d => (textFits(d) ? d.data.name : d.data.name));

  function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
    // Reset to top-level if no data point specified

    const transition = svg
      .transition()
      .duration(750)
      .tween("scale", () => {
        const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
          yd = d3.interpolate(y.domain(), [d.y0, 1]);
        return t => {
          x.domain(xd(t));
          y.domain(yd(t));
        };
      });
```

### Gather data from HTML

```
 const displayLoader = () => {
   let icon = document.getElementsByTagName("div")[17];
   icon.classList.remove("render-error");
   icon.innerHTML = "";
   icon.className += "loader";
   getData();
 };
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
  ```

### Axios API Calls
```
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

```

