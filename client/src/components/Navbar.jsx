import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  AlertTriangle, LayoutDashboard, List, Plus,
  Shield, LogOut, Wifi, WifiOff, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/incidents', label: 'Incidents', icon: List },
    { to: '/incidents/create', label: 'Report', icon: Plus },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(15, 15, 26, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(99,102,241,0.4)'
            }}>
              <AlertTriangle size={20} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f1f5f9' }}>
              Incident<span style={{ color: '#818cf8' }}>IQ</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
               className="hidden-mobile">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '0.6rem',
                fontSize: '0.875rem', fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: isActive(to) ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: isActive(to) ? '#818cf8' : '#94a3b8',
                border: isActive(to) ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
              }}>
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right: user info + socket status + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Socket indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: connected ? '#10b981' : '#ef4444' }}>
              {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span style={{ display: 'none' }}>{connected ? 'Live' : 'Offline'}</span>
            </div>

            {/* User pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              background: 'rgba(99,102,241,0.1)',
              borderRadius: '9999px',
              border: '1px solid rgba(99,102,241,0.2)',
              fontSize: '0.8rem', color: '#c7d2fe',
            }}>
              <div style={{
                width: '24px', height: '24px',
                background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700, color: 'white'
              }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </span>
              {isAdmin && (
                <span style={{ fontSize: '0.65rem', background: 'rgba(167,139,250,0.2)', color: '#a78bfa', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                  ADMIN
                </span>
              )}
            </div>

            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.45rem 0.75rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '0.6rem',
              color: '#f87171', fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            >
              <LogOut size={14} />
              Logout
            </button>

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'none' }}
              className="show-mobile">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav menu */}
        {menuOpen && (
          <div style={{ paddingBottom: '1rem', borderTop: '1px solid rgba(99,102,241,0.15)', paddingTop: '0.75rem' }}>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '0.6rem',
                  textDecoration: 'none',
                  color: isActive(to) ? '#818cf8' : '#94a3b8',
                  background: isActive(to) ? 'rgba(99,102,241,0.1)' : 'transparent',
                  fontSize: '0.9rem', fontWeight: 600,
                  marginBottom: '0.25rem'
                }}>
                <Icon size={17} /> {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
