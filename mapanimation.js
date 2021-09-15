// This array contains the coordinates for all bus stops between MIT and Harvard
const busStops = [
  [-71.093729, 42.359244],
  [-71.094915, 42.360175],
  [-71.0958, 42.360698],
  [-71.099558, 42.362953],
  [-71.103476, 42.365248],
  [-71.106067, 42.366806],
  [-71.108717, 42.368355],
  [-71.110799, 42.369192],
  [-71.113095, 42.370218],
  [-71.115476, 42.372085],
  [-71.117585, 42.373016],
  [-71.118625, 42.374863],
];

// TODO: add your own access token
mapboxgl.accessToken =
  "pk.eyJ1IjoieWFubmd1ZWd1ZW4iLCJhIjoiY2tzZ3JwZDhyMW5nYTMwb21peGYzMzR6eiJ9.Q4dRQr58ib-_kYIQ5AhaPg";

// This is the map instance
let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-71.104081, 42.365554],
  zoom: 14,
});

// TODO: add a marker to the map at the first coordinates in the array busStops. The marker variable should be named "marker"
const marker = new mapboxgl.Marker({ color: "#b40219" })
  .setLngLat(busStops[0])
  .addTo(map);

// counter here represents the index of the current bus stop
let counter = 0;
function move() {
  // TODO: move the marker on the map every 1000ms. Use the function marker.setLngLat() to update the marker coordinates
  setTimeout(() => {
    if (counter >= busStops.length) return;
    marker.setLngLat(busStops[counter]);
    map.flyTo({
      center: busStops[counter],
    });
    counter++;
    move();
  }, 1000);
}

const places = {
  type: "FeatureCollection",
  features: [
    {
      type: "University",
      properties: {
        id: "startMarker",
        description: "MIT",
        title: "Start",
      },
      geometry: {
        type: "Point",
        coordinates: [-71.093729, 42.359244],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "finishMarker",
        title: "Finish",
        description: "Harvard",
      },
      geometry: {
        type: "Point",
        coordinates: [-71.118625, 42.374863],
      },
    },
  ],
};

map.on("load", () => {
  // Add a GeoJSON source containing place coordinates and information.
  map.addSource("places", {
    type: "geojson",
    data: places,
  });

  map.addLayer({
    id: "poi-labels",
    type: "symbol",
    source: "places",
    layout: {
      "text-field": ["get", "description"],
      "text-variable-anchor": ["top", "bottom", "left", "right"],
      "text-radial-offset": 0.5,
      "text-justify": "auto",
      "icon-image": ["get", "icon"],
    },
  });

  // map.rotateTo(180, { duration: 10000 });
});

// add markers to map
for (const { geometry, properties } of places.features) {
  // create a HTML element for each feature
  const el = document.createElement("div");
  el.className = "marker";
  // el.style.backgroundImage = "url('startIcon.png')";
  el.setAttribute('id',properties.id);

  // make a marker for each feature and add it to the map
  new mapboxgl.Marker(el)
    .setLngLat(geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(`<h3>${properties.title}</h3><p>${properties.description}</p>`)
    )
    .addTo(map);
}

// Do not edit code past this point
if (typeof module !== "undefined") {
  module.exports = { move };
}
