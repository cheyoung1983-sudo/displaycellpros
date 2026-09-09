import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';
import { registerServiceWorker } from './registerServiceWorker';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Auth0ProviderWithConfig } from './components/Auth0ProviderWithConfig';

// Prevent uncaught browser extension or message channel disconnects from crashing runtime
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason &&
      (String(event.reason?.message || event.reason).includes('Could not establish connection') ||
       String(event.reason?.message || event.reason).includes('Receiving end does not exist'))
    ) {
      event.preventDefault();
      console.debug('[Browser Extension / Channel] Connection ignored:', event.reason);
    }
  });
}

registerServiceWorker();

const rootElement = document.getElementById('root')!;
rootElement.dataset.mounted = 'true';

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <Auth0ProviderWithConfig>
        <App />
      </Auth0ProviderWithConfig>
    </ErrorBoundary>
  </StrictMode>,
);
