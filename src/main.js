import Vue from 'vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import Lodash from 'lodash'

import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, { theme: {
  primary: '#1976D2',
  secondary: '#2196F3',
  accent: colors.yellow.lighten1,
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107'
}})

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: "AIzaSyA98NHqb101v85tM5elcj375h2gah7ssDE",
  authDomain: "fantasy-lottery.firebaseapp.com",
  databaseURL: "https://fantasy-lottery.firebaseio.com",
  projectId: "fantasy-lottery",
  storageBucket: "fantasy-lottery.appspot.com",
  messagingSenderId: "140254757076"
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () { }
})
