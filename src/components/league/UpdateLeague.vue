<template>
  <v-container mt-0>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="secondary" extended>
            <v-toolbar-title slot="extension" class="white--text">Update League</v-toolbar-title>
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
                <v-layout row>
                  <v-flex xs12>
                    <v-select
                      v-bind:items="typeItems"
                      v-model="lotteryType"
                      label="Lottery Type"
                      single-line
                      v-bind:rules="typeRules"
                      bottom
                      required></v-select>
                  </v-flex>
                </v-layout>
                <v-layout row mt-3>
                  <v-flex xs12>
                    <v-btn flat color="primary" @click="onCancel()">Cancel</v-btn>
                    <v-btn @click="onUpdateLeague()" :disabled="!formValid" :loading="loading" primary>Update</v-btn>
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
        loading: false,
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
        lotteryType: '',
        typeItems: [ 
          { text: 'Straight - Each team gets one ball', value: 'S' }, 
          { text: 'Weighted - Number of balls per team = previous finish', value: 'W' },
          { text: 'Heavily Weighted - Number of balls per team = previous finish squared', value: 'H' }
        ],
        typeRules: [
          (v) => !!v || 'Lottery Type is required'
        ],
        snackbar: false,
        snackbarColor: '',
        snackbarText: '',
        snackbarLocationTop: true
      }
    },
    created() {
      let user = this.$store.state.user
      let leagueRef = firebase.database().ref('/users/' + user.uid + '/leagues/' + this.$route.params.id)
      leagueRef.on('value', 
        data => {
          this.season = data.val().season,
          this.name = data.val().name,
          this.owner = data.val().owner,
          this.email = data.val().email,
          this.lotteryType = data.val().lotteryType
        }
      )
    },
    methods: {
      onCancel() {
        this.$router.push('/league/' + this.$route.params.id)
      },
      onUpdateLeague() {
        this.loading = true;

        let data = {
          season: this.season,
          name: this.name,
          owner: this.owner,
          email: this.email,
          lotteryType: this.lotteryType
        };
        
        // update league data
        let user = this.$store.state.user
        firebase.database().ref('/users/' + user.uid + '/leagues/' + this.$route.params.id)
          .set(data)
          .then(
            data => {
              this.loading = false
              this.$router.push('/league/' + this.$route.params.id)
            }
          )
          .catch(
            err => {
              this.snackbar = true
              this.snackbarColor = 'error'
              this.snackbarText = err.message
            }
          )
      }
    }
  }
</script>