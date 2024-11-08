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


d3.json('filteredGarminData.geojson').then(data => {
    svg.selectAll('.gpx')
        .data(data.features)
        .enter()
        .append('path')
        .attr('class', 'gpx')
        .attr("fill", "rgba(255, 255, 255, 0)")
        .attr("stroke", "red")
        .attr("stroke-width", "2px")
        .attr('d', path);
});  



