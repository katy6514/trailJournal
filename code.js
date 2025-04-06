console.log("testoooo");

const width = 800;
const height = 700;

const svg = d3.select('body').append('svg')  
    .attr("width", width)
    .attr("height", height)
    .attr("stroke", "rgb(127, 127, 127)")
    .attr("stroke-width", "1px");


const projection = d3.geoAlbersUsa()
    .scale(2000)
    .translate([width*.9, height*.625]);

const path = d3.geoPath().projection(projection);



d3.json("cdtInreachData.geojson").then(data => {
    const points = data.features.filter(d =>
      d.geometry?.type === "Point" &&
      Array.isArray(d.geometry.coordinates) &&
      d.geometry.coordinates.length === 2
    );
    const validPoints = points.filter(d => {
        const projected = projection(d.geometry.coordinates);
        return projected != null;
      });
  
    // Plot the points
    svg.selectAll("#points")
      .data(validPoints)
      .enter()
      .append("circle")
      .attr('class', 'points')
      .attr("cx", d => projection(d.geometry.coordinates)[0])
      .attr("cy", d => projection(d.geometry.coordinates)[1])
      .attr("r", 1.5)
      .attr('d', path)
      .attr("fill", "red")
      .attr("stroke", d => checkForCampsite(d))
      .attr("stroke-width", 1);

  });



  function checkForCampsite(data) {
    // Function to check if the data contains a campsite
    if (!data || !data.properties) {
        return false; // Invalid data
    }

    if (data.properties.MessageText.toLowerCase().includes("camped")){
        return "blue"
    }
    return "none"; // No campsite found
   
  }



  // geojson data from: https://github.com/johan/world.geo.json/tree/master
d3.json('CDTstates.json').then(data => {
    svg.selectAll('.state')
        .data(data.features)
        .enter()
        .append('path')
        .attr('class', 'state')
        .attr("fill", "rgba(255, 255, 255, 0)")
        .attr("stroke", "rgb(127, 127, 127)")
        .attr("stroke-width", "1px")
        .attr('d', path)
        .on("click", clicked);
});  

// Define the zoom behavior
function clicked(event, d) {
    // Check if we’re already zoomed in on this state
    const [[x0, y0], [x1, y1]] = path.bounds(d);  // Get bounding box of the selected state
    const dx = x1 - x0;
    const dy = y1 - y0;
    const x = (x0 + x1) / 2;
    const y = (y0 + y1) / 2;
    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    svg.transition()
        .duration(750)
        .call(
            zoom.transform,
            d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );
}


// Set up the zoom behavior
const zoom = d3.zoom()
    .scaleExtent([1, 8])  // Limits of the zoom scale
    .on("zoom", (event) => {
        svg.selectAll("circle").attr("transform", event.transform);  // Apply transform on zoom
        svg.selectAll("path").attr("transform", event.transform);  // Apply transform on zoom
    });

svg.call(zoom);


// Add background click to reset zoom
svg.on("click", (event) => {
    if (event.target.tagName !== "path") {  // Check if clicked outside a state
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);  // Reset zoom to initial state
    }
});



svg.append("circle").attr("cx",100).attr("cy",430).attr("r", 6).style("fill", "red")
svg.append("circle").attr("cx",100).attr("cy",460).attr("r", 6).style("fill", "blue")
svg.append("text").attr("x", 120).attr("y", 430).text("Garmin Message Sent").style("font-size", "15px").attr("alignment-baseline","middle").style("font-family", "Open Sans")
svg.append("text").attr("x", 120).attr("y", 460).text("Campsite Location").style("font-size", "15px").attr("alignment-baseline","middle").style("font-family", "Open Sans")




    
