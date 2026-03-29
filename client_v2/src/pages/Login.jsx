import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(username, password);
    if (result.success) {
      navigate(from, { replace: true });
    }
    setIsLoading(false);
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
      padding: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%',
          maxWidth: '450px',
          background: 'var(--surface)',
          padding: '3rem',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          textAlign: 'center'
        }}
      >
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          fontSize: '1.25rem',
          fontWeight: 800,
          fontFamily: 'Outfit',
          color: 'var(--primary)'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            background: 'var(--primary)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Play size={18} fill="currentColor" />
          </div>
          ANM CHURCH
        </Link>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Please sign in to access member exclusive content.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Username</label>
            <div style={{ position: 'relative' }}>
               <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }}>
                 <Mail size={18} />
               </div>
               <input 
                 type="text" 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 placeholder="Enter your username"
                 style={{
                   width: '100%',
                   padding: '0.75rem 1rem 0.75rem 3rem',
                   borderRadius: 'var(--radius)',
                   border: '1px solid var(--border)',
                   fontSize: '1rem',
                   outline: 'none',
                   transition: 'border-color 0.2s'
                 }}
                 onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                 onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                 required
               />
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
               <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }}>
                 <Lock size={18} />
               </div>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Enter your password"
                 style={{
                   width: '100%',
                   padding: '0.75rem 1rem 0.75rem 3rem',
                   borderRadius: 'var(--radius)',
                   border: '1px solid var(--border)',
                   fontSize: '1rem',
                   outline: 'none',
                   transition: 'border-color 0.2s'
                 }}
                 onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                 onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                 required
               />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem' }}
          >
            {isLoading ? 'Signing in...' : (
               <>
                 <LogIn size={20} /> Sign In
               </>
            )}
          </button>
        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Contact church admin for access issues.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
