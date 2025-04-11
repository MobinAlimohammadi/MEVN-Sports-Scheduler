<template>
    <section class="section">
      <div class="container">
        <h1 class="title">Teams</h1>
  
        <!-- Search & Filter -->
        <div class="field is-grouped mb-4">
          <div class="control is-expanded">
            <input v-model="search" class="input" placeholder="Search teams..." />
          </div>
          <div class="control">
            <div class="select">
              <select v-model="filterGender">
                <option value="">All Genders</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="co-ed">Co-Ed</option>
              </select>
            </div>
          </div>
        </div>
  
        <!-- Teams Table -->
        <div class="table-container">
          <table class="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Coach</th>
                <th>Age Group</th>
                <th>Gender</th>
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
                <td>{{ team.gender }}</td>
              </tr>
            </tbody>
          </table>
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
      const res = await fetch('http://localhost:3000/api/teams', {
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
  