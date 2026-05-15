import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getIncidentById, updateIncident, deleteIncident } from '../services/incidentService';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, ErrorBox, formatDate } from '../components/UI';
import { 
  ArrowLeft, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  MapPin, 
  User, 
  ShieldCheck, 
  AlertTriangle,
  MessageCircle,
  Share2,
  CheckCircle2,
  Flag,
  Activity,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';
import ResponseTracker from '../components/ResponseTracker';

const IncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const res = await getIncidentById(id);
        setIncident(res.data);
        setEditData({ 
          status: res.data.status, 
          responseStatus: res.data.responseStatus || 'reported',
          assignedDepartments: res.data.assignedDepartments || []
        });
      } catch (err) {
        setError(err.message || 'Incident not found');
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Erase this record from the network permanently?')) return;
    try {
      await deleteIncident(id);
      toast.success('Record Erased');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Erasure failed');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateIncident(id, editData);
      setIncident(res.data);
      setEditing(false);
      toast.success('Network Record Updated');
    } catch (err) {
      toast.error(err.message || 'Sync failed');
    } finally {
      setSaving(false);
    }
  };

  const canEdit = incident && (isAdmin || incident.reportedBy?._id === user?.id);

  if (loading) return <LoadingSpinner message="SYNCING WITH DATA NODE..." />;

  if (error) return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <ErrorBox message={error} />
      <button onClick={() => navigate(-1)} className="btn-secondary mt-6">
        <ArrowLeft size={18} /> RETURN TO FEED
      </button>
    </div>
  );

  const {
    _id,
    title,
    description,
    category,
    priority,
    status,
    location,
    imageUrl,
    reportedBy,
    createdAt,
    updatedAt,
    verifications = [],
    assignedDepartments = []
  } = incident;

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      {/* Top Nav */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="btn-secondary px-4 py-2">
          <ArrowLeft size={18} /> BACK TO FEED
        </button>
        
        {canEdit && (
          <div className="flex gap-3">
            {editing ? (
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> SYNC CHANGES</>}
              </button>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-secondary"><Edit2 size={18} /> EDIT DATA</button>
            )}
            <button onClick={handleDelete} className="btn-secondary text-danger hover:bg-danger/10 border-danger/20"><Trash2 size={18} /></button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Content & Map */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <User size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold">{reportedBy?.name || 'Anonymous Agent'}</p>
                  <p className="text-[10px] text-muted font-black tracking-widest uppercase">Verified Identity</p>
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                priority === 'critical' ? 'bg-danger/10 text-danger border border-danger/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-accent/10 text-accent border border-accent/20'
              }`}>
                {priority} PRIORITY
              </div>
            </div>

            <div className="p-8">
              <h1 className="text-4xl font-black mb-6 leading-tight tracking-tight">{title}</h1>
              <p className="text-muted/90 leading-relaxed text-lg mb-8 font-medium">
                {description}
              </p>

              {imageUrl && (
                <div className="rounded-3xl overflow-hidden border border-white/5 relative group mb-8">
                  <img src={imageUrl} alt={title} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-ping"></div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-white shadow-sm">
                      Secure Visual Node
                    </span>
                  </div>
                </div>
              )}

              {/* Coordination Map (Mock) */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted flex items-center gap-2">
                  <MapPin size={16} className="text-accent" /> Live Coordination Map
                </h3>
                <div className="aspect-[21/9] bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden group cursor-crosshair">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover opacity-20 grayscale transition-transform duration-[10s] group-hover:scale-125"></div>
                  
                  {/* Incident Point */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="relative">
                      <div className="w-4 h-4 bg-accent rounded-full animate-ping absolute inset-0"></div>
                      <div className="w-4 h-4 bg-accent rounded-full relative z-10 border-2 border-white shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
                    </div>
                  </div>

                  {/* Department Points */}
                  {assignedDepartments.map((dept, i) => (
                    <div key={i} className="absolute top-1/3 left-1/4 animate-pulse">
                      <div className="relative group/dept">
                         <div className="w-3 h-3 bg-danger rounded-full border border-white"></div>
                         <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 opacity-0 group-hover/dept:opacity-100 transition-opacity">
                            <p className="text-[8px] font-black text-white whitespace-nowrap">{dept.name}</p>
                         </div>
                      </div>
                    </div>
                  ))}

                  {/* Route Line (Mock) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path d="M 25% 33% Q 40% 45% 50% 50%" stroke="rgba(59,130,246,0.4)" strokeWidth="2" fill="transparent" strokeDasharray="5,5" className="animate-[dash_2s_linear_infinite]" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tracking & Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Response Progress */}
          <div className="glass-card p-8 border-accent/20">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-accent mb-8 flex items-center gap-2">
              <Activity size={16} /> Response Tracking
            </h3>
            <ResponseTracker currentStatus={incident.responseStatus || 'reported'} />
          </div>

          {/* Assigned Units */}
          <div className="glass-card p-6">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-muted mb-6">Assigned Units</h3>
            <div className="space-y-4">
              {assignedDepartments.map((dept, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500`}>
                    {dept.deptType === 'police' ? <ShieldCheck size={64} /> : <Heart size={64} />}
                  </div>
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <p className="text-xs font-black uppercase text-white">{dept.name}</p>
                    <span className="text-[9px] font-black bg-accent/20 text-accent px-2 py-0.5 rounded uppercase tracking-tighter">
                      {dept.deptType}
                    </span>
                  </div>
                  <div className="flex gap-4 relative z-10">
                    <div>
                      <p className="text-[9px] font-bold text-muted uppercase">Distance</p>
                      <p className="text-sm font-black text-accent">{dept.distance}km</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-muted uppercase">ETA</p>
                      <p className="text-sm font-black text-success">{dept.eta}m</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-muted uppercase">Status</p>
                      <p className="text-[10px] font-black text-white animate-pulse">{dept.status.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Intel */}
          <div className="glass-card p-6">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-muted mb-4">Metadata</h3>
            <div className="space-y-3">
               <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-muted uppercase">Global Node</span>
                  <span className="text-white">ID-#{_id.slice(-8)}</span>
               </div>
               <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-muted uppercase">Broadcasted</span>
                  <span className="text-white">{formatDate(createdAt)}</span>
               </div>
               <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-muted uppercase">Last Sync</span>
                  <span className="text-white">{formatDate(updatedAt)}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
