<template>
  <div class="container p-6 is-fullheight">
    <h2 class="title">Dashboard</h2>

    <div class="buttons">
      <button class="button is-primary" @click="showLeagueModal = true">Create League</button>
      <button class="button is-link" @click="showTeamModal = true">Create Team</button>
      <button class="button is-info" @click="showEventModal = true">Create Event</button>
    </div>

    <!-- Modals -->
    <CreateLeague :showLeagueModal="showLeagueModal" @close-league-modal="showLeagueModal = false" />
    <CreateTeam :showTeamModal="showTeamModal" @close-team-modal="showTeamModal = false" />
    <CreateEvent :showEventModal="showEventModal" @close-event-modal="showEventModal = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CreateLeague from './CreateLeague.vue';
import CreateTeam from './CreateTeam.vue';
import CreateEvent from './CreateEvent.vue';

const showLeagueModal = ref(false);
const showTeamModal = ref(false);
const showEventModal = ref(false);
</script>

