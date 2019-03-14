
const axios = require('axios');

console.log('got it')

document.addEventListener('DOMContentLoaded', () => {

  let chart = "top"
  axios.get(`/tracks`, {
    params: {
      chart: "mxmweekly",

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