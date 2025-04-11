<template>
  <section class="hero is-fullheight is-dark is-bold">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="box login-box">
          <h1 class="title has-text-white">Login</h1>

          <form @submit.prevent="login">
            <div class="field">
              <label class="label has-text-white">Username</label>
              <div class="control has-icons-left">
                <input v-model="username" class="input" type="text" placeholder="Username" required />
                <span class="icon is-left"><i class="fas fa-user"></i></span>
              </div>
            </div>

            <div class="field">
              <label class="label has-text-white">Password</label>
              <div class="control has-icons-left">
                <input v-model="password" class="input" type="password" placeholder="Password" required />
                <span class="icon is-left"><i class="fas fa-lock"></i></span>
              </div>
            </div>

            <div class="buttons is-centered mt-4">
              <button type="submit" class="button is-info is-fullwidth">Login</button>
              <button @click.prevent="continueAsGuest" class="button is-light is-fullwidth">Continue as Guest</button>
            </div>
          </form>

          <p class="has-text-white mt-4">
            Don't have an account?
            <RouterLink to="/register" class="has-text-info">Create one here</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const username = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    const response = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      username: username.value,
      password: password.value,
    });

    const { token, role, username: user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', user);

    router.push('/dashboard');
  } catch (err) {
    alert('❌ Invalid login');
  }
};

const continueAsGuest = () => {
  localStorage.setItem('role', 'guest');
  localStorage.setItem('username', 'Guest');
  router.push('/calendar');
};
</script>

<style scoped>
.hero.is-dark {
  background-color: #0e0e0e;
}
.login-box {
  max-width: 400px;
  margin: auto;
  background-color: #1e1e1e;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.15);
}
.input {
  background-color: #2c2c2c;
  border: none;
  color: white;
}
.input::placeholder {
  color: #888;
}
</style>
