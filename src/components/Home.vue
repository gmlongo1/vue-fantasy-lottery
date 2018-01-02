<template>
  <v-container mt-0>
    <v-layout row wrap >
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large router to="/leagues" class="info">Your Leagues</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large router to="/league/new" class="info">Create League</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
