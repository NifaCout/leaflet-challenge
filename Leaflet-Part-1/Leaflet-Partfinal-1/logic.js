document.addEventListener("DOMContentLoaded", function() {

    // Initialize the map 
    var map = L.map('map').setView([40.5, -120], 5);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 4, 
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch earthquake data using the USGS Earthquake API
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            var coords = feature.geometry.coordinates;
            var magnitude = feature.properties.mag;
            var depth = coords[2];

            var color;
            if (depth < 10) {
                color = "#51c291";
            } else if (depth < 30) {
                color = "#79c251";
            } else {
                color = "#275944";
            }
            var marker = L.circleMarker([coords[1], coords[0]], {
                radius: magnitude * 5,
                fillColor: color,
                color: 'white',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

            marker.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`);
        });

        var legend = L.control({position: 'bottomright'});
            legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');
            div.innerHTML += '<i style="background: #7FFF00"></i><span>-10-10 km</span><br>';
            div.innerHTML += '<i style="background: #FFD700"></i><span>10-30 km</span><br>';
            div.innerHTML += '<i style="background: #2E8B57"></i><span>30-50 km</span><br>';
            div.innerHTML += '<i style="background: #FF8C00"></i><span>50-70 km</span><br>';
            div.innerHTML += '<i style="background: #FF4500"></i><span>70-90 km</span><br>';
            div.innerHTML += '<i style="background: #FF0000"></i><span>90+ km</span><br>';
            return div;
        };
        legend.addTo(map);
    });
});

