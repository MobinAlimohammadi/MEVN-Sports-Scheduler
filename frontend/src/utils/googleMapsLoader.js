// utils/googleMapsLoader.js
import { Loader } from '@googlemaps/js-api-loader';

let cachedLoader = null;

export async function getGoogleMapsLoader() {
  if (cachedLoader) return cachedLoader;

  const { Key } = await fetch('https://mevn-sports-scheduler.onrender.com/api/config/google-maps-key').then(res => res.json());

  cachedLoader = new Loader({
    apiKey: Key,
    version: 'weekly',
    libraries: ['places'],
  });

  return cachedLoader;
}
