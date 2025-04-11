<!-- components/GooglePlacePicker.vue -->
<template>
    <div>
      <input ref="input" class="input" type="text" placeholder="Search for a location" />
      <GoogleMap
        :center="location"
        :zoom="14"
        style="height: 300px; width: 100%; margin-top: 1rem;"
      >
        <Marker :options="{ position: location }" />
      </GoogleMap>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { GoogleMap, Marker } from 'vue3-google-map';
  
  const location = ref({ lat: 43.6532, lng: -79.3832 }); // Default to Toronto
  const input = ref(null);
  
  onMounted(() => {
    const autocomplete = new window.google.maps.places.Autocomplete(input.value);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        location.value = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
      }
    });
  });
  </script>
  