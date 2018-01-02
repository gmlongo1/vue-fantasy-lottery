<template>
  <v-container mt-0>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="secondary" extended>
            <v-toolbar-title slot="extension" class="white--text">Sign In</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-form v-model="formValid">
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
                    <v-text-field 
                      name="password"
                      label="Password"
                      id="password"
                      v-model="password"
                      type="password"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn @click="onSignin()" :disabled="!formValid">Sign In</v-btn>
                    <v-btn class="red accent-4" dark @click="onGoogleSignin()"><v-icon left>mdi-google</v-icon>Sign In With Google</v-btn>
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
        email: '',
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        password: '',
        snackbar: false,
        snackbarColor: '',
        snackbarText: '',
        snackbarLocationTop: true
      }
    },
    methods: {
      onSignin() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              console.log("User", user)
              this.$store.dispatch('setUser', user)
              this.$router.push('/leagues')
            }
          )
          .catch(
            err => {
              this.snackbar = true
              this.snackbarColor = 'error'
              this.snackbarText = err.message
            }
          )
      },

      onGoogleSignin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
          .then(
            result => {
              // This gives you a Google Access Token. You can use it to access the Google API.
              var token = result.credential.accessToken

              // The signed-in user info.
              var user = result.user
              console.log("User", user)

              this.$store.dispatch('setUser', user)
              this.$router.push('/leagues')
            }
        )
        .catch(
          error => {
            // Handle Errors here.
            var errorCode = error.code
            var errorMessage = error.message
            // The email of the user's account used.
            var email = error.email
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential

            this.snackbar = true
            this.snackbarColor = 'error'
            this.snackbarText = errorMessage
          }
        )
      }
    }
  }
</script>