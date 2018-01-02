<template>
  <v-container mt-0>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="secondary" extended>
            <v-toolbar-title slot="extension" class="white--text">Create League</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-form v-model="formValid">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name="season" 
                      label="Season"
                      id="season"
                      v-model="season"
                      v-bind:rules="seasonRules"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name="name"
                      label="Name"
                      id="name"
                      v-model="name"
                      v-bind:rules="nameRules"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name="owner"
                      label="Owner"
                      id="owner"
                      v-model="owner"
                      v-bind:rules="ownerRules"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name="email" 
                      label="Mail"
                      id="email"
                      v-model="email"
                      type="email"
                      v-bind:rules="emailRules"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row mt-3>
                  <v-flex xs12>
                     <v-btn flat color="primary" router to="/leagues">Cancel</v-btn>
                    <v-btn @click="onCreateLeague()" :disabled="!formValid" primary>Create</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar 
      :top="snackbarLocationTop"
      v-model="snackbar"
      :color="snackbarColor">
      {{ snackbarText }}
      <v-btn flat dark @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data () {
      return {
        formValid: false,
        season: '',
        seasonRules: [
          (v) => !!v || 'Season is required'
        ],
        name: '',
        nameRules: [
          (v) => !!v || 'Name is required'
        ],
        owner: '',
        ownerRules: [
          (v) => !!v || 'Owner is required'
        ],
        email: '',
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        snackbar: false,
        snackbarColor: '',
        snackbarText: '',
        snackbarLocationTop: true
      }
    },
  
    methods: {
      onCreateLeague() {
        let data = {
          season: this.season,
          name: this.name,
          owner: this.owner,
          email: this.email
        };
        
        // add league
        let user = this.$store.state.user
        let leagueKey = firebase.database().ref('/users/' + user.uid + '/leagues').push(data).key

        // show leagues component
        this.$router.push('/leagues')
      }
    }
  }
</script>