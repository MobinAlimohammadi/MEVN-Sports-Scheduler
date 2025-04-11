<template>
  <div id="app">
    <!-- ✅ Hide navbar on login route -->
    <Navbar
      v-if="!['/login', '/register', '/reset-password', '/request-password-reset'].includes(route.path)"
      @open-league="showLeagueModal = true"
      @open-team="showTeamModal = true"
      @open-event="showEventModal = true"
    />

    <!-- Main Content -->
    <section class="section">
      <div class="container">
        <router-view />
      </div>
    </section>

    <!-- Create Modals -->
    <CreateLeague
      v-if="showLeagueModal"
      :showLeagueModal="showLeagueModal"
      @close-league-modal="showLeagueModal = false"
    />
    <CreateTeam
      v-if="showTeamModal"
      :showTeamModal="showTeamModal"
      @close-team-modal="showTeamModal = false"
    />
    <CreateEvent
      v-if="showEventModal"
      :showEventModal="showEventModal"
      @close-event-modal="showEventModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import Navbar from './components/Navbar.vue';
import CreateLeague from './components/CreateLeague.vue';
import CreateTeam from './components/CreateTeam.vue';
import CreateEvent from './components/CreateEvent.vue';

const route = useRoute();

const showLeagueModal = ref(false);
const showTeamModal = ref(false);
const showEventModal = ref(false);
</script>

<style>
html, body {
  font-family: 'Segoe UI', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #000000;
}

.min-vh-100 {
  min-height: 100vh;
}

body {
  background-color: #3C524A !important;
}
</style>
