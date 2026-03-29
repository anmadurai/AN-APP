import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, Play, Home as HomeIcon } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header style={{
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(8px)',
      background: 'rgba(255, 255, 255, 0.8)'
    }}>
      <nav className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '4.5rem'
      }}>
        {/* LOGO */}
        <Link to="/" style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          fontFamily: 'Outfit',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            background: 'var(--primary)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Play size={14} fill="currentColor" />
          </div>
          ALL MADURAI HOLINESS CHURCH
        </Link>

        {/* DESKTOP NAV */}
        <div style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-active' : ''}>Home</NavLink>
          <NavLink to="/sermons" className={({ isActive }) => isActive ? 'nav-active' : ''}>Sermons</NavLink>

          {user && user.role === 'admin' && (
            <NavLink to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
          )}

          {user ? (
            <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button onClick={toggleMenu} style={{ display: 'none' }} className="mobile-toggle">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="fade-in" style={{
          position: 'absolute',
          top: '4.5rem',
          left: 0,
          right: 0,
          background: 'var(--surface)',
          padding: '1.5rem',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Link to="/" onClick={toggleMenu}>Home</Link>
            <Link to="/sermons" onClick={toggleMenu}>Sermons</Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" onClick={toggleMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            )}
            {user ? (
               <button onClick={() => { logout(); toggleMenu(); }} className="btn btn-secondary">
                 <LogOut size={16} /> Logout
               </button>
            ) : (
               <Link to="/login" onClick={toggleMenu} className="btn btn-primary">Login</Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-toggle { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        nav a { font-weight: 500; font-size: 0.95rem; color: var(--secondary); }
        nav a:hover { color: var(--primary); }
        .nav-active { color: var(--primary); font-weight: 600; }
      `}</style>
    </header>
  );
};

export default Header;
