<template>
    <section class="section has-text-centered is-fullheight">
      <div class="container">
        <div class="box mx-auto" style="max-width: 400px">
          <h1 class="title is-4">📝 Register</h1>
  
          <form @submit.prevent="handleRegister">
            <!-- Username stuf -->
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  v-model="username"
                  class="input"
                  type="text"
                  placeholder="Choose a username"
                  required
                />
              </div>
              <p v-if="usernameError" class="help is-danger">{{ usernameError }}</p>
            </div>
  
            <!-- Email stuf -->
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  v-model="email"
                  class="input"
                  type="email"
                  placeholder="Your email"
                  required
                />
              </div>
              <p v-if="emailError" class="help is-danger">{{ emailError }}</p>
            </div>
  
            <!-- Password  stuf -->
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  v-model="password"
                  class="input"
                  type="password"
                  placeholder="Choose a password"
                  required
                />
              </div>
              <p v-if="passwordError" class="help is-danger">{{ passwordError }}</p>
            </div>
  
            <div class="field mt-4">
              <button class="button is-primary is-fullwidth" type="submit">Register</button>
            </div>
  
            <p class="mt-3 has-text-grey">
              Already have an account?
              <RouterLink to="/login">Login</RouterLink>
            </p>
          </form>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  axios.defaults.baseURL = "https://mevn-sports-scheduler.onrender.com"

  
  const router = useRouter();
  
  const username = ref('');
  const email = ref('');
  const password = ref('');
  
  const usernameError = ref('');
  const emailError = ref('');
  const passwordError = ref('');
  
  const validate = () => {
    let valid = true;
    usernameError.value = '';
    emailError.value = '';
    passwordError.value = '';
  
    if (username.value.trim().length < 4) {
      usernameError.value = 'Username must be at least 4 characters';
      valid = false;
    }
  
    if (!email.value.includes('@')) {
      emailError.value = 'Email must be valid';
      valid = false;
    }
  
    if (password.value.trim().length < 6) {
      passwordError.value = 'Password must be at least 6 characters';
      valid = false;
    }
  
    return valid;
  };
  
  const handleRegister = async () => {
    if (!validate()) return;
  
    try {
      await axios.post('/api/auth/register', {
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
      });
  
      alert('✅ Registration successful!');
      router.push('/login');
    } catch (err) {
      alert('❌ Registration failed. Try a different username/email.');
    }
  };
  </script>
  