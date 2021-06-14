<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-sm-4 text-left" v-if="harbor">
        <h4><span class="text-primary">Port map</span> > {{ harborName }}</h4>

        <div class="mt-3">
          <h3>{{ harborName }}</h3>
          <div>
            🌎
            <a v-if="harbor.website" target="_blank" :href="'http://' + harbor.website">
              {{ harbor.website }}
            </a>
            <span v-else class="lack">[no website provided]</span>
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
    </div>
    <div class="row mt-5">
      <div class="col-sm-12 text-left">
        <router-link to="/"> &#8617; Back</router-link>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-reserved-keys */
import { get } from "vuex-pathify"
import { initMap } from "@/utils/map"
import cruiseIcon from "@/assets/icons/icons8-crucero-48.png"
import portIcon from "@/assets/icons/icons8-port-48.png"

export default {
  name: "Detail",
  data() {
    return {
      _map: null,
      _icon: null,
      _iconLayer: null,
      harbor: null
    }
  },
  computed: {
    // harbor: get("harborSelected"),
    pc: get("pc"),
    harborName() {
      return (this.harbor && this.harbor.name) || "[NO NAME]"
    },
    harborType() {
      return this.harbor && this.harbor.name.charAt(0).toUpperCase() + this.harbor.name.slice(1)
    }
  },
  mounted() {
    this.harbor = null
    if (!this.$route.params.id) {
      this.$router.replace("/")
      return
    }
    const id = this.$route.params.id
    const harbor = this.pc.find(h => Number(h.id) === Number(id))
    if (!harbor) {
      this.$router.replace("/")
      return
    }
    this.harbor = harbor

    this._map = initMap(this.$refs.map, this.harbor.latitude, this.harbor.longitude)

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
      })

      this._iconLayer.clearLayers()
      const marker = L.marker([this.harbor.latitude, this.harbor.longitude], {
        icon: this._icon
      })
      this._iconLayer.addLayer(marker)

      // Move the map
      this._map.panTo({ lat: this.harbor.latitude, lng: this.harbor.longitude })
    }
  }
}
</script>

<style scoped>
.def {
  color: #999;
  font-weight: bold;
}
.lack {
  font-style: italic;
}
.map {
  height: 300px;
  margin: 0px;
  max-width: unset;
  width: 300px;
  box-shadow: 0px 0px 6px 3px rgba(0, 0, 0, 0.67);
}
</style>
