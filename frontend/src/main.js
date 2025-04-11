import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bulma/css/bulma.min.css';
import 'vue-cal/dist/vuecal.css'; // 💅 default styles
import VueCal from 'vue-cal';
//import VueGoogleMaps from '@fawmi/vue-google-maps';
//import { Vue3GoogleMap } from 'vue3-google-map';



const app = createApp(App);

const init = async () => {
    const res = await fetch('https://mevn-sports-scheduler.onrender.com/api/config/google-maps-key');
    const data = await res.json();
    const apiKey = data.apiKey;
  
    // app.use(VueGoogleMaps, {
    //   load: {
    //     key: apiKey,
    //     libraries: 'places',
    //   },
    // });

    // //app.use(VueGoogleMap, {
    //     load: {
    //       key: import.meta.env.GOOGLE_MAPS_API_KEY, // use your env variable
    //       libraries: 'places', // required for autocomplete
    //     },
    //   });
  
app.use(router);
app.component('VueCal', VueCal);
app.mount('#app')
};

init();
