<template>
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered">📅 Event Calendar</h1>

      <!-- Calendar with toggleable views -->
      <vue-cal
  style="height: 700px"
  :events="events"
  default-view="month"
  :disable-views="['years']"
    :time-from="480"
  :time-to="1200"
  :time="true"
  
  sticky-split-labels
  events-on-month-view="short"
  :on-event-click="onEventClick"
  show-view-selector
/>


  
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const events = ref([]);
const router = useRouter();

const fetchEvents = async () => {
  try {
    const res = await fetch('https://mevn-sports-scheduler.onrender.com/api/events');
    const data = await res.json();


    // const onEventClick = ({ event }) => {
    //   if (event.id) {
    //     router.push(`/events/${event.id}`);
    //   }
    // };
    
    events.value = data.map(event => ({
  id: event._id,
  title: `<a href="/events/${event._id}" class="event-link">${event.name}</a>`,
  start: new Date(event.date),
  end: new Date(new Date(event.date).getTime() + 60 * 60 * 2000), // 1 hour duration
  content: event.description === 'practice' ? 'Practice' : 'Match',
  class: event.description === 'practice' ? 'practice-event' : 'match-event',
}));


    console.log('✅ Events for calendar:', events.value);
  } catch (err) {
    console.error('❌ Error loading events:', err);
  }
};

const onEventClick = ({ event }) => {
  const linkMatch = event.content.match(/href="([^"]+)"/);
  if (linkMatch) {
    router.push(linkMatch[1]);
  }
};

onMounted(fetchEvents);
</script>



<style>
.vuecal {
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  font-family: 'Segoe UI', sans-serif;
}

.vuecal__event.match-event {
  background-color: #a83232; /* Blue for matches */
  color: white;
}

.vuecal__event.practice-event {
  background-color: #228803; /* Green for practices */
  color: white;
}
</style>
