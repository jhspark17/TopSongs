import * as d3 from "d3";
import * as d3Color from "d3-contour";

function computeTextRotation(d) {
  var angle = ((d.x0 + d.x1) / Math.PI) * 90;

  // Avoid upside-down labels
  return angle < 120 || angle > 270 ? angle : angle + 180; // labels as rims
  //return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
}

export const makeD3 = nodeData => {
  d3.select("svg").remove();
  
  var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2 - 10;

  var formatNumber = d3.format(",d");

  var x = d3.scaleLinear().range([0, 2 * Math.PI]).clamp(true);

  var y = d3.scaleSqrt().range([radius * 0.1, radius]);
  const dark = [
    "#00FF00",
    "#00FFFF",
    "#008080",
    "#6D191B",
    "#E9967A",
    "#FF4500",
    "#00FF7F",
    "#48D1CC",
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
  
  const arc = d3
    .arc()
    .startAngle(d => x(d.x0))
    .endAngle(d => x(d.x1))
    .innerRadius(d => Math.max(0, y(d.y0)))
    .outerRadius(d => Math.max(0, y(d.y1)));

  const middleArcLine = d => {
    const halfPi = Math.PI / 2;
    const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) {
      angles.reverse();
    }

    const path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
  };

  const textFits = d => {
    const CHAR_SPACE = 6;

    const deltaAngle = x(d.x1) - x(d.x0);
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
    const perimeter = r * deltaAngle;

    return d.data.name.length * CHAR_SPACE < perimeter;
  };

  const svg = d3
    .select('body')
    .append('svg')
    .style('width', '100vw')
    .style('height', '100vh')
    .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
    .on('click', () => focusOn()); // Reset zoom on canvas click


  let root = d3.hierarchy(nodeData);
  root.sum(d => d.size);

  const slice = svg.selectAll('g.slice').data(partition(root).descendants());

  slice.exit().remove();

  const newSlice = slice
    .enter()
    .append('g')
    .attr('class', 'slice')
    .on('click', d => {
      d3.event.stopPropagation();
      focusOn(d);
    });

  newSlice
    .append('title')
    .text(d => d.data.name + '\n' + formatNumber(d.value));

  newSlice
    .append('path')
    .attr('class', 'main-arc')
    .style('fill', d => color((d.children ? d : d.parent).data.name))
    .attr('d', arc);

  newSlice
    .append('path')
    .attr('class', 'hidden-arc')
    .attr('id', (_, i) => `hiddenArc${i}`)
    .attr('d', middleArcLine);

  const text = newSlice
    .append('text')
    .attr('display', d => (textFits(d) ? null : 'none'));


  text
    .append('textPath')
    .attr('startOffset', '50%')
    .attr('xlink:href', (_, i) => `#hiddenArc${i}`)
    .text(d => d.data.name);

  function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
    // Reset to top-level if no data point specified

    const transition = svg
      .transition()
      .duration(750)
      .tween('scale', () => {
        const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
          yd = d3.interpolate(y.domain(), [d.y0, 1]);
        return t => {
          x.domain(xd(t));
          y.domain(yd(t));
        };
      });

    transition.selectAll('path.main-arc').attrTween('d', d => () => arc(d));

    transition
      .selectAll('path.hidden-arc')
      .attrTween('d', d => () => middleArcLine(d));

    transition
      .selectAll('text')
      .attrTween('display', d => () => (textFits(d) ? null : 'none'));

    moveStackToFront(d);

    //

    function moveStackToFront(elD) {
      svg
        .selectAll('.slice')
        .filter(d => d === elD)
        .each(function (d) {
          this.parentNode.appendChild(this);
          if (d.parent) {
            moveStackToFront(d.parent);
          }
        });
    }
  }
};





