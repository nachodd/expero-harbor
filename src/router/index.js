import Vue from "vue"
import Router from "vue-router"
import Home from "@/views/Home"
import Detail from "@/views/Detail"

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/:id",
      name: "Detail",
      component: Detail
    }
  ]
})
