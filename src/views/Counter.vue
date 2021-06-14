<template>
  <div class="counter">
    <div class="state">Counter: {{ counter }}</div>
    <div class="actions">
      <button class="btn btn-primary" @click="increment">Increment</button>
      <button class="btn btn-primary" @click="asyncIncrement">Async Increment</button>
    </div>
    <div class="status">
      <div>Incrementing: {{ incrementing }}</div>
      <div>Not Incrementing: {{ notIncrementing }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  name: "App",
  computed: {
    ...mapGetters(["incrementing", "counter"]),
    notIncrementing() {
      return !this.incrementing
    }
  },
  methods: {
    ...mapActions(["increment", "asyncIncrement"])
  }
}
</script>

<style scoped>
.counter {
  margin: 50px 0;
}
button + button {
  margin-left: 10px;
}

.state,
.actions {
  margin-bottom: 20px;
}
</style>
