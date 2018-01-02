<template>
  <v-container mt-0>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="secondary" extended>
            <v-toolbar-title slot="extension" class="white--text">Profile</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-form>
                <v-layout row v-if="user.displayName">
                  <v-flex xs12>
                    <v-text-field 
                        name="name"
                        label="Name"
                        id="name"
                        v-model="user.displayName"
                        disabled></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                        name="email"
                        label="Mail"
                        id="email"
                        v-model="user.email"
                        disabled></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn @click="onSignout()" class="mt-4" primary><v-icon left>mdi-logout</v-icon>Sign Out</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data() {
      return {}
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      onSignout() {
        firebase.auth().signOut().then(() => {
          // Sign-out successful.
          this.$store.dispatch('setUser', null)
          this.$router.push('/')
        }).catch(error => {
          // An error happened.
          console.log("Sign out error", error)
        });
      }
    }
  }
</script>