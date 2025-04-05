console.log("data cleaning!")







const csvFilePath = 'message-history.csv';

function csvToGeoJSON(data) {
    return {
      type: "FeatureCollection",
      features: data.map(d => ({
        type: "Feature",
        properties: { ...d },
        geometry: {
          type: "Point",
          coordinates: [parseFloat(d.Lon), parseFloat(d.Lat)]
        }
      }))
    };
  }


d3.csv(csvFilePath).then(data => {
    const geojson = csvToGeoJSON(data);

    const cleanedGeojson = {
        ...geojson,
        features: geojson.features.filter(f => {
          const coords = f.geometry?.coordinates;
          return (
            Array.isArray(coords) &&
            coords.length >= 2 &&
            !isNaN(coords[1]) &&
            !isNaN(coords[0]) &&
            typeof coords[1] === 'number' && // lat
            typeof coords[0] === 'number'    // lon
          );
        })
      };



      const timeThreshold = new Date("2024-06-16T00:00:00Z");

      const timeFilteredGeojson = {
        ...cleanedGeojson,
        features: cleanedGeojson.features.filter(f => {
            const gpsTime = f.properties?.GPSTime;

            const timestamp = new Date(gpsTime);

            // console.log({gpsTime})
            if (timestamp >= timeThreshold) {
                return true; // Keep this feature if it meets the time threshold
            }
             
        })
      };

    // console.log(cleanedGeojson);
    // console.log(timeFilteredGeojson);
        // console.log(JSON.stringify(timeFilteredGeojson, null, 2));
        // saveToFile(timeFilteredGeojson, 'cdtInreachData.geojson'); // Save the filtered GeoJSON to a file

  });






/**
 * Save to file
 * @param {*} data 
 * @param {*} filename 
 */

function saveToFile(data, filename) {
    // Convert the cleaned data to JSON
    const jsonString = JSON.stringify(data, null, 2);
    
    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a download link and click it to save the file
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Clean up by revoking the URL and removing the link
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
}






