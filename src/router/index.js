import Vue from 'vue'
import Router from 'vue-router'
import * as firebase from 'firebase'
import Home from '@/components/Home'
import Leagues from '@/components/league/Leagues'
import CreateLeague from '@/components/league/CreateLeague'
import UpdateLeague from '@/components/league/UpdateLeague'
import ViewLeague from '@/components/league/ViewLeague'
import ViewResults from '@/components/league/ViewResults'
import UpdateTeams from '@/components/league/UpdateTeams'
import UpdateTeam from '@/components/league/UpdateTeam'
import CreateTeam from '@/components/league/CreateTeam'

import Profile from '@/components/user/Profile'
import Signin from '@/components/user/Signin'
import Signup from '@/components/user/Signup'

import { store } from '../store'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/leagues',
      name: 'Leagues',
      component: Leagues,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/league/new',
      name: 'CreateLeague',
      component: CreateLeague,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/league/:id',
      name: 'ViewLeague',
      component: ViewLeague,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/league/:id/results',
      name: 'ViewResults',
      component: ViewResults,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/league/:id/edit',
      name: 'UpdateLeague',
      component: UpdateLeague,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/league/:id/teams',
      name: 'UpdateTeams',
      component: UpdateTeams,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/team/:id/edit',
      name: 'UpdateTeam',
      component: UpdateTeam,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/league/:id/teams/new',
      name: 'CreateTeam',
      component: CreateTeam,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  // check for current user in vuex
  let currentUser = store.getters.user
  if (currentUser) {
    next()
  } else {
    // check firebase to see if user is authenticated
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        store.dispatch("setUser", user)
        next()
      } else {
        // no user
        let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

        if (requiresAuth) {
          next('signin')
        } else {
          next()
        }
      }
    })
  }
})

export default router