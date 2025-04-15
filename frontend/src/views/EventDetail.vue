<template>
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered mb-5">
        {{ event?.name || 'Event Details' }}
      </h1>

      <div v-if="event" class="box">
        <div class="columns is-multiline">

          <!-- Left side of the thing -->
          <div class="column is-half">
            <p class="mb-3"><strong>Date:</strong> {{ formatDate(event.date) }}</p>
            <p class="mb-3"><strong>Time:</strong> {{ formatTime(event.date) }}</p>
            <p class="mb-3"><strong>Type:</strong> {{ capitalize(event.description) }}</p>
            <p class="mb-3"><strong>Age Group:</strong> {{ league?.ageGroup || 'N/A' }}</p> 
            <p class="mb-3"><strong>Gender:</strong> {{ capitalize(league?.gender) || 'N/A' }}</p> 
          </div>

          <!-- Right side thing-->
          <div class="column is-half">
            <p class="mb-3"><strong>League:</strong> {{ formatLeague(league) }}</p>
            <p class="mb-3"><strong>Team:</strong> {{ team?.name || 'N/A' }}</p>
            <p class="mb-3">
              <strong>Address:</strong>
              <a :href="mapLink" target="_blank" class="has-text-link">
                {{ event.address || 'N/A' }}
              </a>
            </p>

            <div v-if="event.lat && event.lon" class="mt-4">
              <iframe
                :src="`https://maps.google.com/maps?q=${event.lat},${event.lon}&z=15&output=embed`"
                width="100%"
                height="250"
                frameborder="0"
                style="border-radius: 10px; border: 1px solid #ccc;"
                allowfullscreen
              ></iframe>
            </div>
          </div>

        </div>
      </div>

      <div v-else-if="loading" class="notification is-info has-text-centered">
        Loading event details...
      </div>

      <div v-else class="notification is-danger has-text-centered">
        {{ error || 'Failed to load event' }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const event = ref(null);
const league = ref(null); 
const team = ref(null); 
const loading = ref(true);
const error = ref('');

const fetchEvent = async () => {
  try {
    const res = await fetch(`https://mevn-sports-scheduler.onrender.com/api/events/${route.params.id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch event');
    event.value = data;

    
    if (data.leagueId) {
      const leagueRes = await fetch(`https://mevn-sports-scheduler.onrender.com/api/leagues/${data.leagueId}`);
      if (leagueRes.ok) league.value = await leagueRes.json();
    }

    if (data.teams?.length) {
      const teamRes = await fetch(`https://mevn-sports-scheduler.onrender.com/api/teams/${data.teams[0]}`);
      if (teamRes.ok) team.value = await teamRes.json();
    }

  } catch (err) {
    console.error('❌ Event fetch error:', err.message);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const mapLink = computed(() => {
  if (!event.value?.lat || !event.value?.lon) return '#';
  return `https://www.google.com/maps?q=${event.value.lat},${event.value.lon}`;
});

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const formatLeague = (league) => {
  if (!league) return 'N/A';
  return `${league.sport} - ${league.season} (${league.ageGroup})`;
};

const capitalize = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';

onMounted(fetchEvent);
</script>
