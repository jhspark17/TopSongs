const path = require("path");
const webpack = require("webpack");

const config = {
  entry: path.join(__dirname, "./src/index.js"),
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "./dist")
  },

  devtool: "source-map"
};

module.exports = config;

//http://api.musixmatch.com/ws/1.1/track.search?apikey=8f1e02a00118dbdc0cf0c0fc1683c0d0&chart_name=hot&page_size=100&page=1&s_track_rating=desc
