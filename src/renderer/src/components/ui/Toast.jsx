// src/renderer/src/components/ui/Toast.jsx
import { Toaster as HotToaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#14141F',
          color: '#fff',
          borderRadius: '8px',
        },
        success: {
          iconTheme: {
            primary: '#38ff9b',
            secondary: '#14141F',
          },
          style: {
            border: '1px solid #38ff9b',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#14141F',
          },
          style: {
            border: '1px solid #ef4444',
          },
        }
      }}
    />
  );
};

export { Toast };

