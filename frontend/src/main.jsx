import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import the Redux provider
import store from './store/store'; // Import the Redux store correctly
import App from './App';
import './index.css';

// Dynamically load the Google Maps API script
const apiKey = import.meta.env.VITE_PLACES_API_KEY;

const loadGoogleMapsScript = () => {
  const scriptTag = document.getElementById('google-maps-api');
  
  // If the scriptTag exists and API key is provided
  if (scriptTag && apiKey) {
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    // &loading=async      remove  if give error
  } else {
    console.error('Google Maps API key is missing!');
  }
};

// Call the function to load the Google Maps script dynamically
loadGoogleMapsScript();

// The rest of your app initialization
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}> {/* Wrap App in Provider to use Redux */}
      <App />
    </Provider>
  </StrictMode>
);
