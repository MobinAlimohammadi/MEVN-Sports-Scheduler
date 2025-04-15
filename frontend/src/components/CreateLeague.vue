<script setup>
import { ref } from 'vue';


const sport = ref('');
const season = ref('');
const ageGroup = ref('');
const gender = ref('');
const division = ref('');

const props = defineProps({
  showLeagueModal: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close-league-modal']);


const createLeague = async () => {
  try {
    const token = localStorage.getItem('token'); // get token

    const response = await fetch('https://mevn-sports-scheduler.onrender.com/api/leagues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // making sure to auth bc this page is a requireAuth in the backend
      },
      body: JSON.stringify({
        sport: sport.value.trim().toLowerCase(),
        season: season.value.trim().toLowerCase(),
        ageGroup: ageGroup.value.trim().toLowerCase(),
        division: division.value.trim().toLowerCase(),
        gender: gender.value.trim().toLowerCase(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add league');
    }

    const data = await response.json();
    alert(`✅ League "${data.sport}" created successfully!`);

    // Reset fields
    sport.value = '';
    season.value = '';
    ageGroup.value = '';
    division.value = '';
    gender.value = '';

    closeModal();
  } catch (error) {
    console.error('❌ Error adding league:', error.message);
    alert(error.message || 'Error adding league. Please try again.');
  }
};



const closeModal = () => {
  emit('close-league-modal');
};
</script>

<template>
  <div>
    <div v-if="showLeagueModal" class="modal is-active">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create New League</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>

        <section class="modal-card-body">
          <form @submit.prevent="createLeague">
            <div class="columns is-multiline">

              
              <div class="column is-full">
                <div class="field">
                  <label class="label">Season</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="season" required>
                        <option value="" disabled hidden>Season</option>
                        <option value="fall">Fall</option>
                        <option value="winter">Winter</option>
                        <option value="spring">Spring</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              
              <div class="column is-half">
                <div class="field">
                  <label class="label">Sport</label>
                  <div class="control">
                    <input
                      v-model="sport"
                      class="input"
                      type="text"
                      placeholder="e.g., Basketball"
                      required
                    />
                  </div>
                </div>
              </div>

              
              <div class="column is-half">
                <div class="field">
                  <label class="label">Age Group</label>
                  <div class="control">
                    <input
                      v-model="ageGroup"
                      class="input"
                      type="text"
                      placeholder="e.g., U17 or Senior"
                      required
                    />
                  </div>
                </div>
              </div>

              
              <div class="column is-half">
                <div class="field">
                  <label class="label">Division</label>
                  <div class="control">
                    <input
                      v-model="division"
                      class="input"
                      type="text"
                      placeholder="e.g., D1 or Varsity"
                      required
                    />
                  </div>
                </div>
              </div>

              
              <div class="column is-half">
                <div class="field">
                  <label class="label">Gender</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="gender" required>
                        <option value="" disabled hidden>Boys/Girls/Co-Ed</option>
                        <option value="girls">Girls</option>
                        <option value="boys">Boys</option>
                        <option value="co-ed">Co-Ed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div class="field">
              <div class="control">
                <button type="submit" class="button is-primary">Add League</button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>
