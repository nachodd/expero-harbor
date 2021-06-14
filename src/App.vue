<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark" fixed="top">
      <b-container fluid class="nav">
        <b-button variant="outline" @click="toggleSidebar">
          <span class="navbar-toggler-icon"></span>
        </b-button>
        &nbsp; &nbsp; &nbsp;
        <b-navbar-brand tag="span">
          <b-input-group size="sm">
            <b-input-group-prepend>
              <b-button text="🔎" variant="primary">🔎</b-button>
            </b-input-group-prepend>
            <b-form-input size="sm" class="search-input" placeholder="Search Ports..." />
          </b-input-group>
        </b-navbar-brand>
      </b-container>
    </b-navbar>
    <div class="wrapper">
      <Sidebar :opened="sidebarClosed" />
      <div class="content" :class="{ active: sidebarClosed }">
        <router-view :key="$route.path" />
      </div>
    </div>
  </div>
</template>

<script>
// import PortMap from "@/components/PortMap"
import Sidebar from "@/components/Sidebar.vue"
import { sync } from "vuex-pathify"

export default {
  name: "Home",
  components: {
    Sidebar
  },
  computed: {
    sidebarClosed: sync("sidebarClosed")
  },
  methods: {
    toggleSidebar() {
      this.sidebarClosed = !this.sidebarClosed

      // this.$refs.portmap.sidebarToggled()
    }
  }
}
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.nav {
  justify-content: flex-start;
}

.wrapper {
  display: flex;
  width: 100%;
}

.content {
  width: calc(100% - 290px);
  min-height: calc(100vh - 56px);
  transition: all 0.3s;
  position: absolute;
  top: 56px;
  bottom: 100px;
  right: 0;
}

.content.active {
  width: 100%;
}

@media (max-width: 768px) {
  .content {
    width: 100%;
  }
  .content.active {
    width: calc(100% - 290px);
  }
  /* #sidebarCollapse span {
    display: none;
  } */
}
.list-group-item.active {
  z-index: 2;
  color: #117888;
  background-color: #bbeff7;
  border-color: #fff;
}
.search-input::placeholder {
  color: #ccc;
  font-style: italic;
}
</style>
