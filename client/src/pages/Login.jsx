import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../services/authService';
import { ErrorBox } from '../components/UI';
import { ShieldCheck, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginService(form);
      login(data.data.user);
      toast.success(`Access Granted. Welcome, Agent ${data.data.user.name.split(' ')[0]}`, {
        icon: '🛡️',
        style: {
          background: '#0B1120',
          color: '#F8FAFC',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_80%)]"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mb-64"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo Area */}
        <div className="text-center mb-10 animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(59,130,246,0.4)] relative">
            <ShieldCheck className="text-white" size={40} />
            <div className="absolute inset-0 rounded-2xl border border-white/20 animate-ping opacity-20"></div>
          </div>
          <h1 className="heading-xl mb-2">Network <span className="text-accent">Access</span></h1>
          <p className="text-muted text-sm tracking-widest uppercase font-bold opacity-60">Smart City Emergency System</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 border-white/10 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
          
          {error && <div className="mb-6"><ErrorBox message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="form-label">Neural Identity (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="agent@network.gov"
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="form-label">Access Code (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-sm font-black uppercase tracking-widest group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  AUTHENTICATING...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn size={20} />
                  INITIALIZE SESSION
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-muted text-xs font-medium">
              NEW TO THE ECOSYSTEM?{' '}
              <Link to="/register" className="text-accent hover:text-accent-secondary font-black tracking-widest transition-colors">
                REGISTER IDENTITY
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex justify-center gap-4 text-[10px] font-black text-muted tracking-widest uppercase opacity-40">
          <span>Encrypted Session</span>
          <span>•</span>
          <span>Verified Authority</span>
          <span>•</span>
          <span>v4.0.2</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
