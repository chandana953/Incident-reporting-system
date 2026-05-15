import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIncident } from '../services/incidentService';
import { ErrorBox } from '../components/UI';
import { 
  Plus, 
  MapPin, 
  Upload, 
  X, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'accident', label: 'Road Accident', icon: '🚗', dept: 'Hospital + Police' },
  { id: 'fire', label: 'Fire Outbreak', icon: '🔥', dept: 'Fire Department' },
  { id: 'theft', label: 'Theft / Robbery', icon: '👤', dept: 'Police' },
  { id: 'medical', label: 'Medical Emergency', icon: '🚑', dept: 'Ambulance' },
  { id: 'flood', label: 'Flood / Water', icon: '🌊', dept: 'Rescue Units' },
  { id: 'violence', label: 'Violence / Riot', icon: '👊', dept: 'Police' },
  { id: 'infrastructure', label: 'Infrastructure', icon: '🏗️', dept: 'Public Works' },
  { id: 'other', label: 'Other Issue', icon: '✨', dept: 'Admin Review' },
];

const PRIORITIES = [
  { id: 'low', label: 'Low', color: 'text-success', bg: 'bg-success/10' },
  { id: 'medium', label: 'Medium', color: 'text-accent', bg: 'bg-accent/10' },
  { id: 'high', label: 'High', color: 'text-warning', bg: 'bg-warning/10' },
  { id: 'critical', label: 'Critical', color: 'text-danger', bg: 'bg-danger/10' },
];

const CreateIncident = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', 
    description: '', 
    category: 'accident', 
    priority: 'medium',
    longitude: '', 
    latitude: '', 
    address: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => { setImage(null); setPreview(null); };

  const useMyLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(prev => ({ 
          ...prev, 
          latitude: pos.coords.latitude.toFixed(6), 
          longitude: pos.coords.longitude.toFixed(6) 
        }));
        toast.success('Location GPS Locked', { icon: '📍' });
      },
      () => toast.error('Could not get location')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.longitude || !form.latitude) { setError('Please provide location coordinates'); return; }
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append('image', image);
      
      await createIncident(formData);
      
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full glass-card shadow-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}>
          <div className="flex-1 w-0">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-white">Emergency Departments Notified</p>
                <p className="mt-1 text-xs text-muted">Your report has been broadcasted to the nearest units.</p>
              </div>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-accent hover:text-accent/80 focus:outline-none">
              Close
            </button>
          </div>
        </div>
      ), { duration: 5000 });
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to connect to the network');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = CATEGORIES.find(c => c.id === form.category);

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="heading-xl mb-3">Broadcast <span className="text-accent">Incident</span></h1>
        <p className="text-muted text-sm max-w-md mx-auto">
          Your report will be verified by the community and routed to the appropriate emergency units instantly.
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 w-full bg-white/5">
          <div 
            className="h-full bg-accent transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {error && <div className="mb-6"><ErrorBox message={error} /></div>}

          {step === 1 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Category Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.id })}
                    className={`
                      p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all
                      ${form.category === cat.id 
                        ? 'bg-accent/10 border-accent/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                        : 'bg-white/5 border-white/5 hover:border-white/10'}
                    `}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-tight text-center">{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Title & Description */}
              <div className="space-y-4">
                <div>
                  <label className="form-label">Incident Title:</label>
                  <input 
                    className="form-input" 
                    name="title" 
                    value={form.title} 
                    onChange={handleChange}
                    placeholder="E.g., Structural Fire at East Mall" 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Detailed Description:</label>
                  <textarea 
                    className="form-input" 
                    name="description" 
                    value={form.description} 
                    onChange={handleChange}
                    placeholder="Describe the situation, number of people involved, and any immediate dangers..." 
                    required 
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  className="btn-primary"
                >
                  NEXT STEP <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Priority & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="form-label">Urgency Level:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setForm({ ...form, priority: p.id })}
                        className={`
                          px-4 py-3 rounded-xl border text-[10px] font-black uppercase transition-all
                          ${form.priority === p.id 
                            ? `${p.bg} border-current ${p.color} shadow-sm` 
                            : 'bg-white/5 border-white/5 text-muted hover:border-white/10'}
                        `}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Auto Dept Info */}
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="text-accent flex-shrink-0" size={20} />
                    <div>
                      <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Response Unit</p>
                      <p className="text-xs font-bold text-white">{selectedCategory?.dept}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="form-label mb-0">Location Tracking:</label>
                    <button 
                      type="button" 
                      onClick={useMyLocation}
                      className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      <MapPin size={10} /> AUTO-DETECT GPS
                    </button>
                  </div>
                  <input 
                    className="form-input" 
                    name="address" 
                    value={form.address} 
                    onChange={handleChange}
                    placeholder="Common name or address..." 
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      className="form-input text-center text-xs" 
                      name="latitude" 
                      value={form.latitude} 
                      onChange={handleChange}
                      placeholder="LATITUDE" 
                      type="number" 
                      step="any" 
                      required 
                    />
                    <input 
                      className="form-input text-center text-xs" 
                      name="longitude" 
                      value={form.longitude} 
                      onChange={handleChange}
                      placeholder="LONGITUDE" 
                      type="number" 
                      step="any" 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              <div className="space-y-2">
                <label className="form-label">Visual Evidence (Optional):</label>
                {preview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                    <img src={preview} alt="Preview" className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
                    <button 
                      type="button" 
                      onClick={clearImage}
                      className="absolute top-4 right-4 w-10 h-10 bg-danger/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-danger transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-all group">
                    <Upload size={24} className="text-muted group-hover:text-accent transition-colors" />
                    <span className="text-xs font-bold text-muted mt-2 group-hover:text-white transition-colors">UPLOAD PHOTO / VIDEO</span>
                    <input type="file" accept="image/*,video/*" onChange={handleImage} className="hidden" />
                  </label>
                )}
              </div>

              <div className="flex gap-3 pt-6">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" /> SENDING ALERT...</>
                  ) : (
                    <><ShieldCheck size={20} className="mr-2" /> SEND EMERGENCY REPORT</>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-bold">SECURE NETWORK</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={16} />
          <span className="text-[10px] font-bold">LIVE COORDINATION</span>
        </div>
      </div>
    </div>
  );
};

export default CreateIncident;
