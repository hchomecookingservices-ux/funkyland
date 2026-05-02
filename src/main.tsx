import { StrictMode } from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PlayZoneProvider } from './hooks/usePlayZone';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlayZoneProvider>
      <App />
    </PlayZoneProvider>
  </StrictMode>,
);
