<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="secondary">          
            <v-toolbar-title slot="extension" class="white--text">
              {{ name }}
            </v-toolbar-title>
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
                    <v-select
                      v-bind:items="typeItems"
                      v-model="lotteryType"
                      label="Lottery Type"
                      single-line
                      bottom
                      disabled></v-select>
                  </v-flex>
                </v-layout>
              <v-layout row>
                <v-flex xs12 text-xs-right>
                  <v-btn color="primary" flat @click="onEditLeague()" class="mt-0 mr-0"><v-icon left>mdi-pencil</v-icon>Edit</v-btn>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row mt-3>
                <v-flex xs12>
                  <h3>Teams (in order of previous finish)</span></h3>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-list two-line subheader>
                    <v-list-tile avatar v-for="team in teams" v-bind:key="team.name">
                      <v-avatar>
                        <span class="icon white--text secondary">{{ team.previousFinish }}</span>
                      </v-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ team.name }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ team.owner }} &lt;{{ team.email }} &gt;</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 text-xs-right mt-0>
                  <v-btn color="primary" flat @click="onEditTeams()" class="mt-0 mr-0"><v-icon left>mdi-pencil</v-icon>Edit</v-btn>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row mt-2>
                <v-flex xs6 text-xs-center>
                  <v-btn flat color="primary" router to="/leagues">Cancel</v-btn>
                </v-flex>
                <v-flex xs12 s6 text-xs-center>
                  <v-btn class="red accent-4" round dark @click="onGenerateOrder()">Generate Order</v-btn>
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
        season: '',
        name: '',
        owner: '',
        email: '',
        lotteryType: '',
        typeItems: [ 
          { text: 'Straight - Each team gets one ball', value: 'S' }, 
          { text: 'Weighted - Number of balls per team = previous finish', value: 'W' },
          { text: 'Heavily Weighted - Number of balls per team = previous finish squared', value: 'H' }
        ],
        teams: []
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
              previousFinish: val.previousFinish
            }
          )
        }
      )

      this.teams.sort(
        (a, b) => { 
          if (a.previousFinish < b.previousFinish)
            return -1
          if (a.previousFinish > b.previousFinish)
            return 1
          return 0
        }
      )
    },
    methods: {
      onEditLeague(league) {
        this.$router.push('/league/' + this.$route.params.id + '/edit')
      },
      onEditTeams(league) {
        this.$router.push('/league/' + this.$route.params.id + '/teams')
      },
      onGenerateOrder() {
        let user = this.$store.state.user
        
        let pool = []
        for (var i = 0; i < this.teams.length; i++) {
          let team = this.teams[i]
          // should never happen
          if (team.previousFinish == 0 || team.previousFinish == "")
            team.previousFinish = 1

          // TODO: allow league setting or weight - random, inverse of finish, weighted inverse of finish
          // the number of entries in lottery pool is determined by taking the square of the previous finish
          let num = 1
          if (this.lotteryType == "H") {
            num = team.previousFinish * team.previousFinish
          } else if (this.lotteryType == "W") {
            num = team.previousFinish
          }

          for (var j = 0; j < num; j++) {
            pool.push(team)
          }
        }
        //console.log("pool", pool);
        let counter = 1
        while(pool.length > 0) {
          let index = this.getRandomInt(0, pool.length)
          let selectedTeam = pool[index]
          selectedTeam.draftOrder = counter++
          let data = {
            draftOrder: selectedTeam.draftOrder
          }
          firebase.database().ref('/users/' + user.uid + '/teams/' + selectedTeam.key).update(data)
          
          this.removeAllItemsForTeam(pool, selectedTeam)
        }

        this.$router.push('/league/' + this.$route.params.id + '/results')
      },
      getRandomInt(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
      },
      removeAllItemsForTeam(pool, team) {
        for (var k = pool.length - 1; k >= 0; k--) {
            if (pool[k] == team) { 
                pool.splice(k, 1)
            }
        }
      }
    }
  }
</script>