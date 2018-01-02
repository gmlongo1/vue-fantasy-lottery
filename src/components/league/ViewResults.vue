<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="secondary" extended>
            <v-toolbar-title slot="extension" class="white--text">{{ name }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field 
                      name="season"
                      label="Season"
                      id="season"
                      v-model="season"
                      disabled></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field 
                      name="owner"
                      label="Owner"
                      id="owner"
                      v-model="owner"
                      disabled></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field 
                      name="email"
                      label="Mail"
                      id="email"
                      v-model="email"
                      disabled></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <h3>Generated Draft Order</h3>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-list two-line subheader>
                    <transition-group name="list" tag="p">
                      <v-list-tile avatar v-for="team in teams" v-bind:key="team.name" class="list-item">
                        <v-avatar>
                          <span class="icon white--text secondary">{{ team.draftOrder }}</span>
                        </v-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ team.name }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ team.owner }} &lt;{{ team.email }}&gt;</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </transition-group>
                  </v-list>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row mt-2>
                <v-flex xs6 text-xs-center>
                  <v-btn flat color="primary" @click="onCancel()">Cancel</v-btn>
                </v-flex>
                <v-flex xs12 s6 text-xs-center>
                  <v-btn class="red accent-4" round dark @click="onEmailResults()">Email Results</v-btn>
                </v-flex>
              </v-layout>
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
    data () {
      return {
        name: '',
        season: '',
        owner: '',
        email: '',
        teams: []
      }
    },
    mounted() {
      let user = this.$store.state.user
      let leagueRef = firebase.database().ref('/users/' + user.uid + '/leagues/' + this.$route.params.id)
      leagueRef.on('value', 
        data => {
          this.name = data.val().name,
          this.season = data.val().season,
          this.owner = data.val().owner,
          this.email = data.val().email
        }
      )

      let teamsRef = firebase.database().ref('/users/' + user.uid + '/teams').orderByChild('leagueId').equalTo(this.$route.params.id);
      
      teamsRef.on('child_added',
        data => {
          let val = data.val()
          this.teams.push(
            {
              key: data.key,
              name: val.name,
              email: val.email,
              owner: val.owner,
              previousFinish: val.previousFinish,
              draftOrder: val.draftOrder
            }
          )
        }
      )

      this.teams.sort(
        (a, b) => { 
          if (a.draftOrder < b.draftOrder)
            return -1
          if (a.draftOrder > b.draftOrder)
            return 1
          return 0
        }
      )
    },
    methods: {
      onCancel() {
        this.$router.push('/league/' + this.$route.params.id)
      },
      onEmailResults() {
      }
    }
  }
</script>