import * as d3 from "d3";
import * as d3Color from "d3-contour";
function computeTextRotation(d) {
  var angle = ((d.x0 + d.x1) / Math.PI) * 90;

  // Avoid upside-down labels
  return angle < 120 || angle > 270 ? angle : angle + 180; // labels as rims
  //return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
}

function arcTweenPath(a, i) {
  var oi = d3.interpolate({ x0: a.x0s, x1: a.x1s }, a);

  function tween(t) {
    var b = oi(t);
    a.x0s = b.x0;
    a.x1s = b.x1;
    return arc(b);
  }

  return tween;
}


function arcTweenText(a, i) {
  var oi = d3.interpolate({ x0: a.x0s, x1: a.x1s }, a);
  function tween(t) {
    var b = oi(t);
    return (
      "translate(" + arc.centroid(b) + ")rotate(" + computeTextRotation(b) + ")"
    );
  }
  return tween;
}

const makeD3 = nodeData => {
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
    .select("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Data strucure
  var partition = d3.partition().size([2 * Math.PI, radius]);

  // Find data root
  var root = d3
    .hierarchy(nodeData)
    .sum(function(d) {
      return d.size;
    })
    .sort(function(a, b) {
      return b.value - a.value;
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

  var slice = g
    .selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node");

  slice
    .append("path")
    .attr("display", function(d) {
      return d.depth ? null : "none";
    })
    .attr("d", arc)
    .style("stroke", "#fff")
    .style("fill", function(d) {
      return color((d.children ? d : d.parent).data.name);
    });

  slice
    .append("text")
    .attr("transform", function(d) {
      return (
        "translate(" +
        arc.centroid(d) +
        ")rotate(" +
        computeTextRotation(d) +
        ")"
      );
    })
    .attr("dx", "-20")
    .attr("dy", ".5em")
    .text(function(d) {
      return d.parent ? d.data.name : "";
    });

  d3.selectAll(".sizeSelect").on("click", function(d, i) {
    // Determine how to size the slices.
    if (this.value === "size") {
      root.sum(function(d) {
        return d.size;
      });
    } else {
      root.count();
    }

    partition(root);

    slice
      .selectAll("path")
      .transition()
      .duration(750)
      .attrTween("d", arcTweenPath);
    slice
      .selectAll("text")
      .transition()
      .duration(750)
      .attrTween("transform", arcTweenText);
  });
};

export default makeD3;
