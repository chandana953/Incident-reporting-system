import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  PlusSquare, 
  TrendingUp, 
  Bell, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  FileText, 
  Settings, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: <Home size={22} />, label: 'Community Feed', path: '/dashboard' },
    { icon: <PlusSquare size={22} />, label: 'Report Incident', path: '/incidents/create' },
    { icon: <TrendingUp size={22} />, label: 'Trending Alerts', path: '/trending' },
    { icon: <Bell size={22} />, label: 'Notifications', path: '/notifications' },
    { icon: <MapPin size={22} />, label: 'Nearby Incidents', path: '/incidents' },
    { icon: <Phone size={22} />, label: 'Emergency Contacts', path: '/emergency' },
    { icon: <ShieldCheck size={22} />, label: 'Verification Queue', path: '/verification' },
    { icon: <FileText size={22} />, label: 'My Reports', path: '/my-reports' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ icon: <LayoutDashboard size={22} />, label: 'Admin Panel', path: '/admin' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] sticky top-8">
      <div className="glass-card p-6 flex flex-col h-full">
        {/* Logo / Brand */}
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">C.E.R.P</h1>
            <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold">Smart Safety</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-accent/10 text-accent border border-accent/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                  : 'text-muted hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User / Bottom Actions */}
        <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
          <NavLink
            to="/settings"
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-muted hover:bg-white/5 hover:text-white transition-all group"
          >
            <Settings size={22} className="group-hover:rotate-45 transition-transform duration-500" />
            <span className="font-medium text-sm">Settings</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-danger hover:bg-danger/5 transition-all group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
