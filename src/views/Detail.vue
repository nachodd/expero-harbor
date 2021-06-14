<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-sm-4 text-left">
        <h4><span class="text-primary">Port map</span> > {{ harbor.name }}</h4>

        <div class="mt-3">
          <h3>{{ harbor.name }}</h3>
          <div>
            🌎 <a target="_blank" :href="'http://' + harbor.website">{{ harbor.website }}</a>
          </div>
        </div>

        <div class="mt-3">
          <div><span class="def">Type:</span> {{ harbor.type }} Port</div>
          <div><span class="def">City:</span> {{ harbor.city }}</div>
        </div>

        <div class="mt-3">
          <div><span class="def">Latitude:</span> {{ harbor.latitude }} Port</div>
          <div><span class="def">Longitude:</span> {{ harbor.longitude }}</div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="map" ref="map"></div>
      </div>

      {{ harbor }}
    </div>
  </div>
</template>

<script>
import { get } from "vuex-pathify"
import cruiseIcon from "@/assets/icons/icons8-crucero-48.png"
import portIcon from "@/assets/icons/icons8-port-48.png"

export default {
  name: "Detail",
  computed: {
    harbor: get("harborSelected")
  },
  mounted() {
    if (!this.harbor) {
      this.$router.replace("/")
      return
    }
    const START_LATLNG = [this.harbor.latitude, this.harbor.longitude]
    const START_ZOOM = 7 //this.harbor.natlScale

    // Initialize the Leaflet map
    const element = this.$refs.map

    this._map = L.map(element, { trackResize: false }).setView(START_LATLNG, START_ZOOM)

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
    }).addTo(this._map)

    this._iconLayer = new L.LayerGroup()
    this._map.addLayer(this._iconLayer)

    this.drawMap()
  },
  updated() {
    this.drawMap()
  },
  methods: {
    drawMap() {
      this._icon = L.icon({
        iconUrl: this.harbor.type === "cruise" ? cruiseIcon : portIcon,
        iconSize: [25, 25],
        iconAnchor: [25, 25]
        // popupAnchor: [50, -25],
      })

      this._iconLayer.clearLayers()
      const marker = L.marker([this.harbor.latitude, this.harbor.longitude], {
        icon: this._icon
      })
      this._iconLayer.addLayer(marker)

      this._map.panTo({ lat: this.harbor.latitude, lng: this.harbor.longitude })
    }
  }
}
</script>

<style scoped>
.def {
  color: #ccc;
}
.map {
  height: 250px;
  margin: 0px;
  max-width: unset;
  width: 250px;
}
</style>
