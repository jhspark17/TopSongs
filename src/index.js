
const axios = require('axios');

console.log('got it')

document.addEventListener('DOMContentLoaded', () => {
 
  axios.post(`/tracks`, {
  // body: {
  //  chart: ,
  //  country: ,
  //  limit: 
  // }
  })
    .then((response) => {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    });

  axios.post(`/artists`, {
    body: {
      chart: "mxmweekly",
      country: "it",
      limit: 2
    }
  })
    .then((response) => {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    });



})