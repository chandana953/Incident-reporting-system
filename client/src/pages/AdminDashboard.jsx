import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIncidents, updateIncident, deleteIncident, getStats } from '../services/incidentService';
import { StatusBadge, PriorityBadge, LoadingSpinner, formatDate, capitalize } from '../components/UI';
import { Shield, Users, Activity, Clock, CheckCircle, Flame, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['open', 'in-progress', 'resolved', 'closed'];

const AdminDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [filters, setFilters] = useState({ page: 1, limit: 15 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [incRes, statsRes] = await Promise.all([
          getIncidents(filters),
          getStats()
        ]);
        setIncidents(incRes.data?.incidents || []);
        setStats(statsRes.data);
      } catch (err) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [filters]);

  const handleStatusSave = async (id) => {
    try {
      const res = await updateIncident(id, { status: editStatus });
      setIncidents(prev => prev.map(i => i._id === id ? res.data : i));
      setEditingId(null);
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this incident?')) return;
    try {
      await deleteIncident(id);
      setIncidents(prev => prev.filter(i => i._id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2, marginTop: '0.2rem' }}>{value ?? 0}</p>
        </div>
        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `${color}20`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color={color} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Shield size={26} color="#6366f1" /> Admin Dashboard
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.3rem' }}>Manage all incidents and monitor system activity.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard icon={Activity} label="Total" value={stats.total} color="#6366f1" />
          <StatCard icon={Clock} label="Open" value={stats.byStatus?.open} color="#f59e0b" />
          <StatCard icon={Users} label="In Progress" value={stats.byStatus?.inProgress} color="#818cf8" />
          <StatCard icon={CheckCircle} label="Resolved" value={stats.byStatus?.resolved} color="#10b981" />
          <StatCard icon={Flame} label="Critical" value={stats.byPriority?.critical} color="#ef4444" />
        </div>
      )}

      {/* Category Breakdown */}
      {stats?.categoryBreakdown?.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem', fontSize: '0.95rem' }}>Category Breakdown</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {stats.categoryBreakdown.map(({ _id, count }) => (
              <div key={_id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.85rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '9999px', fontSize: '0.8rem', color: '#c7d2fe', fontWeight: 600 }}>
                {capitalize(_id)} <span style={{ background: 'rgba(99,102,241,0.3)', borderRadius: '9999px', padding: '0.1rem 0.45rem', fontSize: '0.7rem' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incidents Management Table */}
      <div className="glass-card">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(99,102,241,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#f1f5f9' }}>All Incidents — Manage</h2>
          <Link to="/incidents" style={{ color: '#818cf8', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 600 }}>View public list →</Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(99,102,241,0.07)' }}>
                {['Title', 'Category', 'Priority', 'Status', 'Reporter', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.73rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc._id} style={{ borderBottom: '1px solid rgba(99,102,241,0.1)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <Link to={`/incidents/${inc._id}`} style={{ color: '#f1f5f9', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem', display: 'block', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inc.title}
                    </Link>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}><span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{inc.category}</span></td>
                  <td style={{ padding: '0.875rem 1rem' }}><PriorityBadge priority={inc.priority} /></td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {editingId === inc._id ? (
                      <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                        style={{ padding: '0.35rem 0.6rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}>
                        {STATUSES.map(s => <option key={s} value={s} style={{ background: '#1a1a2e' }}>{capitalize(s)}</option>)}
                      </select>
                    ) : (
                      <StatusBadge status={inc.status} />
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#94a3b8', fontSize: '0.82rem' }}>{inc.reportedBy?.name}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{formatDate(inc.createdAt)}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {editingId === inc._id ? (
                        <>
                          <button onClick={() => handleStatusSave(inc._id)}
                            style={{ display: 'flex', alignItems: 'center', padding: '0.3rem 0.6rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', color: '#10b981', cursor: 'pointer', fontSize: '0.75rem', gap: '0.3rem', fontWeight: 600 }}>
                            <Save size={12} /> Save
                          </button>
                          <button onClick={() => setEditingId(null)}
                            style={{ display: 'flex', alignItems: 'center', padding: '0.3rem 0.5rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '6px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}>
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(inc._id); setEditStatus(inc.status); }}
                            style={{ display: 'flex', alignItems: 'center', padding: '0.3rem 0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '6px', color: '#818cf8', cursor: 'pointer' }}>
                            <Edit2 size={12} />
                          </button>
                          <button onClick={() => handleDelete(inc._id)}
                            style={{ display: 'flex', alignItems: 'center', padding: '0.3rem 0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: '#f87171', cursor: 'pointer' }}>
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
