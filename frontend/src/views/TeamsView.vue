<template>
  <section class="hero is-fullheight-with-navbar">
    <div class="hero-body">
      <div class="container">

        
        <div class="mb-5 has-text-centered">
          <h1 class="title is-2"> All Teams</h1>
          <p class="subtitle is-5">Browse, search, and filter registered teams</p>
        </div>

        
        <div class="box">
          <div class="columns is-multiline is-vcentered">

            
            <div class="column is-6">
              <div class="field">
                <p class="control has-icons-left">
                  <input
                    v-model="search"
                    class="input is-rounded"
                    type="text"
                    placeholder="Search by name or coach..."
                  />
                  <span class="icon is-left">
                    <i class="fas fa-search"></i>
                  </span>
                </p>
              </div>
            </div>

            
            <div class="column is-3">
              <div class="select is-fullwidth is-rounded">
                <select v-model="filterGender">
                  <option value="">All Genders</option>
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="co-ed">Co-Ed</option>
                </select>
              </div>
            </div>

            
            <div class="column is-3 has-text-right">
              <button class="button is-link is-light is-rounded" @click="fetchTeams">
                🔄 Refresh
              </button>
            </div>

          </div>
        </div>

        
        <div class="box">
          <table class="table is-striped is-hoverable is-fullwidth">
            <thead>
              <tr class="has-background-link-light has-text-link-dark">
                <th>Name</th>
                <th>Coach</th>
                <th>Age Group</th>
                <th>Gender</th>
                <th v-if="role === 'admin'" class="has-text-centered">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="team in filteredTeams"
                :key="team._id"
              >
                <td>{{ team.name }}</td>
                <td>{{ team.coach }}</td>
                <td>{{ team.ageGroup }}</td>
                <td class="has-text-capitalized">{{ team.gender }}</td>


                <td v-if="role === 'admin'" class="has-text-centered">
                <button
                  class="button is-danger is-small"
                  @click="deleteTeam(team._id)"
                >
                  🗑️ Delete
                </button>
                </td>
                
              </tr>
            </tbody>
          </table>

          <p v-if="filteredTeams.length === 0" class="has-text-centered has-text-grey">
            No teams found matching your search.
          </p>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const teams = ref([]);
const search = ref('');
const filterGender = ref('');

const fetchTeams = async () => {
  try {
    const res = await fetch('https://mevn-sports-scheduler.onrender.com/api/teams', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      teams.value = data;
    } else {
      console.error('❌ Failed to fetch teams:', data);
    }
  } catch (err) {
    console.error('❌ Network error:', err);
  }
};

const deleteTeam = async (teamId) => {
  if (!confirm('Are you sure you want to delete this team? This will also delete all related events.')) return;

  try {
    const res = await fetch(`https://mevn-sports-scheduler.onrender.com/api/teams/${teamId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!res.ok) throw new Error('Failed to delete team');

    alert('✅ Team deleted');
    fetchTeams();
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    alert('Error deleting team');
  }
};

const filteredTeams = computed(() => {
  return teams.value.filter(team => {
    const matchesSearch =
      team.name.toLowerCase().includes(search.value.toLowerCase()) ||
      team.coach.toLowerCase().includes(search.value.toLowerCase());

    const matchesGender = !filterGender.value || team.gender === filterGender.value;

    return matchesSearch && matchesGender;
  });
});

onMounted(fetchTeams);
</script>
