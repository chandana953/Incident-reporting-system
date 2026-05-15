import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  PlusSquare, 
  MapPin, 
  Bell, 
  User 
} from 'lucide-react';

const MobileNav = () => {
  const navItems = [
    { icon: <Home size={24} />, label: 'Feed', path: '/dashboard' },
    { icon: <MapPin size={24} />, label: 'Map', path: '/incidents' },
    { icon: <PlusSquare size={28} />, label: 'Report', path: '/incidents/create', highlight: true },
    { icon: <Bell size={24} />, label: 'Alerts', path: '/notifications' },
    { icon: <User size={24} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4">
      <div className="glass-card flex items-center justify-around p-2 border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center p-2 rounded-xl transition-all
              ${item.highlight ? 'bg-accent text-white -mt-8 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110' : ''}
              ${isActive && !item.highlight ? 'text-accent' : 'text-muted'}
            `}
          >
            {item.icon}
            {!item.highlight && <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
