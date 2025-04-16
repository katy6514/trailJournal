/**
 * Reads a CSV file, converts it to GeoJSON
 */

function csvToGeoJSON(data) {
  return {
    type: "FeatureCollection",
    features: data.map((d) => ({
      type: "Feature",
      properties: { ...d },
      geometry: {
        type: "Point",
        coordinates: [parseFloat(d.Lon), parseFloat(d.Lat)],
      },
    })),
  };
}

/**
 * Load CSV data from my garmin device and convert it to 
 * GeoJSON using the csvToGeoJSON helper function
 * 
 * It also filters the data based on a time threshold 
 * corresponding to the beginning of my hike
 */

d3.csv("message-history.csv").then((data) => {
  const geojson = csvToGeoJSON(data);

  const cleanedGeojson = {
    ...geojson,
    features: geojson.features.filter((f) => {
      const coords = f.geometry?.coordinates;
      // check if coords is an array and has at least 2 elements
      // check if coords[0] and coords[1] are numbers
      return (
        Array.isArray(coords) &&
        coords.length >= 2 &&
        !isNaN(coords[1]) &&
        !isNaN(coords[0]) &&
        typeof coords[1] === "number" && // lat
        typeof coords[0] === "number" // lon
      );
    }),
  };

  const timeThreshold = new Date("2024-06-16T00:00:00Z");

  const timeFilteredGeojson = {
    ...cleanedGeojson,
    features: cleanedGeojson.features.filter((f) => {
      const gpsTime = f.properties?.GPSTime;

      const timestamp = new Date(gpsTime);

      if (timestamp >= timeThreshold) {
        return true; // Keep this feature if it meets the time threshold
      }
    }),
  };


  // Save the filtered GeoJSON to a file
  // saveToFile(timeFilteredGeojson, 'cdtInreachData.geojson');
});

/**
 * Save to file
 */

function saveToFile(data, filename) {
  // Convert the cleaned data to JSON
  const jsonString = JSON.stringify(data, null, 2);

  // Create a Blob with the JSON data
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a download link and click it to save the file
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Clean up by revoking the URL and removing the link
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
}
