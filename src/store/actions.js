const actions = {
  increment({ commit }) {
    commit("INCREMENT", 1)
  },
  asyncIncrement({ commit }) {
    commit("ASYNC_INCREMENT")
    setTimeout(() => {
      commit("INCREMENT", 1)
      commit("ASYNC_INCREMENT_SUCCESS")
    }, 2000)
  }
}

export default actions
