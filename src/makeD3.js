import * as d3 from "d3";
import * as d3Color from "d3-contour";

function computeTextRotation(d) {
  var angle = ((d.x0 + d.x1) / Math.PI) * 90;

  // Avoid upside-down labels
  return angle < 120 || angle > 270 ? angle : angle + 180; // labels as rims
  //return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
}

const makeD3 = nodeData => {
  debugger
  var width = 700; // <-- 1
  var height = 700;
  var radius = Math.min(width, height) / 2; // < -- 2
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

  var g = d3
    .select("svg") // <-- 1
    .attr("width", width) // <-- 2
    .attr("height", height)
    .append("g") // <-- 3
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var partition = d3.partition().size([2 * Math.PI, radius]);

  // Find data root
  var root = d3.hierarchy(nodeData).sum(function(d) {
    return d.size;
  });

  // Size arcs
  partition(root);
  var arc = d3
    .arc()
    .startAngle(function(d) {
      return d.x0;
    })
    .endAngle(function(d) {
      return d.x1;
    })
    .innerRadius(function(d) {
      return d.y0;
    })
    .outerRadius(function(d) {
      return d.y1;
    });

  // Put it all together
  g.selectAll('g')
    .data(root.descendants())
    .enter().append('g').attr("class", "node").append('path')
    .attr("display", function (d) { return d.depth ? null : "none"; })
    .attr("d", arc)
    .style('stroke', '#fff')
    .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); });


  // Populate the <text> elements with our data-driven titles.
  g.selectAll(".node")
    .append("text")
    .attr("transform", function (d) {
      return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")";
    })
    .attr("dx", "-20") // radius margin
    .attr("dy", ".5em") // rotation align
    .text(function (d) { return d.parent ? d.data.name : "" });

};

export default makeD3;
