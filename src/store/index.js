import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tagsView from './modules/tagsView'
import routeDailytable from './modules/routeDailytable'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    tagsView,
    routeDailytable
  },
  getters
})

export default store
