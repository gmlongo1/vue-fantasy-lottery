<template>
  <v-container mt-0>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="secondary" extended>
            <v-btn
              fab
              small
              class="accent"
              bottom
              left
              absolute
              router 
              to="/league/new"
              title="Create League"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <v-toolbar-title slot="extension" class="white--text">Leagues</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container pa-0>
              <v-layout row>
                <v-flex xs12>
                  <v-list two-line subheader>
                    <template v-for="(league, index) in leagues">
                      <v-list-tile avatar  @click="onLeagueClick(league)" :key="league.name">
                        <v-avatar>
                          <span class="icon white--text secondary">{{league.name.charAt(0)}}</span>
                        </v-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ league.name }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ league.owner }} &lt;{{ league.email }} &gt;</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-list-tile-action-text class="mt-2">{{ league.season }}</v-list-tile-action-text>
                          <v-btn icon ripple @click.native.stop="onLeagueDeleteClick(league)" title="Delete League">
                            <v-icon color="grey lighten-1">delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-divider v-if="index + 1 < leagues.length" :key="league.name"></v-divider>
                    </template>
                  </v-list>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>  
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="dialog" persistent max-width="320">
      <v-card>
        <v-card-title class="headline">Delete league?</v-card-title>
        <v-card-text>Are you sure you wish to delete this league?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="onDialogCancel()">No</v-btn>
          <v-btn color="green darken-1" flat @click.native="onLeagueDelete()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import firebase from 'firebase'
  
  export default {
    data() {
      return {
        dialog: false,
        selectedLeague: null,
        leagues: []
      }
    },
    created() {
      let user = this.$store.state.user
      let leagueRef = firebase.database().ref('/users/' + user.uid + '/leagues')
      /*leagueRef.on('value', 
        snapshot => {
          console.log("Leagues: ", snapshot.toJSON())
          this.leagues = snapshot.val()
        }
      )
      */

      leagueRef.on('child_added',
        data => {
          let val = data.val()
          this.leagues.push(
            {
              key: data.key,
              name: val.name,
              email: val.email,
              owner: val.owner,
              season: val.season,
              color: val.color
            }
          )
        }
      )

      leagueRef.on('child_removed',
        data => {
          this.leagues = this.leagues.filter(e => e.key !== data.key);
        }
      )

      leagueRef.on('child_changed',
        data => {
          console.log("changed")
          for (let i = 0; i< this.leagues.length; i++) {
            if (this.leagues[i].key == data.key) {
              let val = data.val()
              let newData = {
                key: data.key,
                name: val.name,
                email: val.email,
                owner: val.owner,
                season: val.season,
                color: val.color
              }
              this.$set(this.leagues, i, newData)
            }
          }
          //console.log(this.leagues)
        }
      )
    },

    methods: {
      leagueStyle(league) {
        return league.color
      },

      onLeagueClick(league) {
        this.$router.push('/league/' + league.key)
      },

      onLeagueDeleteClick(league) {
        this.selectedLeague = league
        this.dialog = true;
      },

      onLeagueDelete() {
        if (this.selectedLeague != null) {
          let user = this.$store.state.user
          firebase.database().ref('/users/' + user.uid + '/leagues').child(this.selectedLeague.key).remove()
          this.selectedLeague = null
          this.dialog = false
        }
      },

      onDialogCancel() {
        this.selectedLeague = null
        this.dialog = false
      }
    }
  }
</script>