// @TODO: YOUR CODE HERE!
const svgWidth = 700;
const svgHeight = 400;

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
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

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

  function yScale(stateData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.max(stateData, d => d[chosenYAxis] + 4),
        d3.min(stateData, d => d[chosenYAxis] *.5)
      ])
      .range([0, height]);
  
    return yLinearScale;
  
  }

  //TODO function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }


  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }



// TODO function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
     
    return circlesGroup;
  }

  function renderAbbr(stateAbbr, newXScale, chosenXAxis) {

    stateAbbr.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));

        return stateAbbr;
  }

  function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
  }

  function renderYAbbr(stateAbbr, newYScale, chosenYAxis) {

    stateAbbr.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[chosenYAxis] - .3));
  
    return stateAbbr;
  }

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
let xLinearScale = xScale(stateData, chosenXAxis);

// Create y scale function
let yLinearScale = yScale(stateData, chosenYAxis);
  // .domain([0, d3.max(stateData, d => d[chosenYAxis])])
  // .range([height, 0]);

// Create initial axis functions
let bottomAxis = d3.axisBottom(xLinearScale);
let leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
let xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  // append y axis
  let yAxis = chartGroup.append("g")
  .call(leftAxis);

  // append initial circles
var circlesGroup = chartGroup.selectAll("circle")
  .data(stateData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 10)
  .classed("stateCircle", true)
  .attr("opacity", ".5");
  
  // Add the state abbreviations to the circles
  
var stateAbbr = chartGroup.selectAll("stateAbbr")
  .data(stateData)
  .enter()
  .append("text")
  .attr("x", d =>  xLinearScale(d[chosenXAxis]) )
  .attr("y", d => yLinearScale(d[chosenYAxis] -.3))
  .text(function(d){
    return d.abbr;
  })
  .classed("stateText", true)
  
   
   //create group for x axis labels 
var xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

var povertyLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .classed("inactive", false)
  .text("In Poverty (%)");

var ageLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "age") // value to grab for event listener
  .classed("inactive", true)
  .classed("active", false)
  .text("Age (Median)");

var incomeLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income") // value to grab for event listener
  .classed("inactive", true)
  .classed("active", false)
  .text("Household Income (Median)");

  //create group for y-axis labels
var ylabelsGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)");

var healthLabel = ylabelsGroup.append("text")
.attr("y", 40 - margin.left)
.attr("x", 0 - (height/2))
.attr("dy", "1em")
.attr("value","healthcare")
.classed("inactive", false)
.classed("active", true)
.text("Lacks Healthcare (%)");

var smokerLabel = ylabelsGroup.append("text")
.attr("y", 20 - margin.left)
.attr("x",0 - (height/2))
.attr("dy", "1em")
.attr("value","smokes")
.classed("inactive", true)
.classed("active", false)
.text("Smokes (%)");

var obeseLabel = ylabelsGroup.append("text")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height/2))
.attr("dy", "1em")
.attr("value","obesity")
.classed("active", false)
.classed("inactive", true)
.text("Obese (%)");



// x axis labels event listener
xlabelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {

    // replaces chosenXAxis with value
    chosenXAxis = value;

    // console.log(chosenXAxis)

    // functions here found above csv import
    // updates x scale for new data
    xLinearScale = xScale(stateData, chosenXAxis);

    // updates x axis with transition
    xAxis = renderAxes(xLinearScale, xAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

    //update abbreviation text inside circles
    stateAbbr = renderAbbr(stateAbbr, xLinearScale, chosenXAxis);

    // TODO updates tooltips with new info
    // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenXAxis === "poverty") {
      povertyLabel
        .classed("active", true)
        .classed("inactive", false);
      ageLabel
        .classed("active", false)
        .classed("inactive", true);
      incomeLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if(chosenXAxis === "age"){
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
      ageLabel
        .classed("active", true)
        .classed("inactive", false);
      incomeLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else{
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
      ageLabel
        .classed("active", false)
        .classed("inactive", true);
      incomeLabel
        .classed("active", true)
        .classed("inactive", false);
    }
  }
})


  ylabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {
  
      // replaces chosenXAxis with value
      chosenYAxis = value;
  
      // console.log(chosenXAxis)
  
      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = yScale(stateData, chosenYAxis);
  
      // updates x axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);
  
      // updates circles with new x values
      circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
  
      //update abbreviation text inside circles
      stateAbbr = renderYAbbr(stateAbbr, yLinearScale, chosenYAxis);


// changes classes to change bold text
if (chosenYAxis === "healthcare") {
  healthLabel
    .classed("active", true)
    .classed("inactive", false);
  smokerLabel
    .classed("active", false)
    .classed("inactive", true);
  obeseLabel
    .classed("active", false)
    .classed("inactive", true);
}
else if(chosenYAxis === "smokes"){
  healthLabel
    .classed("active", false)
    .classed("inactive", true);
  smokerLabel
    .classed("active", true)
    .classed("inactive", false);
  obeseLabel
    .classed("active", false)
    .classed("inactive", true);
}
else{
  healthLabel
    .classed("active", false)
    .classed("inactive", true);
  smokerLabel
    .classed("active", false)
    .classed("inactive", true);
  obeseLabel
    .classed("active", true)
    .classed("inactive", false);
}
}





});
})
