import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerService } from '../services/authService';
import { ErrorBox } from '../components/UI';
import { User, Mail, Lock, UserPlus, ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setError('Access codes do not match');
    }
    if (form.password.length < 6) {
      return setError('Access code must be at least 6 characters');
    }
    setLoading(true);
    setError('');
    try {
      const { name, email, password } = form;
      const data = await registerService({ name, email, password });
      login(data.data.user);
      toast.success(`Identity Verified. Welcome to the Network, ${data.data.user.name.split(' ')[0]}`, {
        icon: '🛡️',
        style: {
          background: '#0B1120',
          color: '#F8FAFC',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Network connection error.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Identity Name', type: 'text', icon: User, placeholder: 'Citizen Name' },
    { name: 'email', label: 'Neural Identity (Email)', type: 'email', icon: Mail, placeholder: 'identity@network.gov' },
    { name: 'password', label: 'Access Code', type: 'password', icon: Lock, placeholder: '••••••••' },
    { name: 'confirmPassword', label: 'Confirm Access Code', type: 'password', icon: Lock, placeholder: '••••••••' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_-10%,rgba(6,182,212,0.1),transparent_70%)]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-glow rounded-full blur-[120px] -ml-64 -mb-64 opacity-50"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo Area */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="heading-xl text-3xl mb-1">Create <span className="text-accent">Identity</span></h1>
          <p className="text-muted text-[10px] tracking-[0.3em] uppercase font-black opacity-60">Citizen Enrollment Portal</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 border-white/10 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-secondary to-transparent opacity-50"></div>
          
          {error && <div className="mb-6"><ErrorBox message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, icon: Icon, placeholder }) => (
              <div key={name} className="space-y-1.5">
                <label className="form-label text-[10px]">{label}</label>
                <div className="relative group">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={16} />
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
                    required
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-sm font-black uppercase tracking-widest group mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  VERIFYING...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} />
                  ENROLL IN NETWORK
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-muted text-xs font-medium">
              ALREADY ENROLLED?{' '}
              <Link to="/login" className="text-accent hover:text-accent-secondary font-black tracking-widest transition-colors">
                ACCESS PORTAL
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
