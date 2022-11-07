import React from 'react';
import { createPortal } from 'react-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DialogProvider } from './context/DialogContext';
import { Dialog } from './Dialog';
import reportWebVitals from './reportWebVitals';

const dialogRoot = document.getElementById('dialog-root') as HTMLElement;
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const DialogPortal = () => {
  return createPortal(<Dialog />, dialogRoot);
};

const AppPortal = () => {
  return createPortal(<App />, document.getElementById('app-root') as HTMLElement);
};

root.render(
  <React.StrictMode>
    <DialogProvider>
      <>
        <DialogPortal />
        <AppPortal />
      </>
    </DialogProvider>
  </React.StrictMode>
);

reportWebVitals();
