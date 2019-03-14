
const axios = require('axios');

console.log('got it')

document.addEventListener('DOMContentLoaded', () => {

  
  axios.get(`/tracks`, {
    params: {
      chart: "mxmweekly",
      country: "kr",
      limit: 1,
    }
  })
    .then((response) => {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    });

  // let query = "grace hopper";
  // axios.get(`/search?string=${query}`)
  //   .then((response) => {
  //     console.log(response);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });

})