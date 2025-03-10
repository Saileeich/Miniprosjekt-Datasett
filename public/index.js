import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@8.3.2/dist/esm-browser/index.js';

let map;
let markers = [];

let data;

let lineNum = [];
let showInRoute = true;
let showOutRoute = false;

const enTurUUID = uuidv4();

async function initMap() {
    const position = { lat: 60.3244999609888, lng: 5.37445996887982 };

    const { Map } = await google.maps.importLibrary("maps");

    const mapElement = document.getElementById("map");

    map = new Map(mapElement, {
        zoom: 10,
        center: position,
        mapId: "BUS_MAP_ID",
    });

    mapElement.style.display = "block";
    document.getElementById("loader").style.display = "none";

    setInterval(updateData, 15000); // Update markers every 15 seconds
}

async function init() {
    // Fetch complete dataset
    console.log("Fetching data...");

    data = await fetchAndParseXML("https://api.entur.io/realtime/v1/rest/vm?datasetId=SKY&requestorId=" + enTurUUID);
    console.log("https://api.entur.io/realtime/v1/rest/vm?datasetId=SKY&requestorID=" + enTurUUID);
    

    console.log("Data fetched:", data);

    initMap();
    updateMarkers();
}

async function updateData() {
    console.log("Fetching new data...");
    
    const newData = await fetchAndParseXML("https://api.entur.io/realtime/v1/rest/vm?datasetId=SKY&requestorId=" + enTurUUID);

    console.log("New data fetched:", newData);

    // Merge new data into existing data
    for (const newVehicle of newData) {
        const existingVehicle = data.find(vehicle => vehicle["VehicleRef"] === newVehicle["VehicleRef"]);
        if (existingVehicle) {
            Object.assign(existingVehicle, newVehicle);
        } else {
            data.push(newVehicle);
        }
    }

    console.log("finished merging");
    

    updateMarkers();
}

async function updateMarkers() {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    

    for (const vehicle of data) {
        if (vehicle["DestinationName"] == "skyss.no") {
            continue;
        }
        if (lineNum != "") {
            if (!lineNum.includes(vehicle["LineNum"])) {
                continue;
            }
        }

        const vehiclePosition = { lat: Number(vehicle["Latitude"]), lng: Number(vehicle["Longitude"]) };

        const marker = new AdvancedMarkerElement({
            map,
            position: vehiclePosition,
            //title: `${vehicle["LineNum"]} | ${vehicle["StartName"]} - ${vehicle["DestinationName"]} | ${vehicle["StopPointName"]}`,
            title: `${vehicle["LineNum"]} | ${vehicle["Delay"]} | ${vehicle["StopPointName"]} | ${vehicle["StartName"]} - ${vehicle["DestinationName"]}`,
        });
        markers.push(marker);
    }
}

async function fetchAndParseXML(url) {
    try {
        // Fetch the XML data
        const response = await fetch(url);
        const text = await response.text();

        // Parse XML into a DOM object
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        // Convert XML to JSON manually
        function xmlToJson(xml) {
            let obj = {};
            if (xml.nodeType === 1) { // Element node
                if (xml.attributes.length > 0) {
                    obj["@attributes"] = {};
                    for (let attr of xml.attributes) {
                        obj["@attributes"][attr.nodeName] = attr.nodeValue;
                    }
                }
            } else if (xml.nodeType === 3) { // Text node
                return xml.nodeValue.trim();
            }

            // Process child nodes
            if (xml.hasChildNodes()) {
                for (let child of xml.childNodes) {
                    let nodeName = child.nodeName;
                    let nodeValue = xmlToJson(child);
                    if (nodeValue) {
                        if (!obj[nodeName]) {
                            obj[nodeName] = nodeValue;
                        } else {
                            if (!Array.isArray(obj[nodeName])) {
                                obj[nodeName] = [obj[nodeName]];
                            }
                            obj[nodeName].push(nodeValue);
                        }
                    }
                }
            }
            return obj;
        }

        const json = xmlToJson(xml);
        let result = [];
        for (const element of json["Siri"]["ServiceDelivery"]["VehicleMonitoringDelivery"]["VehicleActivity"]) {
            result.push({
                "VehicleRef": element["MonitoredVehicleJourney"]["VehicleRef"]["#text"],
                "Latitude": element["MonitoredVehicleJourney"]["VehicleLocation"]["Latitude"]["#text"],
                "Longitude": element["MonitoredVehicleJourney"]["VehicleLocation"]["Longitude"]["#text"],
                "LineNum": element["MonitoredVehicleJourney"]["PublishedLineName"]["#text"],
                "StartName": element["MonitoredVehicleJourney"]["OriginName"]["#text"],
                "DestinationName": element["MonitoredVehicleJourney"]["DestinationName"]["#text"],
                "StopPointName": element["MonitoredVehicleJourney"]["MonitoredCall"]["StopPointName"]["#text"],
                "Delay": element["MonitoredVehicleJourney"]["Delay"]["#text"],
            });
        }

        return result;
    } catch (error) {
        console.error("Error fetching or parsing XML:", error);
    }
}

init();

document.getElementById("customForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    lineNum = document.getElementById("LineNum").value.toUpperCase().split(",");

    updateMarkers();
});