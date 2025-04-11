<template>
    <section class="section">
      <div class="container">
        <h1 class="title has-text-centered">📅 Event Calendar</h1>
  
        <!-- Calendar with toggleable views -->
        <vue-cal
          style="height: 700px"
          :events="events"
          default-view="year"
          :disable-views="['years']"
          time="24"
          sticky-split-labels
          events-on-month-view="short"
          :on-event-click="onEventClick"
          :on-event-create="false"
          :on-event-drag="false"
          :on-event-resize="false"
          :on-cell-click="false"
          show-view-selector
        />
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const events = ref([]);
  
  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/events');
      const data = await res.json();
  
      events.value = data.map(event => ({
        title: event.name || 'Untitled Event',
        start: event.date,
        end: event.date,
        content: `
          <strong>${event.teams?.join(' vs ') || 'TBD'}</strong><br>
          League: ${event.league || 'N/A'}<br>
          Type: ${event.type || 'match/practice'}<br>
          Location: ${event.address || 'TBD'}
        `,
      }));
    } catch (err) {
      console.error('Error loading events:', err);
    }
  };
  
  const onEventClick = ({ event }) => {
    alert(`📌 ${event.title}\n\n${event.content.replace(/<br>/g, '\n')}`);
  };
  
  onMounted(fetchEvents);
  </script>
  
  <style scoped>
  .vuecal {
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    font-family: 'Segoe UI', sans-serif;
  }
  </style>
  