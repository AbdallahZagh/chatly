import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    {/* Global Toast configuration */}
    <Toaster 
      position="top-left"
      toastOptions={{
        className: 'bg-[#f2e8ed] text-[#2f1a25] border border-[#27161F]',
        duration: 3000,
      }}
    />
    <App />
  </StrictMode>
);