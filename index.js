// based on Mike Bostock's d3 Bar Chart
// https://bl.ocks.org/mbostock/3885304 


// set up svg field and subtract margins
// i changed the margin-left to show all the labels of the y-axis correctly
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 70},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

// set up graph size/scale so everything fits correctly
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

// shorthand to append groups to svg
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load in .tsv data
d3.tsv("languages.tsv", function(d) {
  d.speakers = +d.speakers;
  return d;
}, function(error, data) {
  if (error) throw error;

// set range of data input
  x.domain(data.map(function(d) { return d.language; }));
  y.domain([0, d3.max(data, function(d) { return d.speakers; })]);

// group x axis, add class attribute and transform attribute, draw axis
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
// group y axis, add class attribute, set ticks (amount of numbered notches) and type (percentage)
// draw axis and rotate vertically
// set format to "f" (fixed point notation) for the y-axis labels
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "f"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("speakers");
// draw rectangles for the actual bars of the bar chart
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.language); })
      .attr("y", function(d) { return y(d.speakers); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.speakers); });
});