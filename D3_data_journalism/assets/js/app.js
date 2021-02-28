// @TODO: YOUR CODE HERE!
const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
const chosenXAxis = "poverty";
const chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

  //TODO function used for updating xAxis var upon click on axis label
// function renderAxes(newXScale, xAxis) {
//     var bottomAxis = d3.axisBottom(newXScale);
  
//     xAxis.transition()
//       .duration(1000)
//       .call(bottomAxis);
  
//     return xAxis;
//   }


// TODO function used for updating circles group with a transition to
// new circles
// function renderCircles(circlesGroup, newXScale, chosenXAxis) {

//     circlesGroup.transition()
//       .duration(1000)
//       .attr("cx", d => newXScale(d[chosenXAxis]));
  
//     return circlesGroup;
//   }


//TODO function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//     var label;
  
//     if (chosenXAxis === "poverty") {
//       label = "In Poverty %:";
//     }
//     else {
//       label = "# of Albums:";
//     }
  
//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([80, -60])
//       .html(function(d) {
//         return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
//       });
  
//     circlesGroup.call(toolTip);
  
//     circlesGroup.on("mouseover", function(data) {
//       toolTip.show(data);
//     })
//       // onmouseout event
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data);
//       });
  
//     return circlesGroup;
//   }

// Import Data
d3.csv("./assets/data/data.csv").then(function(stateData, err) {
    if (err) throw err;
    // console.log(data);

// Retrieve data from the CSV file and execute everything below
stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.income = +data.income;
});

// xLinearScale function above csv import
const xLinearScale = xScale(stateData, chosenXAxis);

// Create y scale function
const yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(stateData, d => d[chosenYAxis])])
  .range([height, 0]);

// Create initial axis functions
const bottomAxis = d3.axisBottom(xLinearScale);
const leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
const xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
  .call(leftAxis);

  // append initial circles
var circlesGroup = chartGroup.selectAll("circle")
  .data(stateData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 10)
  .attr("fill", "pink")
  .attr("opacity", ".5");
  
  // Add the state abbreviations to the circles
  
var stateAbbr = chartGroup.selectAll("stateAbbr")
  .data(stateData)
  .enter()
  .append("text")
  .attr("x", d =>  xLinearScale(d[chosenXAxis]) )
  .attr("y", d => yLinearScale(d[chosenYAxis] -.30))
  .text(function(d){
    return d.abbr;
  })
  .attr("class", "stateAbbr")
  .attr("text-anchor","middle")
  .attr("font-size", "10px")
  .attr("fill", "purple");
   
   //create group for x axis labels 
var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

var PovertyLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");

  //create group for y-axis labels
var ylabelsGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)");

var healthLabel = ylabelsGroup.append("text")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.classed("axis-text", true)
.text("Lacks Healthcare (%)");

})
