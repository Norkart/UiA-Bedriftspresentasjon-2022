const initialZoom = 13
const latitude = 58.15
const longitude = 8
// Map 
var map = L.map("map").setView([latitude, longitude], initialZoom);

// OsmTileLayer
const openStreetMapTileLayerLink = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const openStreetMapAttribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

// OtmTileLayer
const openTopoMapLayerLink = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
const openTopoMapMaxZoom = 17;
const openTopoMapAttribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';

// Norkart API key
const apiKey = "" // User your own key from https://developer.norkart.no/


/************************** 
* Defining the map Layers * 
**************************/ 
var openStreetMap = L.tileLayer(openStreetMapTileLayerLink,
  {
    attribution: openStreetMapAttribution,
  }
);

var openTopoMap = L.tileLayer(openTopoMapLayerLink,
  {
    maxZoom: openTopoMapMaxZoom,
    attribution: openTopoMapAttribution,
  }
);

var norkartLite = L.tileLayer.webatlas(
  {
    mapType: L.TileLayer.Webatlas.Type.LITE,
    apikey: apiKey,
  }
);

var norkartHybrid = L.tileLayer.webatlas(
  {
    mapType: L.TileLayer.Webatlas.Type.HYBRID,
    apikey: apiKey,
  }
);

var norkartAerial = L.tileLayer.webatlas(
  {
    mapType: L.TileLayer.Webatlas.Type.AERIAL,
    apikey: apiKey,
  }
);

/** All available Norkart map types
L.TileLayer.Webatlas.Type.GREY
L.TileLayer.Webatlas.Type.VECTOR
L.TileLayer.Webatlas.Type.MEDIUM
L.TileLayer.Webatlas.Type.LITE
L.TileLayer.Webatlas.Type.AERIAL
L.TileLayer.Webatlas.Type.HYBRID
*/

/*********************************** 
* Async henting av geojson * 
***********************************/ 
async function getGeojson(path) {
  return fetch(path).then((response) => response.json());
}

/*********************************** 
* Setting up a marker with a popup * 
***********************************/ 
const myMarkersGEOJSON = await getGeojson("data/myMarkers.geojson");
var myMarkers = L.geoJSON(myMarkersGEOJSON, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<h4>" + feature.properties.name + "</h4>" +
      "<p>" + feature.properties.popupContent + "</p>"
      );
  },
}).addTo(map);

const barsInNorwayGEOJSON = await getGeojson("data/barsNorway.geojson");
var markersBarsInNorway = L.geoJSON(barsInNorwayGEOJSON, {
  onEachFeature: function (feature, layer) {
    var popupcontent = [];
    for (var prop in feature.properties) {
      if(prop != "@id"){
        popupcontent.push(prop + ": " + feature.properties[prop]);
      }
    }
    layer.bindPopup(popupcontent.join("<br />"));
  },
}).addTo(map);


/*************************************** 
* Setting up the map and adding layers * 
***************************************/ 
norkartAerial.addTo(map);

var baseLayers = {
  OpenStreetMap: openStreetMap,
  Topo: openTopoMap,
  NorkartLite: norkartLite,
  NorkartHybrid: norkartHybrid,
  NorkartAerial: norkartAerial,
};

var overlays = {
  Markers: myMarkers,
  BarsInNorway: markersBarsInNorway,
};

L.control.layers(baseLayers, overlays).addTo(map);
