<script setup>
import { ref, onMounted, watch } from 'vue';

const teamName = ref('');
const coach = ref('');
const ageGroup = ref('');
const gender = ref('');
const leagueId = ref('');
const leagues = ref([]);

const props = defineProps({
  showTeamModal: {
    type: Boolean,
    required: true,
  },
});

watch(leagueId, (newId) => {
  const selectedLeague = leagues.value.find(league => league._id === newId);
  if (selectedLeague) {
    gender.value = selectedLeague.gender;
    ageGroup.value = selectedLeague.ageGroup;
  }
});

const emit = defineEmits(['close-team-modal']);

const fetchLeagues = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/leagues');
    if (!res.ok) throw new Error('Could not fetch leagues');
    const data = await res.json();
    leagues.value = data;
  } catch (err) { 
    console.error('❌ Failed to load leagues:', err.message);
    alert('Could not fetch leagues.');
  }
};


const createTeam = async () => {
  try {
    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:3000/api/teams', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: teamName.value.trim(),
        coach: coach.value.trim(),
        leagueId: leagueId.value,
        ageGroup: ageGroup.value.trim().toLowerCase(),
        gender: gender.value.trim().toLowerCase(),
      }),
    });

    if (!res.ok) throw new Error('Team creation failed');

    const data = await res.json();
    alert(`✅ Team "${data.name}" created!`);

    // Reset fields
    teamName.value = '';
    coach.value = '';
    ageGroup.value = '';
    gender.value = '';
    leagueId.value = '';

    emit('close-team-modal');
  } catch (err) {
    console.error('❌ Error creating team:', err.message);
    alert('Something went wrong creating the team.');
  }
};

onMounted(() => {
  fetchLeagues(); // ✅ Always fetch on mount
});

</script>

<template>
  <div v-if="showTeamModal" class="modal is-active">
    <div class="modal-background" @click="$emit('close-team-modal')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create Team</p>
        <button class="delete" aria-label="close" @click="$emit('close-team-modal')"></button>
      </header>

      <section class="modal-card-body">
        <form @submit.prevent="createTeam" class="columns is-multiline">

          <div class="column is-full">
            <label class="label">Team Name</label>
            <input v-model="teamName" type="text" class="input" placeholder="e.g., Thunderbolts" required />
          </div>

          <div class="column is-half">
            <label class="label">Coach</label>
            <input v-model="coach" type="text" class="input" placeholder="Coach Name" required />
          </div>

          <div class="column is-half">
            <label class="label">Age Group (from League)</label>
            <input v-model="ageGroup" type="text" class="input" disabled />
          </div>

          <div class="column is-half">
  <label class="label">Gender (auto-set from league)</label>
  <input v-model="gender" type="text" class="input" disabled />
</div>

          <div class="column is-half">
            <label class="label">League</label>
            <div class="select is-fullwidth">
              <select v-model="leagueId" required>
                <option value="" disabled hidden>Select a league</option>
                <option v-for="league in leagues" :key="league._id" :value="league._id">
                  {{ league.sport }} - {{ league.season }} ({{ league.ageGroup }})
                </option>
              </select>
            </div>
          </div>

          <div class="column is-full">
            <button type="submit" class="button is-success is-fullwidth">Add Team</button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>
