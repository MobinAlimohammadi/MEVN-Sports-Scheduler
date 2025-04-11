import { Loader } from '@googlemaps/js-api-loader';

export const loadGoogleMapsAPI = async () => {
  const response = await fetch('http://localhost:3000/api/config/google-maps-key');
  const { apiKey } = await response.json();

  const loader = new Loader({
    apiKey,
    version: 'weekly',
    libraries: ['places']
  });

  return loader.load();
};
