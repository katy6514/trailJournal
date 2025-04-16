console.log(
  "Hello, world! If you're reading this, I'm looking for a job! \n\nCheck out my github (github.com/katy6514) and shoot me an email if you'd like to work together :)"
);

/* -----------------------------------------------------
 *  Initial SVG setup
 ----------------------------------------------------- */
const width = 1000;
const height = 700;

const svg = d3
  .select("body")
  .append("svg")
  .attr("id", "CDTmap")
  .attr("width", width)
  .attr("height", height)
  .attr("stroke", "rgb(127, 127, 127)")
  .attr("stroke-width", "1px");

const projection = d3
  .geoAlbersUsa()
  .scale(2000)
  .translate([width * 0.9, height * 0.625]);

const path = d3.geoPath().projection(projection);

/* -----------------------------------------------------
 *  Plotting Garmin Data
 ----------------------------------------------------- */
d3.json("cdtInreachData.geojson").then((data) => {
  const points = data.features.filter(
    (d) =>
      d.geometry?.type === "Point" &&
      Array.isArray(d.geometry.coordinates) &&
      d.geometry.coordinates.length === 2
  );
  const validPoints = points.filter((d) => {
    const projected = projection(d.geometry.coordinates);
    return projected != null;
  });

  // Plot the points
  svg
    .selectAll(".points")
    .data(validPoints)
    .enter()
    .append("circle")
    .attr("class", "points")
    .attr("cx", (d) => projection(d.geometry.coordinates)[0])
    .attr("cy", (d) => projection(d.geometry.coordinates)[1])
    .attr("r", 4)
    .attr("fill", (d) => checkForCampsite(d))
    .attr("stroke", "none");
});

function checkForCampsite(data) {
  // Function to check if the data contains a campsite
  if (!data || !data.properties) {
    return false; // Invalid data
  }

  if (data.properties.MessageText.toLowerCase().includes("camped")) {
    return "blue";
  }
  return "red"; // No campsite found
}

/* -----------------------------------------------------
 *  State outline mapping functionality
 ----------------------------------------------------- */
// geojson data from: https://github.com/johan/world.geo.json/tree/master
d3.json("CDTstates.json").then((data) => {
  svg
    .selectAll(".state")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", "state")
    .attr("fill", "rgba(255, 255, 255, 0)")
    .attr("stroke", "rgb(127, 127, 127)")
    .attr("stroke-width", "1px")
    .attr("d", path)
    .on("click", clicked);
});

/* -----------------------------------------------------
 *  Take the cleaned photo geojson data and plot it
 ----------------------------------------------------- */
d3.json("photoData.json").then((photoData) => {
  const validPoints = photoData.filter((d) => {
    const projected = projection([d.longitude, d.latitude]);
    return projected != null;
  });
  svg
    .selectAll(".photoPoints")
    .data(validPoints)
    .enter()
    .append("circle")
    .attr("class", "photoPoints")
    .attr("cx", (d) => projection([d.longitude, d.latitude])[0])
    .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
    .attr("r", 4)
    .attr("fill", "green")
    .attr("stroke", "none")
    .on("mouseover", handleMouseOver)
    .on("mousemove", handleMouseMove)
    .on("mouseout", handleMouseOut);
});

function handleMouseOver(event, d) {
  const tooltip = document.getElementById("tooltip");

  tooltip.innerHTML = `
      <img src="${d.path}" width="550">
    `;
  tooltip.style.display = "block";
}

function handleMouseMove(event) {
  const tooltip = document.getElementById("tooltip");
  tooltip.style.left = event.pageX + 15 + "px";
  tooltip.style.top = event.pageY - 50 + "px";
}

function handleMouseOut() {
  document.getElementById("tooltip").style.display = "none";
}

/* -----------------------------------------------------
 *  Zoom and Pan functionality
 ----------------------------------------------------- */
// Define the zoom behavior
function clicked(event, d) {
  // Check if we’re already zoomed in on this state
  const [[x0, y0], [x1, y1]] = path.bounds(d); // Get bounding box of the selected state
  const dx = x1 - x0;
  const dy = y1 - y0;
  const x = (x0 + x1) / 2;
  const y = (y0 + y1) / 2;
  const scale = Math.max(
    1,
    Math.min(8, 0.9 / Math.max(dx / width, dy / height))
  );
  const translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg
    .transition()
    .duration(750)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
}

// Set up the zoom behavior
const zoom = d3
  .zoom()
  .scaleExtent([1, 500]) // Limits of the zoom scale
  .on("zoom", (event) => {
    // d3.select("#CDTmap").attr("transform", event.transform);
    svg.selectAll("circle").attr("transform", event.transform); // Apply transform on zoom
    svg.selectAll("path").attr("transform", event.transform); // Apply transform on zoom
    svg.selectAll("text").attr("transform", event.transform); // Apply transform on zoom
    svg.selectAll("image").attr("transform", event.transform); // Apply transform on zoom
    // Adjust point sizes inversely to zoom
    d3.selectAll("circle").attr("r", 4 / event.transform.k);
  });

svg.call(zoom);

// Add background click to reset zoom
svg.on("click", (event) => {
  if (event.target.tagName !== "path") {
    // Check if clicked outside a state
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity); // Reset zoom to initial state
  }
});

/* -----------------------------------------------------
 *  Legend
 ----------------------------------------------------- */
svg
  .append("circle")
  .attr("cx", 100)
  .attr("cy", 430)
  .attr("r", 6)
  .style("fill", "red")
  .style("stroke", "none");
svg
  .append("circle")
  .attr("cx", 100)
  .attr("cy", 460)
  .attr("r", 6)
  .style("fill", "blue")
  .style("stroke", "none");
svg
  .append("circle")
  .attr("cx", 100)
  .attr("cy", 490)
  .attr("r", 6)
  .style("fill", "green")
  .style("stroke", "none");
svg
  .append("text")
  .attr("x", 120)
  .attr("y", 430)
  .text("Garmin Message Sent")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle")
  .style("font-family", "Open Sans");
svg
  .append("text")
  .attr("x", 120)
  .attr("y", 460)
  .text("Campsite Location")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle")
  .style("font-family", "Open Sans");
svg
  .append("text")
  .attr("x", 120)
  .attr("y", 490)
  .text("Photo Location")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle")
  .style("font-family", "Open Sans");
