const mutations = {
  INCREMENT(state, payload) {
    state.counter += payload
  },
  ASYNC_INCREMENT(state) {
    state.incrementing = true
  },
  ASYNC_INCREMENT_SUCCESS(state) {
    state.incrementing = false
  }
}

export default mutations
