<template>
    <section class="section">
      <div class="container">
        <h1 class="title">Events</h1>
  
        <div class="field">
          <input
            v-model="search"
            class="input"
            type="text"
            placeholder="Search by name or location"
          />
        </div>
  
        <div class="table-container">
          <table class="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Address</th>
                <th>Coordinates</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in filteredEvents" :key="event._id">
                <td>{{ event.name }}</td>
                <td>{{ new Date(event.date).toLocaleDateString() }}</td>
                <td>{{ event.address || 'N/A' }}</td>
                <td>
                  <span v-if="event.location">
                    {{ event.location.coordinates[1].toFixed(4) }},
                    {{ event.location.coordinates[0].toFixed(4) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  
  const events = ref([]);
  const search = ref('');
  
  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/events');
      const data = await res.json();
      events.value = data;
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };
  
  onMounted(fetchEvents);
  
  const filteredEvents = computed(() => {
    return events.value.filter(e =>
      [e.name, e.address].some(val =>
        val?.toLowerCase().includes(search.value.toLowerCase())
      )
    );
  });
  </script>
  