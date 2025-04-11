<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue';
//import { Loader } from '@googlemaps/js-api-loader';
import loader from '../utils/googleMapsLoader.js';

const event = ref({
  name: '',
  date: '',
  time: '',
  address: '',
  lat: null,
  lon: null,
  leagueId: '',
  teamId: '',
  type: 'match',
});

const props = defineProps({
  showEventModal: Boolean,
});
const emit = defineEmits(['close-event-modal']);
const closeModal = () => emit('close-event-modal');

const message = ref('');
const map = ref(null);
const mapElement = ref(null);
const marker = ref(null);

const leagues = ref([]);
const teams = ref([]);
const filteredTeams = computed(() =>
  teams.value.filter(team => String(team.leagueId) === String(event.value.leagueId))
);


const timeOptions = [
  '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30'
];

const loadInitialData = async () => {
  try {
    const [leaguesRes, teamsRes] = await Promise.all([
      fetch('https://mevn-sports-scheduler.onrender.com/api/leagues'),
      fetch('https://mevn-sports-scheduler.onrender.com/api/teams'),
    ]);
    leagues.value = await leaguesRes.json();
    teams.value = await teamsRes.json();
    console.log('✅ Leagues:', leagues.value);
    console.log('✅ Teams:', teams.value);
    
  } catch (err) {
    console.error('❌ Failed to load leagues or teams:', err);
  }
};

watch(
  () => props.showEventModal,
  async (isOpen) => {
    if (isOpen) {
      await loadInitialData();
      await nextTick();
      initMap();
    }
  },
  { immediate: true } // 🔥 This ensures it runs if already true
);




const initMap = async () => {
  try {
    const { key } = await fetch('https://mevn-sports-scheduler.onrender.com/api/config/google-maps-key').then(res => res.json());

    // const loader = new Loader({
    // apiKey: key,
    // version: 'weekly',
    // libraries: ['places'],
    // }); x

    const loader = await getGoogleMapsLoader();
    await loader.load();

    map.value = new google.maps.Map(mapElement.value, {
      center: { lat: 43.6532, lng: -79.3832 },
      zoom: 12,
    });

    const input = document.getElementById('autocomplete');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map.value);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      event.value.address = place.formatted_address;
      event.value.lat = place.geometry.location.lat();
      event.value.lon = place.geometry.location.lng();

      map.value.panTo(place.geometry.location);
      map.value.setZoom(15);

      if (marker.value) marker.value.setMap(null);
      marker.value = new google.maps.Marker({
        map: map.value,
        position: place.geometry.location,
        title: event.value.name || 'Selected Location',
      });
    });
  } catch (err) {
    console.error('❌ Google Maps failed:', err.message);
    message.value = 'Could not load Google Maps';
  }
};

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('token');
    const datetime = new Date(`${event.value.date}T${event.value.time}`);

    const res = await fetch('https://mevn-sports-scheduler.onrender.com/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: event.value.name.trim(),
        date: datetime,
        address: event.value.address.trim(),
        leagueId: event.value.leagueId,
        teams: event.value.type === 'match' ? [event.value.teamId] : [],
        description: event.value.type,
        lat: event.value.lat,
        lon: event.value.lon,
        
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Event creation failed');

    message.value = `✅ Event "${data.name}" created!`;
    event.value = {
      name: '', date: '', time: '', address: '', lat: null, lon: null,
      leagueId: '', teamId: '', type: 'match'
    };
    closeModal();
  } catch (err) {
    console.error('❌ Submit error:', err.message);
    message.value = err.message;
  }
};
</script>

<template>
  <div v-if="showEventModal" class="modal is-active">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card" style="width: 95%; max-width: 800px;">
      <header class="modal-card-head">
        <p class="modal-card-title">Create New Event</p>
        <button class="delete" @click="closeModal"></button>
      </header>

      <section class="modal-card-body">
        <form @submit.prevent="handleSubmit">
          <div class="columns is-multiline">
            <div class="column is-full">
              <label class="label">Event Name</label>
              <input v-model="event.name" class="input" type="text" required />
            </div>

            <div class="column is-half">
              <label class="label">Date</label>
              <input v-model="event.date" class="input" type="date" required />
            </div>

            <div class="column is-half">
              <label class="label">Time</label>
              <div class="select is-fullwidth">
                <select v-model="event.time" required>
                  <option disabled value="">Select time</option>
                  <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
                </select>
              </div>
            </div>

            <div class="column is-half">
              <label class="label">Event Type</label>
              <div class="select is-fullwidth">
                <select v-model="event.type">
                  <option value="match">Match</option>
                  <option value="practice">Practice</option>
                </select>
              </div>
            </div>

            <div class="column is-half">
              <label class="label">League</label>
              <div class="select is-fullwidth">
                <select v-model="event.leagueId" required>
                  <option disabled value="">Select league</option>
                  <option v-for="league in leagues" :key="league._id" :value="league._id">
                    {{ league.sport }} - {{ league.season }} ({{ league.ageGroup }})
                  </option>
                </select>
              </div>
            </div>

            <div class="column is-full">
              <label class="label">Team</label>
              <div class="select is-fullwidth">
                <select v-model="event.teamId" :disabled="event.type === 'practice'">
                  <option disabled value="">
                    {{ event.type === 'practice' ? 'Not needed for practice' : 'Select team' }}
                  </option>
                  <option v-for="team in filteredTeams" :key="team._id" :value="team._id">
                    {{ team.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="column is-full">
              <label class="label">Search Location</label>
              <input id="autocomplete" class="input" type="text" placeholder="Search Google Maps" />
            </div>

            <div class="column is-full">
              <div ref="mapElement" class="map-container mb-4"></div>
            </div>
          </div>

          <button class="button is-primary is-fullwidth">Create Event</button>
          <p v-if="message" class="has-text-danger mt-2">{{ message }}</p>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  border-radius: 6px;
  background-color: #f0f0f0;
  box-shadow: 0 0 4px rgba(0,0,0,0.2);
}
</style>
