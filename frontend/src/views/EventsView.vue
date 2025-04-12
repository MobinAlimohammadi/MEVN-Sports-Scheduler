<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Events</h1>

      <div class="field">
        <input
          v-model="search"
          class="input"
          type="text"
          placeholder="Search events by any field"
        />
      </div>

      <div class="table-container">
        <table class="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th @click="sortBy('name')">Name</th>
              <th @click="sortBy('date')">Date & Time</th>
              <th @click="sortBy('description')">Type</th>
              <th @click="sortBy('address')">Address</th>
              <th @click="sortBy('leagueId')">League</th>
              <th @click="sortBy('teams')">Team</th>
              <th v-if="role === 'admin'" class="has-text-centered">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in sortedEvents" :key="event._id">
              <td>{{ event.name }}</td>
              <td>{{ formatDate(event.date) }}</td>
              <td>{{ event.description }}</td>
              <td>
                <a
                  v-if="event.lat && event.lon"
                  :href="`https://www.google.com/maps?q=${event.lat},${event.lon}`"
                  target="_blank"
                >
                  {{ event.address || 'View on Map' }}
                </a>
                <span v-else>
                  {{ event.address || 'N/A' }}
                </span>
              </td>
              <td>
                {{
                  leaguesMap[event.leagueId]
                    ? leaguesMap[event.leagueId].sport + ' - ' +
                      leaguesMap[event.leagueId].season + ' (' +
                      leaguesMap[event.leagueId].ageGroup + ')'
                    : 'N/A'
                }}
              </td>
              <td>
                {{
                  event.teams?.[0] && teamsMap[event.teams[0]]
                    ? teamsMap[event.teams[0]].name
                    : 'N/A'
                }}
              </td>
              <td v-if="role === 'admin'" class="has-text-centered">
                <button
                  class="button is-danger is-small"
                  @click="deleteEvent(event._id)"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="sortedEvents.length === 0" class="has-text-centered has-text-grey">
          No events found matching your search.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';


const role = ref(localStorage.getItem('role') || 'guest');

const events = ref([]);
const leagues = ref([]);
const teams = ref([]);
const search = ref('');
const sortKey = ref('date');
const sortAsc = ref(true);

const leaguesMap = ref({});
const teamsMap = ref({});


const fetchEvents = async () => {
  try {
    const res = await fetch('https://mevn-sports-scheduler.onrender.com/api/events');
    const data = await res.json();
    events.value = data;
  } catch (err) {
    console.error('❌ Error fetching events:', err);
  }
};

const fetchLeaguesAndTeams = async () => {
  try {
    const [leaguesRes, teamsRes] = await Promise.all([
      fetch('https://mevn-sports-scheduler.onrender.com/api/leagues'),
      fetch('https://mevn-sports-scheduler.onrender.com/api/teams'),
    ]);
    const leaguesData = await leaguesRes.json();
    const teamsData = await teamsRes.json();

    leagues.value = leaguesData;
    teams.value = teamsData;

    leaguesMap.value = Object.fromEntries(leaguesData.map(l => [l._id, l]));
    teamsMap.value = Object.fromEntries(teamsData.map(t => [t._id, t]));
  } catch (err) {
    console.error('❌ Failed to fetch leagues or teams:', err);
  }
};

const deleteEvent = async (eventId) => {
  const confirmDelete = confirm('Are you sure you want to delete this event?');
  if (!confirmDelete) return;

  const token = localStorage.getItem('token');
  if (!token) {
    alert('⚠️ You are not authenticated. Please login again.');
    return;
  }

  try {
    const res = await fetch(`https://mevn-sports-scheduler.onrender.com/api/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) throw new Error('Failed to delete event');
    alert('✅ Event deleted successfully');
    fetchEvents();
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    alert('Failed to delete event');
  }
};

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const sortedEvents = computed(() => {
  const filtered = events.value.filter(e => {
    const league = leaguesMap.value[e.leagueId];
    const team = e.teams?.[0] ? teamsMap.value[e.teams[0]] : null;

    const searchText = search.value.toLowerCase();
    return [
      e.name,
      e.description,
      e.address,
      league?.sport,
      league?.season,
      league?.ageGroup,
      team?.name
    ].some(val => val?.toLowerCase().includes(searchText));
  });

  return filtered.sort((a, b) => {
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];
    if (valA < valB) return sortAsc.value ? -1 : 1;
    if (valA > valB) return sortAsc.value ? 1 : -1;
    return 0;
  });
});

onMounted(async () => {
  role.value = localStorage.getItem('role') || 'guest';
  await fetchLeaguesAndTeams();
  await fetchEvents();
});
</script>
