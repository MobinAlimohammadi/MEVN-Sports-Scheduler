<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Leagues</h1>

      
      <div class="field">
        <input
          v-model="search"
          class="input"
          type="text"
          placeholder="Search leagues..."
        />
      </div>

      <div class="table-container">
        <table class="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th @click="sortBy('sport')">Sport</th>
              <th @click="sortBy('season')">Season</th>
              <th @click="sortBy('ageGroup')">Age Group</th>
              <th @click="sortBy('division')">Division</th>
              <th @click="sortBy('gender')">Gender</th>
              <th v-if="role === 'admin'" class="has-text-centered">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="league in sortedLeagues" :key="league._id">
              <td>{{ league.sport }}</td>
              <td>{{ league.season }}</td>
              <td>{{ league.ageGroup }}</td>
              <td>{{ league.division }}</td>
              <td>{{ league.gender }}</td>


            
              <td v-if="role === 'admin'" class="has-text-centered">
                <button
                  class="button is-danger is-small"
                  @click="deleteLeague(league._id)"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="sortedLeagues.length === 0" class="has-text-centered has-text-grey">
          No leagues found matching your search.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const leagues = ref([]);
const search = ref('');
const sortKey = ref('');
const sortAsc = ref(true);

const fetchLeagues = async () => {
  try {
    const res = await fetch('https://mevn-sports-scheduler.onrender.com/api/leagues');
    const data = await res.json();
    leagues.value = data;
  } catch (err) {
    console.error('❌ Error fetching leagues:', err);
  }
};

const deleteLeague = async (leagueId) => {
  const confirmDelete = confirm(
    'Are you sure you want to delete this league?\nAll associated teams and events will also be deleted!'
  );
  if (!confirmDelete) return;

  try {
    const res = await fetch(`https://mevn-sports-scheduler.onrender.com/api/leagues/${leagueId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!res.ok) throw new Error('Failed to delete league');
    alert('✅ League and all associated data deleted');
    fetchLeagues();
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    alert('Error deleting league');
  }
};

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const filteredLeagues = computed(() => {
  const lowerSearch = search.value.toLowerCase();
  return leagues.value.filter(l =>
    [l.sport, l.season, l.ageGroup, l.division, l.gender].some(val =>
      val?.toLowerCase().includes(lowerSearch)
    )
  );
});

const sortedLeagues = computed(() => {
  if (!sortKey.value) return filteredLeagues.value;

  return [...filteredLeagues.value].sort((a, b) => {
    const valA = a[sortKey.value]?.toLowerCase?.() ?? '';
    const valB = b[sortKey.value]?.toLowerCase?.() ?? '';
    return sortAsc.value
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });
});

onMounted(fetchLeagues);
</script>
