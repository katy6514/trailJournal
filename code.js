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

function getAlternatingColor(properties) {
  const { title } = properties;
  if (typeof title === "string") {
    const legNum = Number(title.split(" ")[0]);
    if (legNum % 2 === 0) {
      return "blue";
    } else {
      return "orange";
    }
  }
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

function handleMouseOver(event, d) {
  // console.log(this);
  if (!d) {
    return;
  }
  const tooltip = document.getElementById("tooltip");

  if (d.geometry && d.geometry.type) {
    const { type } = d.geometry;
    if (type === "Point") {
      // inreach data point, display its date
      const messageDate = new Date(d.properties.GPSTime);
      const messageDateString = dateTimeFormatter.format(messageDate);
      tooltip.innerHTML = ` <p>Message Date: ${messageDateString}<p>`;
      tooltip.style.display = "block";
    } else if (type === "LineString") {
      // trail route, display it's leg name
      const legNum = d.properties.title;
      const legName = d.properties.description;
      tooltip.innerHTML = ` <p>Leg #${legNum}: ${legName}<p>`;
      tooltip.style.display = "block";
    }
  } else {
    tooltip.innerHTML = `<img src="${d.path}" width="550">`;
    tooltip.style.display = "block";
  }
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
 *  Plotting route Data
 ----------------------------------------------------- */
d3.json("CDT_border_to_lincoln.json").then((data) => {
  // Plot the points
  svg
    .selectAll(".trail")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", "trail")
    .attr("d", path)
    .attr("stroke", (d) => getAlternatingColor(d.properties))
    .attr("stroke-width", 1)
    .attr("fill", "none")
    .on("mouseover", handleMouseOver)
    .on("mousemove", handleMouseMove)
    .on("mouseout", handleMouseOut);
});

/* -----------------------------------------------------
 *  Plotting Garmin Data
 ----------------------------------------------------- */
d3.json("cdtInreachData_withCoords.geojson").then((data) => {
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
    .attr("stroke", "none")
    .on("mouseover", handleMouseOver)
    .on("mousemove", handleMouseMove)
    .on("mouseout", handleMouseOut);
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
    .lower()
    .on("click", clicked);
});

/* -----------------------------------------------------
 *  City mapping functionality
 ----------------------------------------------------- */
const cities = [
  {
    name: "CDT Northern Terminus",
    lat: 48.99,
    lon: -113.6,
    dx: -15,
    dy: -20,
  },
  {
    name: "Kalispell",
    lat: 48.192,
    lon: -114.316109,
    dx: -25,
    dy: -10,
  },
  {
    name: "Many Glacier",
    lat: 48.7967,
    lon: -113.6578,
    dx: 25,
    dy: -15,
  },
  {
    name: "Two Medicine",
    lat: 48.4915,
    lon: -113.3646,
    dx: 25,
    dy: -10,
  },
  {
    name: "East Glacier",
    lat: 48.4415,
    lon: -113.2184,
    dx: 25,
    dy: 5,
  },
  { name: "Augusta", lat: 47.4927, lon: -112.3922, dx: 25, dy: -10 },
  { name: "Lincoln", lat: 46.9549, lon: -112.6817, dx: -25, dy: -5 },
  { name: "Helena", lat: 46.5891, lon: -112.0391, dx: 25, dy: 5 },
  {
    name: "Anaconda",
    lat: 46.1263,
    lon: -112.9478,
    dx: -25,
    dy: -15,
  },
  {
    name: "Camp Sula",
    lat: 45.8363,
    lon: -113.9821,
    dx: -25,
    dy: 5,
  },
  { name: "Lima", lat: 44.6369, lon: -112.592, dx: -25, dy: -5 },
  {
    name: "West Yellowstone",
    lat: 44.6621,
    lon: -111.1041,
    dx: 25,
    dy: -20,
  },
  {
    name: "Old Faithful Village",
    lat: 44.4605,
    lon: -110.8281,
    dx: 25,
    dy: -10,
  },
  {
    name: "Grant Village",
    lat: 44.3896,
    lon: -110.5554,
    dx: 25,
    dy: 5,
  },
  { name: "Dubois", lat: 43.5336, lon: -109.6304, dx: 25, dy: -5 },
  { name: "Pinedale", lat: 42.8679, lon: -109.8634, dx: -25, dy: -5 },
  {
    name: "Atlantic City",
    lat: 42.4966,
    lon: -108.7307,
    dx: 25,
    dy: -5,
  },
  { name: "Rawlins", lat: 41.7911, lon: -107.2387, dx: 25, dy: -5 },
  { name: "Encampment", lat: 41.2061, lon: -106.8001, dx: 25, dy: -5 },
  {
    name: "Steamboat Springs",
    lat: 40.485,
    lon: -106.8317,
    dx: -25,
    dy: -5,
  },
  {
    name: "Grand Lake",
    lat: 40.2522,
    lon: -105.8231,
    dx: 25,
    dy: -5,
  },
  {
    name: "Breckenridge",
    lat: 39.4817,
    lon: -106.0384,
    dx: 25,
    dy: 5,
  },
  { name: "Twin Lakes", lat: 39.082, lon: -106.3823, dx: -25, dy: -5 },
  { name: "Salida", lat: 38.5347, lon: -105.9989, dx: 25, dy: 5 },
  { name: "Lake City", lat: 38.03, lon: -107.3153, dx: -25, dy: -5 },
  {
    name: "Pagosa Springs",
    lat: 37.2694,
    lon: -107.0098,
    dx: -25,
    dy: -5,
  },
  { name: "Chama", lat: 36.9028, lon: -106.5792, dx: 25, dy: 5 },
  { name: "Ghost Ranch", lat: 36.3313, lon: -106.4729, dx: 25, dy: 5 },
  { name: "Cuba", lat: 36.0222, lon: -106.9584, dx: -25, dy: -5 },
  { name: "Grants", lat: 35.1473, lon: -107.8514, dx: 25, dy: 5 },
  { name: "Pie Town", lat: 34.2984, lon: -108.1348, dx: 25, dy: 5 },
  {
    name: "Doc Campbell's",
    lat: 33.1987,
    lon: -108.2081,
    dx: 25,
    dy: 5,
  },
  { name: "Silver City", lat: 32.7701, lon: -108.2803, dx: -25, dy: -5 },
  { name: "Lordsburg", lat: 32.3504, lon: -108.7087, dx: 25, dy: 5 },
  {
    name: "CDT Southern Terminus",
    lat: 31.8611,
    lon: -108.2511,
    dx: 15,
    dy: 25,
  },
];

const cityGroup = svg.append("g").attr("class", "cities");

cityGroup
  .selectAll("circle")
  .data(cities)
  .enter()
  .append("circle")
  .attr("r", 4)
  .attr("fill", "black")
  .attr("stroke", "none")
  .attr("cx", (d) => projection([d.lon, d.lat])[0])
  .attr("cy", (d) => projection([d.lon, d.lat])[1]);

const lines = cityGroup
  .selectAll("line")
  .data(cities)
  .enter()
  .append("line")
  .attr("x1", (d) => projection([d.lon, d.lat])[0])
  .attr("y1", (d) => projection([d.lon, d.lat])[1])
  .attr("x2", (d) => projection([d.lon, d.lat])[0] + d.dx)
  .attr("y2", (d) => projection([d.lon, d.lat])[1] + d.dy)
  .attr("stroke", "black")
  .attr("stroke-width", 1);

const labels = cityGroup
  .selectAll("text")
  .data(cities)
  .enter()
  .append("text")
  .attr("class", "city_labels")
  .attr("x", (d) => projection([d.lon, d.lat])[0] + d.dx)
  .attr("y", (d) => projection([d.lon, d.lat])[1] + d.dy)
  .text((d) => d.name)
  .attr("font-size", 12)
  .attr("text-anchor", (d) => (d.dx <= 0 ? "end" : "start"))
  .attr("fill", "black")
  .attr("stroke", "none");

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
      CDTzoom.transform,
      d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
}

// Set up the zoom behavior
const CDTzoom = d3
  .zoom()
  .scaleExtent([1, 500]) // Limits of the zoom scale
  // .on("zoom", handleZoom);
  .on("zoom", (event) => {
    const { transform } = event;
    const scale = transform.k;

    // d3.select("#CDTmap").attr("transform", transform);
    svg.selectAll("circle").attr("transform", transform); // Apply transform on zoom
    svg.selectAll("path").attr("transform", transform); // Apply transform on zoom
    svg.selectAll("text").attr("transform", transform); // Apply transform on zoom
    svg.selectAll("image").attr("transform", transform); // Apply transform on zoom
    svg.selectAll("line").attr("transform", transform); // Apply transform on zoom

    // Adjust point sizes inversely to zoom
    d3.selectAll("circle").attr("r", 4 / scale);
    labels.attr("font-size", 12 / scale);
    d3.selectAll("line").attr("stroke-width", 1 / scale);
    d3.selectAll(".trail").attr("stroke-width", 2 / scale);
  });

svg.call(CDTzoom);

// Add background click to reset zoom
svg.on("click", (event) => {
  if (event.target.tagName !== "path") {
    // Check if clicked outside a state
    svg.transition().duration(750).call(CDTzoom.transform, d3.zoomIdentity); // Reset zoom to initial state
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
  .append("circle")
  .attr("cx", 100)
  .attr("cy", 520)
  .attr("r", 6)
  .style("fill", "black")
  .style("stroke", "none");
svg
  .append("line")
  .attr("x1", 90)
  .attr("x2", 110)
  .attr("y1", 550)
  .attr("y2", 550)
  .attr("stroke", "blue") // Set the line color
  .attr("stroke-width", 3); // Set the line width
svg
  .append("line")
  .attr("x1", 90)
  .attr("x2", 110)
  .attr("y1", 580)
  .attr("y2", 580)
  .attr("stroke", "orange") // Set the line color
  .attr("stroke-width", 3); // Set the line width

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
svg
  .append("text")
  .attr("x", 120)
  .attr("y", 520)
  .text("Resupply Stops")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle")
  .style("font-family", "Open Sans");
svg
  .append("text")
  .attr("x", 120)
  .attr("y", 550)
  .text("Even days")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle")
  .style("font-family", "Open Sans");
svg
  .append("text")
  .attr("x", 120)
  .attr("y", 580)
  .text("Odd days")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle")
  .style("font-family", "Open Sans");
