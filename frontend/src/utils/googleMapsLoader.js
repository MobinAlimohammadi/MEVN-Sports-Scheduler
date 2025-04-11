// utils/googleMapsLoader.js
import { Loader } from '@googlemaps/js-api-loader';
const { Key } = await fetch('http://localhost:3000/api/config/google-maps-key').then(res => res.json());


const loader = new Loader({
  apiKey: Key, // Replace with your actual key
  version: 'weekly',
  libraries: ['places'],
});

export default loader;
