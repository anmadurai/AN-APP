import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// COMPONENTS
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// PAGES
import Home from './pages/Home';
import Sermons from './pages/Sermons';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem'
          }
        }}
      />
      
      {/* HEADER IS ONLY VISIBLE WHEN LOGGED IN */}
      {user && <Header />}
      
      <main style={{ flex: 1 }}>
        <Routes>
          {/* PUBLIC ROUTE */}
          <Route path="/login" element={<Login />} />

          {/* PROTECTED ROUTES */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/sermons" element={
            <ProtectedRoute>
              <Sermons />
            </ProtectedRoute>
          } />

          {/* PRIVATE ADMIN ROUTES */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* FALLBACK */}
          <Route path="*" element={<div style={{ textAlign: 'center', padding: '5rem' }}><h1>404</h1><p>Page not found</p></div>} />
        </Routes>
      </main>
      
      {/* FOOTER IS ONLY VISIBLE WHEN LOGGED IN */}
      {user && (
        <footer style={{ 
          marginTop: 'auto', 
          padding: '4rem 0', 
          background: 'var(--surface)', 
          borderTop: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div className="container">
            <p style={{ fontWeight: 700, fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '1rem' }}>
              ALL MADURAI HOLINESS CHURCH
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              &copy; {new Date().getFullYear()} All Rights Reserved. Building faith, one sermon at a time.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
