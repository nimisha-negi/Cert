import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const decoded = jwtDecode(token);
      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
      // Restore full user info from localStorage
      const stored = localStorage.getItem('user');
      const userInfo = stored ? JSON.parse(stored) : {};
      return {
        token,
        email: userInfo.email || decoded.sub,
        name: userInfo.name || decoded.sub,
        picture: userInfo.picture || null,
      };
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  });

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0d0f14',
            color: '#fff',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '0.03em',
            padding: '14px 18px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: { primary: '#8b5cf6', secondary: '#0d0f14' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#0d0f14' },
          },
        }}
      />
      {user ? (
        <Dashboard user={user} onLogout={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); }} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </GoogleOAuthProvider>
  );
}
