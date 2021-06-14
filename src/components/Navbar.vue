<template>
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
</template>

<script>
import { sync } from "vuex-pathify"
export default {
  name: "navbar",
  computed: {
    sidebarClosed: sync("sidebarClosed")
  },
  methods: {
    toggleSidebar() {
      this.sidebarClosed = !this.sidebarClosed
    }
  }
}
</script>

<style scoped>
.nav {
  justify-content: flex-start;
}
</style>
