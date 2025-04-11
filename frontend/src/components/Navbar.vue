<template>
  <nav class="navbar custom-navbar has-shadow px-6">
    <div class="navbar-brand">
      <RouterLink to="/calendar" class="navbar-item has-text-white title is-5">
        <strong>BVG ATHLETICS</strong>
      </RouterLink>
      <a class="navbar-burger" @click="isActive = !isActive" :class="{ 'is-active': isActive }">
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>

    <div class="navbar-menu" :class="{ 'is-active': isActive }">
      <div class="navbar-start">
        <RouterLink to="/teams" class="navbar-item has-text-white">Teams</RouterLink>
        <RouterLink to="/leagues" class="navbar-item has-text-white">Leagues</RouterLink>
        <RouterLink to="/events" class="navbar-item has-text-white">Events</RouterLink>
        <RouterLink v-if="role === 'admin'" to="/dashboard" class="navbar-item has-text-white">
          Dashboard
        </RouterLink>

        <!-- 🎯 Admin-only Create buttons -->
        <div v-if="role === 'admin'" class="navbar-item">
          <div class="buttons">
            <button class="button is-small is-link" @click="$emit('open-league')">+ League</button>
            <button class="button is-small is-success" @click="$emit('open-team')">+ Team</button>
            <button class="button is-small is-info" @click="$emit('open-event')">+ Event</button>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <!-- ✅ Welcome Message -->
          <span v-if="isLoggedIn" class="has-text-white mr-3">
            Welcome, <strong>{{ username }}</strong> ({{ role.toLowerCase() }})
          </span>

          <!-- Login / Logout Button -->
          <RouterLink
            v-if="!isLoggedIn"
            to="/login"
            class="button is-primary is-small"
          >
            Login
          </RouterLink>
          <button
            v-else
            @click="logout"
            class="button is-danger is-small"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isActive = ref(false);
const isLoggedIn = ref(false);
const role = ref('');
const username = ref('');
const router = useRouter();

const checkAuth = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
  role.value = localStorage.getItem('role') || '';
  username.value = localStorage.getItem('username') || 'Guest';
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  checkAuth();
  router.push('/login');
};

onMounted(() => {
  checkAuth();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Volkhov&display=swap');

.custom-navbar {
  background-color: #2D3E37 !important;
  font-family: 'Volkhov', sans-serif;
  margin-top: 10px;
  border-top: 4px solid #097d09;
  border-radius: 4px;
  padding-top: 6px;
}

.navbar-item.has-text-white,
.navbar-link,
.button {
  color: white !important;
  font-family: 'Volkhov', sans-serif;
}

.navbar-item:hover,
.navbar-link:hover {
  background-color: #3a4f48 !important;
}

.navbar-burger span {
  background-color: white;
}
</style>
