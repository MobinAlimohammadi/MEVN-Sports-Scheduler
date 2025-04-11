// utils/googleMapsLoader.js
import { Loader } from '@googlemaps/js-api-loader';

let cachedLoader = null;

export async function getGoogleMapsLoader() {
  if (cachedLoader) return cachedLoader;

  const { key } = await fetch('/api/config/google-maps-key').then(res => res.json());

  cachedLoader = new Loader({
    apiKey: key,
    version: 'weekly',
    libraries: ['places'],
  });

  return cachedLoader;
}
