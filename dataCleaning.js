console.log("data cleaning!")

fetch('garminData.geojson')
    .then(response => response.json())
    .then(geoData => {

    const timeThreshold = new Date("2024-06-16T00:00:00Z");

    geoData.features.forEach(feature => {
        const times = feature.properties.coordinateProperties.times;
        const coordinates = feature.geometry.coordinates;
        
        // Create new filtered arrays
        const filteredTimes = [];
        const filteredCoordinates = [];
        
        times.forEach((time, index) => {
            const timestamp = new Date(time);
            if (timestamp >= timeThreshold) {
            filteredTimes.push(time);
            filteredCoordinates.push(coordinates[index]);
            }
        });
        
        // Update the feature with filtered times and coordinates
        feature.properties.coordinateProperties.times = filteredTimes;
        feature.geometry.coordinates = filteredCoordinates;
        });
        
    // console.log(JSON.stringify(geoData, null, 2));

    }
);