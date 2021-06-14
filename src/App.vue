<template>
  <div id="app">
    <Navbar />
    <div class="wrapper">
      <Sidebar :opened="sidebarClosed" />
      <div class="content" :class="{ active: sidebarClosed }">
        <router-view :key="$route.path" />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue"
import Navbar from "@/components/Navbar.vue"
import { get } from "vuex-pathify"

export default {
  name: "Home",
  components: {
    Sidebar,
    Navbar
  },
  computed: {
    sidebarClosed: get("sidebarClosed")
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
  background-color: #cfd9df;
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
}

.search-input::placeholder {
  color: #ccc;
  font-style: italic;
}
</style>
