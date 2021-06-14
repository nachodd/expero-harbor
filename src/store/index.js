import Vue from "vue"
import Vuex from "vuex"
import pathify from "vuex-pathify"

// import actions from "./actions"
// import getters from "./getters"
// import mutations from "./mutations"
// import state from "./state"

import { make } from "vuex-pathify"

Vue.use(Vuex)

const state = () => ({
  sidebarClosed: false,
  pc: [],
  harborSelected: null,
  showCruise: true,
  showCargo: true
})

const getters = {
  ...make.getters(state),
  cargoAndCruisesFiltered: (state, getters) => {
    // const typesAllowed = []
    // if (state.showCruise) typesAllowed.push("cruise")
    // if (state.showCargo) typesAllowed.push("port")
    const typesAllowed = getters.cargoAndCruisesShowed

    return state.pc.filter(el => typesAllowed.includes(el.type))
  },
  cargoAndCruisesShowed: state => {
    const typesAllowed = []
    if (state.showCruise) typesAllowed.push("cruise")
    if (state.showCargo) typesAllowed.push("port")

    return typesAllowed
  }
}
const mutations = {
  ...make.mutations(state),
  addPC: (state, payload) => {
    state.pc.push(...payload)
  },
  clearPC: state => {
    state.pc = []
  }
}
const actions = {
  ...make.actions(state),
  addPC(ctx, payload) {
    ctx.commit("addPC", payload)
  },
  clearPC(ctx) {
    ctx.commit("clearPC")
  }
}

const store = new Vuex.Store({
  plugins: [pathify.plugin],
  state,
  getters,
  actions,
  mutations
})

export default store
