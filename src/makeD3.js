import * as d3 from "d3";
import * as d3Color from "d3-contour";

// function computeTextRotation(d) {
//   var angle = ((d.x0 + d.x1) / Math.PI) * 90;

//   // Avoid upside-down labels
//   return angle < 120 || angle > 270 ? angle : angle + 180; // labels as rims
//   //return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
// }

export const makeD3 = nodeData => {
  var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2 - 10;

  var formatNumber = d3.format(",d");

  var x = d3.scaleLinear().range([0, 2 * Math.PI]);

  var y = d3.scaleSqrt().range([0, radius]);
  const dark = [
    "#B08B12",
    "#BA5F06",
    "#8C3B00",
    "#6D191B",
    "#842854",
    "#5F7186",
    "#193556",
    "#137B80",
    "#144847",
    "#254E00"
  ];

  const mid = [
    "#E3BA22",
    "#E58429",
    "#BD2D28",
    "#D15A86",
    "#8E6C8A",
    "#6B99A1",
    "#42A5B3",
    "#0F8C79",
    "#6BBBA1",
    "#5C8100"
  ];

  const light = [
    "#F2DA57",
    "#F6B656",
    "#E25A42",
    "#DCBDCF",
    "#B396AD",
    "#B0CBDB",
    "#33B6D0",
    "#7ABFCC",
    "#C8D7A1",
    "#A0B700"
  ];

  const palettes = [light, mid, dark];
  const lightGreenFirstPalette = palettes
    .map(d => d.reverse())
    .reduce((a, b) => a.concat(b));
  var color = d3.scaleOrdinal(lightGreenFirstPalette); // <-- 3

  var partition = d3.partition();

  var arc = d3.arc()
    .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    .innerRadius(function (d) { return Math.max(0, y(d.y0)); })
    .outerRadius(function (d) { return Math.max(0, y(d.y1)); });


  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

  let root = d3.hierarchy(nodeData);
  root.sum(function (d) { return d.size; });
  svg.selectAll("path")
    .data(partition(root).descendants())
    .enter().append("path")
    .attr("d", arc)
    .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); })
    .on("click", click)
    .append("title")
    .text(function (d) { return d.data.name + "\n" + formatNumber(d.value); });

 
  function click(d) {
    svg
      .transition()
      .duration(750)
      .tween("scale", function () {
        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
          yd = d3.interpolate(y.domain(), [d.y0, 1]),
          yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
        return function (t) {
          x.domain(xd(t));
          y.domain(yd(t)).range(yr(t));
        };
      })
      .selectAll("path")
      .attrTween("d", function (d) {
        return function () {
          return arc(d);
        };
      });
  }

};








  