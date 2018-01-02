<template>
  <v-app>
    <v-toolbar class="primary" dark>
      <v-toolbar-side-icon 
        @click.stop="sideNav = !sideNav"
        class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor:pointer; font-family: 'verdana'"><span>fantasy</span><span style="color: #82C1F2">draft</span><span>lottery</span></router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only mr-0" >
        <v-btn v-for="item in menuItems"
          flat
          router
          :to="item.link"
          :key="item.title">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn flat v-if="user != null && user.photoURL != null" 
          router
          to="/profile">
          <v-avatar>
              <img :src="user.photoURL" alt="">
          </v-avatar>
        </v-btn>
        <v-btn v-else-if="user"
          flat
          router
          to="/profile">
          <v-icon>account_circle</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer v-model="sideNav" temporary absolute>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0" v-if="user != null">
          <v-list-tile avatar router to="/profile">
            <v-list-tile-avatar>
              <img v-if="user.photoURL" :src="user.photoURL" />
              <v-icon v-else>account_circle</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ user.displayName ?  user.displayName : user.email }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-divider></v-divider>
        <v-list-tile 
          v-for="item in menuItems" 
          v-bind:key="item.title"
          router
          v-bind:to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <main>
      <router-view></router-view>
    </main>

    <v-footer class="pa-3">
      <v-spacer></v-spacer>
      <div>© {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      menuItems() {
        if (this.$store.state.user != null) {
          return [
            { icon: 'list', title: 'View Leagues', link: '/leagues'},
            { icon: 'playlist_add', title: 'Create League', link: '/league/new'}
          ]
        } else {
          return [
            { icon: 'face', title: 'Sign Up', link: '/signup'},
            { icon: 'lock_open', title: 'Sign In', link: '/signin'}
          ]
        }
      }
    }
  }
</script>
