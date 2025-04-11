<template>
    <section class="section">
      <div class="container">
        <h1 class="title">{{ event?.name || 'Event Details' }}</h1>
  
        <div v-if="event" class="box">
          <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
          <p><strong>Time:</strong> {{ formatTime(event.date) }}</p>
          <p><strong>Type:</strong> {{ event.description }}</p>
          <p><strong>League:</strong> {{ event.leagueId || 'N/A' }}</p>
          <p><strong>Team:</strong> {{ event.teams?.[0] || 'N/A' }}</p>
          <p><strong>Address:</strong> <a :href="mapLink" target="_blank">{{ event.address }}</a></p>
          <p><strong>Age Group:</strong> {{ event.ageGroup || 'N/A' }}</p>
          <p><strong>Gender:</strong> {{ event.gender || 'N/A' }}</p>
        </div>
  
        <div v-else class="notification is-warning">
          Loading event details...
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const event = ref(null);
  
  const fetchEvent = async () => {
    const res = await fetch(`http://localhost:3000/api/events/${route.params.id}`);
    event.value = await res.json();
  };
  
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const mapLink = computed(() => {
    if (!event.value?.lat || !event.value?.lon) return '#';
    return `https://www.google.com/maps?q=${event.value.lat},${event.value.lon}`;
  });
  
  onMounted(fetchEvent);
  </script>
  