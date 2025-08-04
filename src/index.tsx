import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { queryClientInstance } from 'services';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import MuiXLicense from 'components/MuiLicense/MuiLicense';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';

if (window.ResizeObserver) {
  const resizeObserverLoopError = () => {
    const eventLoopError = () => {
      requestAnimationFrame(() => {
        throw new Error('ResizeObserver loop error');
      });
    };

    window.addEventListener('error', (event) => {
      if (event.message === 'ResizeObserver loop completed with undelivered notifications.') {
        event.stopImmediatePropagation();
      }
    });

    window.addEventListener('unhandledrejection', eventLoopError);
  };

  resizeObserverLoopError();
}
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <MuiXLicense />
      <QueryClientProvider client={queryClientInstance}>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </QueryClientProvider>
    </I18nextProvider>
  </React.StrictMode>
);
