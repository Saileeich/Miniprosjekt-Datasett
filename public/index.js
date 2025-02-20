// Initialize and add the map
let map;
let markers = [];

async function initMap() {
    const position = { lat: 60.3244999609888, lng: 5.37445996887982 };

    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        zoom: 10,
        center: position,
        mapId: "BUS_MAP_ID",
    });

    updateMarkers();
    setInterval(updateMarkers, 15000); // Update markers every 15 seconds
}

async function updateMarkers() {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const data = await getData();
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    for (const vehicle of data) {     
        if (vehicle["DestinationName"] == "skyss.no") {
            continue;
        }
        
        const vehiclePosition = { lat: Number(vehicle["Latitude"]), lng: Number(vehicle["Longitude"]) };
        const marker = new AdvancedMarkerElement({
            map,
            position: vehiclePosition,
            //title: `${vehicle["LineNum"]} | ${vehicle["StartName"]} - ${vehicle["DestinationName"]} | ${vehicle["StopPointName"]}`,
            title: `${vehicle["LineNum"]} | ${vehicle["Delay"]} | ${vehicle["StopPointName"]}`,
        });
        markers.push(marker);
    }
}

async function getData() {
    return fetch("http://localhost:3000/api/bus_data")
        .then((response) => response.json())
        .then((data) => {
            return data;
        }
    );
}

initMap();