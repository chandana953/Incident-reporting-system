import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getIncidents } from '../services/incidentService';
import { LoadingSpinner } from '../components/UI';
import IncidentCard from '../components/IncidentCard';
import { 
  Plus, 
  TrendingUp, 
  Search, 
  SlidersHorizontal,
  Flame,
  Clock,
  CheckCircle,
  LayoutGrid
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { connected, on, off } = useSocket();
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, critical: 0 });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchData = async () => {
    try {
      const res = await getIncidents({ limit: 10, page: 1 });
      const list = res.data?.incidents || [];
      setIncidents(list);
      
      // Calculate stats for the widgets (mocking some for the premium feel)
      setStats({
        total: res.data?.pagination?.total || 0,
        open: list.filter(i => i.status === 'open').length,
        resolved: list.filter(i => i.status === 'resolved').length,
        critical: list.filter(i => i.priority === 'critical').length,
      });
    } catch {
      toast.error('Failed to connect to the safety network');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const handleNew = (incident) => {
      toast.success(`NEW ALERT: ${incident.title}`, {
        icon: '🔥',
        style: {
          background: '#0B1120',
          color: '#F8FAFC',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }
      });
      setIncidents(prev => [incident, ...prev]);
    };
    on('newIncident', handleNew);
    return () => off('newIncident', handleNew);
  }, [on, off]);

  const handleVerify = (id) => {
    // In a real app, this would call an API
    toast.success('Incident verification submitted to the network', {
      icon: '🛡️'
    });
    setIncidents(prev => prev.map(inc => 
      inc._id === id ? { ...inc, verifications: [...(inc.verifications || []), user._id] } : inc
    ));
  };

  const handleFlag = (id) => {
    toast.error('Report flagged for review', {
      icon: '🚩'
    });
  };

  if (loading) return <LoadingSpinner message="SYNCING WITH GLOBAL NETWORK..." />;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header / Search Area */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="heading-xl">Community <span className="text-accent">Feed</span></h1>
          <div className="flex items-center gap-2 text-xs font-bold text-muted">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-success animate-pulse' : 'bg-danger'}`}></span>
            {connected ? 'NETWORK ONLINE' : 'NETWORK OFFLINE'}
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search incidents, locations, or departments..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
          />
          <div className="absolute inset-y-2 right-2">
            <button className="h-full px-4 bg-white/5 hover:bg-white/10 rounded-xl text-muted hover:text-white transition-all flex items-center gap-2 border border-white/10">
              <SlidersHorizontal size={16} />
              <span className="text-[10px] font-bold">FILTERS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'all', label: 'All Reports', icon: <LayoutGrid size={16} /> },
          { id: 'critical', label: 'Critical', icon: <Flame size={16} />, color: 'text-danger' },
          { id: 'recent', label: 'Recent', icon: <Clock size={16} /> },
          { id: 'verified', label: 'Verified', icon: <CheckCircle size={16} />, color: 'text-success' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border
              ${activeFilter === filter.id 
                ? 'bg-accent/10 border-accent/30 text-accent shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                : 'bg-white/5 border-white/5 text-muted hover:border-white/20 hover:text-white'}
            `}
          >
            {filter.icon}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-2">
        {incidents.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-accent" />
            </div>
            <h2 className="text-xl font-bold mb-2">City Status Stable</h2>
            <p className="text-muted text-sm mb-8">No incidents reported nearby. The community monitoring is active.</p>
            <button className="btn-primary">
              <Plus size={18} /> REPORT AN INCIDENT
            </button>
          </div>
        ) : (
          incidents.map((inc) => (
            <IncidentCard 
              key={inc._id} 
              incident={inc} 
              onVerify={handleVerify}
              onFlag={handleFlag}
            />
          ))
        )}
      </div>

      {/* Loading Skeleton Footer */}
      {incidents.length > 0 && (
        <div className="py-8 text-center">
          <div className="inline-block w-6 h-6 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold text-muted mt-2 tracking-widest">SCANNING FOR MORE ALERTS</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
