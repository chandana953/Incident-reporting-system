import React from 'react';
import { 
  Zap, 
  Map as MapIcon, 
  Activity, 
  Users, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

const Widgets = () => {
  return (
    <div className="space-y-6 sticky top-8">
      {/* Live Status Widget */}
      <div className="glass-card p-5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted flex items-center gap-2">
            <Activity size={16} className="text-accent" />
            City Status
          </h3>
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-success/10 border border-success/20">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span className="text-[10px] font-bold text-success">STABLE</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold">1,284</p>
              <p className="text-xs text-muted">Active Citizens</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-accent">98%</p>
              <p className="text-xs text-muted">Safety Rate</p>
            </div>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-accent h-full w-[98%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>
        </div>
      </div>

      {/* Live Alerts Widget */}
      <div className="glass-card p-5">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted flex items-center gap-2 mb-4">
          <Zap size={16} className="text-warning" />
          Live Pulse
        </h3>
        <div className="space-y-4">
          {[
            { id: 1, type: 'Medical', location: 'Downtown', time: '2m ago', severity: 'high' },
            { id: 2, type: 'Accident', location: 'Highway 101', time: '15m ago', severity: 'critical' },
            { id: 3, type: 'Fire', location: 'East Side', time: '42m ago', severity: 'medium' },
          ].map((alert) => (
            <div key={alert.id} className="flex gap-3 group cursor-pointer">
              <div className={`w-1 h-10 rounded-full ${
                alert.severity === 'critical' ? 'bg-danger' : 
                alert.severity === 'high' ? 'bg-warning' : 'bg-accent'
              }`}></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold group-hover:text-accent transition-colors">{alert.type} Alert</p>
                  <span className="text-[10px] text-muted">{alert.time}</span>
                </div>
                <p className="text-xs text-muted">{alert.location}</p>
              </div>
            </div>
          ))}
          <button className="w-full py-2 text-xs font-bold text-accent hover:bg-accent/5 rounded-lg transition-colors border border-accent/10 mt-2">
            VIEW ALL ALERTS
          </button>
        </div>
      </div>

      {/* Map Preview Widget */}
      <div className="glass-card p-5">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted flex items-center gap-2 mb-4">
          <MapIcon size={16} className="text-secondary" />
          Affected Zones
        </h3>
        <div className="aspect-square bg-white/5 rounded-xl border border-white/5 relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2033&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent"></div>
          
          {/* Mock Pulse Points */}
          <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-danger rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-warning rounded-full animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.8)]"></div>
          
          <div className="absolute bottom-3 left-3 right-3">
            <div className="glass-card bg-black/40 p-2 text-center">
              <p className="text-[10px] font-bold">INTERACTIVE MAP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Online Responders */}
      <div className="glass-card p-5">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted flex items-center gap-2 mb-4">
          <Users size={16} className="text-accent" />
          Active Units
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Central Hospital', status: 'Available', color: 'success' },
            { name: 'Fire Station 04', status: 'Busy', color: 'warning' },
            { name: 'Police Precinct', status: 'Available', color: 'success' },
          ].map((unit, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs font-medium">{unit.name}</span>
              <span className={`text-[10px] font-bold text-${unit.color} px-2 py-0.5 rounded bg-${unit.color}/10`}>
                {unit.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Widgets;
