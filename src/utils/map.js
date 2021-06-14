export function initMap(element, latitude, longitude) {
  const START_LATLNG = [latitude, longitude]
  const START_ZOOM = 7

  // Initialize the Leaflet map
  const map = L.map(element, { attributionControl: false, trackResize: false }).setView(
    START_LATLNG,
    START_ZOOM
  )

  // Add the basemap tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/{z}/{x}/{y}?access_token={accessToken}", {
    attribution:
      'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' +
      ', Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/satellite-streets-v10/tiles/256",
    accessToken:
      "pk.eyJ1IjoiYnJhbmRvbmRldiIsImEiOiJjajFwNjNmODAwMDBnMzFwbDJ4N21yZmFmIn0.YC44JxjiM36-I54e-hVQUA"
  }).addTo(map)

  return map
}
