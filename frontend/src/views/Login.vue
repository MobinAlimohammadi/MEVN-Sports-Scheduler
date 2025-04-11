<template>
    <section class="section has-text-centered is-fullheight">
      <div class="container">
        <div class="box mx-auto" style="max-width: 400px">
          <h1 class="title is-4">🔐 Login</h1>
  
          <form @submit.prevent="handleLogin">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  v-model="username"
                  class="input"
                  type="text"
                  placeholder="Enter username"
                  required
                />
              </div>
              <p v-if="usernameError" class="help is-danger">{{ usernameError }}</p>
            </div>
  
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  v-model="password"
                  class="input"
                  type="password"
                  placeholder="Enter password"
                  required
                />
              </div>
              <p v-if="passwordError" class="help is-danger">{{ passwordError }}</p>
            </div>
  
            <div class="field mt-4">
              <button class="button is-primary is-fullwidth" type="submit">Login</button>
            </div>
  
            <div class="field mt-2">
              <button class="button is-light is-fullwidth" @click="continueAsGuest">
                Continue as Guest
              </button>
            </div>
  
            <p class="mt-3 has-text-grey">
              Don’t have an account?
              <RouterLink to="/register">Register here</RouterLink>
            </p>
            <p v-if="showRecoveryPrompt" class="has-text-danger mt-3">
              Trouble logging in? <RouterLink to="/request-password-reset">Reset your password</RouterLink>
            </p>
          </form>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  axios.defaults.baseURL = "https://mevn-sports-scheduler-1.onrender.com/";
  
  const username = ref('');
  const password = ref('');
  const usernameError = ref('');
  const passwordError = ref('');
  const loginAttempts = ref(parseInt(localStorage.getItem('loginAttempts')) || 0);
  const showRecoveryPrompt = ref(loginAttempts.value >= 3);
  const router = useRouter();
  
  const validateInputs = () => {
    usernameError.value = '';
    passwordError.value = '';
    return true; // No validation on login
  };
  
  const handleLogin = async () => {
    // if (!validateInputs()) return;
  
    try {
      console.log("running stuff" + " username is" + username + " pass is " + password);

      const response = await axios.post('/api/auth/login', {
        username: username.value.trim(),
        password: password.value.trim(), // ✅ remove trailing spaces
      });



      console.log(response.data);

      const { token, role, username: returnedUsername } = response.data;

    if (!token || !role) {
      throw new Error('Login failed: missing token or role.');
    }
  
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('username', response.data.username || username.value);
      localStorage.setItem('loginAttempts', '0'); // ✅ reset after successful login
  
      router.push(response.data.role === 'admin' ? '/dashboard' : '/calendar');
    } catch (err) {
      loginAttempts.value++;
      localStorage.setItem('loginAttempts', loginAttempts.value);
      passwordError.value = 'Invalid credentials. Please try again.';
  
      if (loginAttempts.value >= 3) {
        showRecoveryPrompt.value = true;
      }
    }
  };
  
  const continueAsGuest = () => {
    localStorage.setItem('role', 'guest');
    router.push('/calendar');
  };
  
  onMounted(() => {
    loginAttempts.value = parseInt(localStorage.getItem('loginAttempts')) || 0;
    showRecoveryPrompt.value = loginAttempts.value >= 3;
  });
  </script>
  