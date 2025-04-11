<template>
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered mb-5">
        {{ event?.name || 'Event Details' }}
      </h1>

      <div v-if="event" class="box">
        <div class="columns is-multiline">

          <!-- Left Column -->
          <div class="column is-half">
            <p class="mb-3"><strong>Date:</strong> {{ formatDate(event.date) }}</p>
            <p class="mb-3"><strong>Time:</strong> {{ formatTime(event.date) }}</p>
            <p class="mb-3"><strong>Type:</strong> {{ capitalize(event.description) }}</p>
            <p class="mb-3"><strong>Age Group:</strong> {{ event.ageGroup || 'N/A' }}</p>
            <p class="mb-3"><strong>Gender:</strong> {{ capitalize(event.gender) || 'N/A' }}</p>
          </div>

          <!-- Right Column -->
          <div class="column is-half">
            <p class="mb-3"><strong>League ID:</strong> {{ event.leagueId || 'N/A' }}</p>
            <p class="mb-3"><strong>Team ID:</strong> {{ event.teams?.[0] || 'N/A' }}</p>
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
const loading = ref(true);
const error = ref('');

const fetchEvent = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/events/${route.params.id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch event');
    event.value = data;
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

const capitalize = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';

onMounted(fetchEvent);
</script>
