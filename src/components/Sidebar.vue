<template>
  <div class="sidebar bg-dark" :class="{ active: opened }">
    <div class="accordion" role="tablist">
      <div class="controls">
        <div class="controls__cruise">
          <b-form-checkbox name="check-cruise" v-model="showCruise" switch size="lg">
            <img
              src="../assets/icons/icons8-crucero-48.png"
              class="controls__icon"
              alt="Cruise Ship Ports"
            />
            <span class="controls__label">Cruise Ship Ports</span>
          </b-form-checkbox>
        </div>
        <div class="controls__cargo">
          <b-form-checkbox name="check-cargo" v-model="showCargo" switch size="lg">
            <img
              src="../assets/icons/icons8-port-48.png"
              class="controls__icon"
              alt="Cargo Ports"
            />
            <span class="controls__label">Cargo Ports</span>
          </b-form-checkbox>
        </div>
      </div>
      <div class="cards__container" ref="cards">
        <div
          v-for="(harbor, i) in cargoAndCruisesFiltered"
          :class="['harbor__card', { selected: isSelected(harbor) }]"
          :key="`harbor_${harbor.id}_${i}`"
          @click="selectHarbor(harbor)"
          :data-id="harbor.id"
        >
          <img class="harbor__icon" :src="getIcon(harbor.type)" />
          <span class="harbor__text">{{ harbor.name }}</span>
          <span
            class="harbor__icon-container"
            title="Open detail..."
            @click.stop="redirect(harbor)"
          >
            <img
              class="harbor__icon harbor__icon-detail"
              src="../assets/icons/icons8-zoom-in-64.png"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, sync } from "vuex-pathify"
import cruiseIcon from "@/assets/icons/icons8-crucero-48.png"
import portIcon from "@/assets/icons/icons8-port-48.png"

export default {
  name: "sidebar",
  props: {
    opened: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    cargoAndCruisesFiltered: get("cargoAndCruisesFiltered"),
    showCruise: sync("showCruise"),
    showCargo: sync("showCargo"),
    harborSelected: sync("harborSelected")
  },
  watch: {
    harborSelected(h) {
      if (h && h.id) {
        const element = document.querySelector(`[data-id='${h.id}']`)

        element && element.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" })
      }
    }
  },
  methods: {
    isSelected(harbor) {
      if (!this.harborSelected) {
        return false
      }
      return harbor.id === this.harborSelected.id
    },
    getIcon(type) {
      return type === "cruise" ? cruiseIcon : portIcon
    },
    selectHarbor(harbor) {
      // If it is on detail view and click on the list, REDIRECT
      if (this.$route.name === "Detail") {
        this.redirect(harbor)
        return
      }
      this.harborSelected = harbor
    },
    redirect(harbor) {
      this.harborSelected = harbor
      this.$router.push(`/${this.harborSelected.id}`).catch(e => e)
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 290px;
  position: fixed;
  top: 56px;
  bottom: 100px;
  left: 0;
  height: calc(100vh - 56px);
  z-index: 999;
  box-shadow: 0px 0px 5px #17a2b8;
  transition: all 0.3s;
  overflow: auto;
}
.sidebar:before {
  transition: 0.3 all ease-in-out;
  position: fixed;
  z-index: 1000;
  height: 20px;
  width: 282px;
  top: 56px;
  left: 0;
  content: "";
  background: linear-gradient(
    180deg,
    rgba(52, 58, 64, 1) 0%,
    rgba(52, 58, 64, 0.8) 25%,
    rgba(52, 58, 64, 0) 100%
  );
}
.sidebar:after {
  transition: 0.3 all ease-in-out;
  position: fixed;
  z-index: 1000;
  height: 20px;
  width: 282px;
  bottom: 0;
  left: 0;
  content: "";
  background: linear-gradient(
    0deg,
    rgba(52, 58, 64, 1) 0%,
    rgba(52, 58, 64, 0.8) 25%,
    rgba(52, 58, 64, 0) 100%
  );
}
.sidebar.active:before,
.sidebar.active:after {
  width: 0;
}
.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgb(169, 169, 169, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: rgb(169, 169, 169, 0.5);
  border-radius: 8px;
}
.sidebar.active {
  margin-left: -290px;
}
.controls {
  text-align: left;
  margin-left: 15px;
  margin-top: 15px;
}
.controls > div {
  padding: 5px;
}
.harbor__icon,
.controls .controls__icon {
  width: 25px;
  height: auto;
}
.controls .controls__label {
  font-size: 13px;
  font-weight: bold;
  color: #fff;
}
.cards__container {
  padding-bottom: 10px;
}
.harbor__card {
  border: 2px solid #ccc;
  padding: 5px;
  border-radius: 5px;
  margin: 8px;
  background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
  /* background: #fff; */
  text-align: left;
  font-size: 14px;

  transition: all 0.3s;
  display: flex;
  align-items: center;
  max-height: 49px;
  font-weight: bold;
}

.harbor__card:hover,
.harbor__card.selected {
  cursor: pointer;
  border: 3px solid #aaa;
  /* background-color: var(--primary); */
  /* color: #fff; */
  background-image: linear-gradient(to bottom, #cfd9df 0%, #e2ebf0 100%);
}
.harbor__card.selected {
  border-color: var(--primary);
  background-image: none;
  background-color: var(--primary);
}

.harbor__card:hover .harbor__icon-detail,
.harbor__card.selected .harbor__icon-detail {
  /* display: flex; */
  opacity: 1;
  transition: 0.3s all ease-in;
}

.harbor__icon {
  margin: 5px;
}
.harbor__icon-detail {
  /* display: none; */
  filter: drop-shadow(0 0 0 #222);
  opacity: 0;
}
.harbor__icon-detail:hover {
  transition: 0.3s all ease-in;
  filter: drop-shadow(3px 3px 3px #222);
  transform: scale(1.1, 1.1);
}
.harbor__icon-container {
  /* padding: 5px; */
}
.harbor__text {
  flex-grow: 1;
}

@media (max-width: 768px) {
  .sidebar {
    margin-left: -290px;
  }
  .sidebar.active {
    margin-left: 0;
  }
}
</style>
