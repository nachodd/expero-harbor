<template>
  <div class="portmap--root"></div>
</template>
<script>
/* eslint-disable vue/no-reserved-keys */
import L from "leaflet"
import uniqueId from "lodash/uniqueId"
import ApiService from "@/services/api.service"
import { initMap } from "@/utils/map"
import cruiseIcon from "@/assets/icons/icons8-crucero-48.png"
import portIcon from "@/assets/icons/icons8-port-48.png"
import detailIcon from "@/assets/icons/icons8-zoom-in-64.png"

import { sync, call, get } from "vuex-pathify"

const LAYER_DEFS = [
  { type: "port", icon: portIcon, name: "Ports" },
  { type: "cruise", icon: cruiseIcon, name: "Cruises" }
]

export default {
  data() {
    return {
      _map: null,
      _icons: null,
      _iconLayers: null,
      harborMarkers: [],
      justSelected: false,
      lastHarborId: null
    }
  },
  computed: {
    pc: get("pc"),
    cargoAndCruisesFiltered: get("cargoAndCruisesFiltered"),
    cargoAndCruisesShowed: get("cargoAndCruisesShowed"),
    harborSelected: sync("harborSelected"),
    sidebarClosed: get("sidebarClosed")
  },
  watch: {
    cargoAndCruisesShowed(nv) {
      this.filterHarbors(nv)
    },
    harborSelected(harbor) {
      if (this.justSelected === false && harbor) {
        const { marker } = this.harborMarkers.find(hm => hm.harborId === harbor.id)
        marker && marker.openPopup()
      }
      this.justSelected = false
    },

    sidebarClosed() {
      this.sidebarToggled()
    }
  },
  methods: {
    addPC: call("addPC"),
    clearPC: call("clearPC"),
    async requestData(bounds, def) {
      const response = await ApiService.getHarbors({
        portType: def.type,
        minlat: bounds._southWest.lat,
        minlon: bounds._southWest.lng,
        maxlat: bounds._northEast.lat,
        maxlon: bounds._northEast.lng
      })

      const data = await response.json()
      return data.ports
    },
    createMarker(harbor, icon) {
      const name = harbor.name || "[NO NAME]"
      return L.marker([harbor.latitude, harbor.longitude], {
        icon: icon
      }).bindPopup(`<b>${name}</b><br>
        <img src="${detailIcon}" class="popup-icon" />
        <a href="#">View details</a>`)
    },
    redirect() {
      this.$router.push(`/${this.harborSelected.id}`).catch(e => e)
      // console.log("HOLA!", harborId)
    },
    renderHarbors(harbors, icon, layer) {
      layer.clearLayers()
      // this.harborMarkers = {}
      for (const harbor of harbors) {
        if (this.cargoAndCruisesShowed.includes(harbor.type)) {
          const marker = this.createMarker(harbor, icon)
          // this.harborMarkers[harbor.id] = marker
          this.harborMarkers.push({
            harborId: harbor.id,
            marker
          })
          layer.addLayer(marker)

          // FIX: When selectig habor that are on borders, map is moved an recalcuilated
          // Because of this, the popup are closed. So, with this, the popup it's opened again
          if (this.lastHarborId === harbor.id) {
            marker.openPopup()
          }
        }
      }
    },
    getIconAndLayer(type) {
      const { icon } = this._icons.find(i => i.type === type)
      const { layer } = this._iconLayers.find(i => i.type === type)
      return { icon, layer }
    },

    filterHarbors(harborsToRender) {
      // Remove all the layers
      this._iconLayers.forEach(({ layer }) => {
        layer.clearLayers()
      })

      for (const harbor of this.cargoAndCruisesFiltered) {
        const { icon, layer } = this.getIconAndLayer(harbor.type)
        layer.addLayer(this.createMarker(harbor, icon))
      }
    },

    loadLayerData(bounds) {
      const requestId = (this._requestId = uniqueId())
      // this.pc = []
      this.clearPC()
      this.harborMarkers = []
      LAYER_DEFS.forEach(async (def, i) => {
        try {
          const harbors = await this.requestData(bounds, def)
          this.addPC(harbors)

          // check that our request is not stale
          if (requestId === this._requestId) {
            // put this data into the map
            const { icon, layer } = this.getIconAndLayer(def.type)
            this.renderHarbors(harbors, icon, layer)
          }
        } catch (e) {
          console.log("error loading data", e)
        }
      })
    },
    sidebarToggled() {
      const that = this
      // wait for the animation to finish, then re-paint map based on the new size.
      setTimeout(() => {
        that._map.invalidateSize()
      }, 400)
    }
  },
  mounted() {
    this.harborSelected = null
    this._map = initMap(this.$el, 28.913943, -94.131125)

    // Add the port/cruise layers
    // WRAP ICONS AND LAYER INTO OBJECTS SO IT'S EASIER TO FIND THEM.
    this._icons = LAYER_DEFS.map(def => ({
      type: def.type,
      icon: L.icon({
        iconUrl: def.icon,
        iconSize: [25, 25],
        iconAnchor: [25, 25],
        popupAnchor: [50, -25],
        className: "marker-background"
      })
    }))
    this._iconLayers = LAYER_DEFS.map(def => ({
      type: def.type,
      layer: new L.LayerGroup()
    }))
    this._iconLayers.forEach(il => this._map.addLayer(il.layer))

    // Whenever the user pans, load data for the new bounds
    this._map.on("moveend", () => this.loadLayerData(this._map.getBounds()))
    this._map.on("popupopen", e => {
      const markerSelectedLatLng = e.popup._source._latlng

      const harborAndMarker = this.harborMarkers.find(hm => {
        return (
          hm.marker._latlng.lat === markerSelectedLatLng.lat &&
          hm.marker._latlng.lng === markerSelectedLatLng.lng
        )
      })
      this.justSelected = true
      this.harborSelected = this.pc.find(h => h.id === harborAndMarker.harborId)
      this.lastHarborId = this.harborSelected.id
      // HACK for reacting to popup anchor click
      if (e.popup) {
        e.popup._wrapper.querySelector("a").addEventListener("click", this.redirect)
      }
    })
    this._map.on("popupclose", e => {
      this.harborSelected = null
      if (e.popup) {
        e.popup._wrapper.querySelector("a").removeEventListener("click", this.redirect)
      }
    })

    this.loadLayerData(this._map.getBounds())
  }
}
</script>

<style>
.portmap--root {
  width: 100%;
  height: 100%;
  margin: 0;
  max-width: unset;
  width: auto;
}

.portmap--root .leaflet-popup-content-wrapper {
  background: #fff;
  font-size: 12px;
  border-radius: 3px;
  box-shadow: 0px 0px 6px 3px rgba(0, 0, 0, 0.67);
  background: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
}
.portmap--root .leaflet-popup-content-wrapper .leaflet-popup-content {
  margin: 12px;
}
.portmap--root .leaflet-popup-content-wrapper a {
  color: var(--primary);
  text-decoration: none;
}
.portmap--root .leaflet-popup-tip-container {
  display: none;
}

.popup-icon {
  width: 15px;
  height: auto;
}
</style>
