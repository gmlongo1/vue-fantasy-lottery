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
              @click="onAddTeamClick()"
              title="Add Team"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <v-toolbar-title slot="extension" class="white--text">Update Teams</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container pa-0>
              <v-layout row>
                <v-flex xs12>
                  <v-list two-line subheader>
                    <draggable @end="onTeamsReorder" v-model="teams" :options="{ handle:'.drag-handle' }">
                      <v-list-tile avatar v-for="team in teams" v-bind:key="team.name" @click="onTeamClick(team)">
                        <v-icon class="drag-handle" title="Drag Team to Reorder">mdi-drag-vertical</v-icon>
                        <v-avatar>
                          <span class="icon white--text secondary">{{ team.previousFinish }}</span>
                        </v-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ team.name }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ team.owner }} &lt;{{ team.email }} &gt;</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                        <v-btn icon ripple @click.native.stop="onTeamDeleteClick(team)" title="Delete Team">
                          <v-icon color="grey lighten-1">delete</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                      </v-list-tile>
                    </draggable>
                  </v-list>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row mt-3>
                  <v-flex xs12>
                    <v-btn flat primary @click="onCancel()">Cancel</v-btn>
                    <v-btn @click="onUpdateTeams()" :disabled="!reordered" :loading="loading" class="primary">Update</v-btn>
                  </v-flex>
                </v-layout>
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
    <v-dialog v-model="dialog" persistent max-width="320">
      <v-card>
        <v-card-title class="headline">Delete team?</v-card-title>
        <v-card-text>Are you sure you wish to delete this team?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="onDialogCancel()">No</v-btn>
          <v-btn color="green darken-1" flat @click.native="onTeamDelete()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import firebase from 'firebase'
  import draggable from 'vuedraggable'

  export default {
    components: {
      draggable
    },
    data () {
      return {
        loading: false,
        dialog: false,
        selectedTeam: null,
        reordered: false,
        color: '',
        teams: [],
        snackbar: false,
        snackbarColor: '',
        snackbarText: '',
        snackbarLocationTop: true
      }
    },
    created() {
      let user = this.$store.state.user

      // fetch league
      let leagueRef = firebase.database().ref('/users/' + user.uid + '/leagues/' + this.$route.params.id)
      leagueRef.on('value', 
        data => {
          this.color = data.val().color
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
              leagueId: val.leagueId,
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

      teamsRef.on('child_removed',
        data => {
          this.teams = this.teams.filter(e => e.key !== data.key);
        }
      )
    },
    methods: {
      onAddTeamClick() {
        this.$router.push('/league/' + this.$route.params.id + '/teams/new')
      },
      onTeamClick(team) {
        this.$router.push('/team/' + team.key + '/edit')
      },
      onTeamDeleteClick(team) {
        this.selectedTeam = team
        this.dialog = true;
      },
      onTeamDelete() {
        if (this.selectedTeam != null) {
          let user = this.$store.state.user
          firebase.database().ref('/users/' + user.uid + '/teams').child(this.selectedTeam.key).remove()
          this.selectedTeam = null
          this.dialog = false
        }
      },
      onDialogCancel() {
        this.selectedLeague = null
        this.dialog = false
      },
      onTeamsReorder(evt) {
        //console.log("Reordered", evt)
        this.teams.forEach((item, i) => { item.previousFinish = (i+1)})
        this.reordered = true
      }, 
      onUpdateTeams() {
        this.loading = true;
        
        // update teams data
        let user = this.$store.state.user
        for (var i = 0; i < this.teams.length; i++) {
          let t = this.teams[i];
          firebase.database().ref('/users/' + user.uid + '/teams/' + t.key)
            .set({
              email: t.email,
              name: t.name,
              owner: t.owner,
              leagueId: t.leagueId,
              previousFinish: t.previousFinish
            })
            .catch(
              err => {
                this.loading = false
                this.snackbar = true
                this.snackbarColor = 'error'
                this.snackbarText = err.message
              }
            )
        }
        this.loading = false
        this.$router.push('/league/' + this.$route.params.id)
      },
      onCancel() {
        this.$router.push('/league/' + this.$route.params.id)
      }
    }
  }
</script>