import Vue from 'vue'
import Vuex from 'vuex'
import plugins from './plugins.js'
import classroomManagement from './modules/classroomManagement.js'

const state = {
  defaultState: 'defaultState'
};

const commonStore = {
  state,
  mutations: {},
  actions: {},
  getters: {}
};

Vue.use(Vuex);

export default new Vuex.Store({
  ...commonStore,
  // strict: process.env.NODE_ENV !== 'production',
  strict: false,
  plugins,
  modules: {
    classroomManagement
  }
})
