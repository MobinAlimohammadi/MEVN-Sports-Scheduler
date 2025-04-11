<template>
    <section class="section">
      <div class="container">
        <h1 class="title">Leagues</h1>
  
        <div class="field">
          <input
            v-model="search"
            class="input"
            type="text"
            placeholder="Search by sport, age group, or season"
          />
        </div>
  
        <div class="table-container">
          <table class="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>Sport</th>
                <th>Season</th>
                <th>Age Group</th>
                <th>Division</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="league in filteredLeagues" :key="league._id">
                <td>{{ league.sport }}</td>
                <td>{{ league.season }}</td>
                <td>{{ league.ageGroup }}</td>
                <td>{{ league.division }}</td>
                <td>{{ league.gender }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  
  const leagues = ref([]);
  const search = ref('');
  
  const fetchLeagues = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/leagues');
      const data = await res.json();
      leagues.value = data;
    } catch (err) {
      console.error('Error fetching leagues:', err);
    }
  };
  
  onMounted(fetchLeagues);
  
  const filteredLeagues = computed(() => {
    return leagues.value.filter(l =>
      [l.sport, l.season, l.ageGroup].some(val =>
        val?.toLowerCase().includes(search.value.toLowerCase())
      )
    );
  });
  </script>
  