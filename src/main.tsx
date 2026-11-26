import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

async function enableMocking() {
  // If explicitly disabled via environment variable, skip MSW and connect directly to backend
  if (import.meta.env.VITE_USE_MSW === 'false') {
    return;
  }

  if (typeof window !== 'undefined') {
    try {
      const { worker } = await import('./lib/mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      });
    } catch (err) {
      console.warn('MSW worker initialization warning:', err);
    }
  }
}

enableMocking().finally(() => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});
