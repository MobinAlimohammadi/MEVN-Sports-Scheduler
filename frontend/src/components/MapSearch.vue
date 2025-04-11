<template>
    <div>
      <input
        ref="searchInput"
        class="input mb-3"
        type="text"
        placeholder="Search for a location"
      />
  
      <div ref="mapContainer" style="width: 100%; height: 400px;"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { loadGoogleMapsAPI } from '@/composables/useGoogleMapsLoader';
  
  const emit = defineEmits(['location-selected']);
  
  const mapContainer = ref(null);
  const searchInput = ref(null);
  const marker = ref(null);
  
  onMounted(async () => {
    const google = await loadGoogleMapsAPI();
  
    const map = new google.maps.Map(mapContainer.value, {
      center: { lat: 43.65107, lng: -79.347015 },
      zoom: 12,
    });
  
    const autocomplete = new google.maps.places.Autocomplete(searchInput.value, {
      types: ['geocode'],
      componentRestrictions: { country: 'ca' }
    });
  
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
  
      if (!place.geometry) return;
  
      const location = place.geometry.location;
      const lat = location.lat();
      const lng = location.lng();
      const address = place.formatted_address || '';
  
      // Update marker
      if (marker.value) marker.value.setMap(null);
  
      marker.value = new google.maps.Marker({
        position: { lat, lng },
        map
      });
  
      map.panTo({ lat, lng });
  
      emit('location-selected', { lat, lng, address });
    });
  });
  </script>
  