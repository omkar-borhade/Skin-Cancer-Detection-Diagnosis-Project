import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import the Redux provider
import store from './store/store'; // Import the Redux store correctly
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}> {/* Wrap App in Provider to use Redux */}
      <App />
    </Provider>
  </StrictMode>
);
