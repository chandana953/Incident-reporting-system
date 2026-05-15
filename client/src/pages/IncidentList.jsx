import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { getIncidents, deleteIncident } from '../services/incidentService';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge, LoadingSpinner, EmptyState, formatDate } from '../components/UI';
import { List, Plus, Search, Filter, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['', 'accident', 'theft', 'fire', 'medical', 'flood', 'violence', 'infrastructure', 'other'];
const PRIORITIES = ['', 'low', 'medium', 'high', 'critical'];
const STATUSES = ['', 'open', 'in-progress', 'resolved', 'closed'];

const IncidentList = () => {
  const { user, isAdmin } = useAuth();
  const { on, off } = useSocket();
  const [incidents, setIncidents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', category: '', page: 1 });
  const [showFilters, setShowFilters] = useState(false);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getIncidents(filters);
      setIncidents(res.data?.incidents || []);
      setPagination(res.data?.pagination || {});
    } catch {
      toast.error('Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  // Real-time socket updates
  useEffect(() => {
    const handleNew = (inc) => { setIncidents(prev => [inc, ...prev.slice(0, prev.length - 1)]); toast.success(`New: ${inc.title}`); };
    const handleUpdate = (inc) => setIncidents(prev => prev.map(i => i._id === inc._id ? inc : i));
    const handleDelete = (id) => setIncidents(prev => prev.filter(i => i._id !== id));
    on('newIncident', handleNew);
    on('updateIncident', handleUpdate);
    on('deleteIncident', handleDelete);
    return () => { off('newIncident', handleNew); off('updateIncident', handleUpdate); off('deleteIncident', handleDelete); };
  }, [on, off]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm('Delete this incident?')) return;
    try {
      await deleteIncident(id);
      setIncidents(prev => prev.filter(i => i._id !== id));
      toast.success('Incident deleted');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const handleFilterChange = (key, val) => setFilters(prev => ({ ...prev, [key]: val, page: 1 }));
  const handlePage = (p) => setFilters(prev => ({ ...prev, page: p }));

  const SelectFilter = ({ label, value, onChange, options }) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.35rem', textTransform: 'uppercase' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: '0.6rem 0.875rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.6rem', color: '#f1f5f9', fontSize: '0.85rem', cursor: 'pointer', outline: 'none', minWidth: '130px' }}>
        {options.map(o => <option key={o} value={o} style={{ background: '#1a1a2e' }}>{o || `All ${label}s`}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <List size={24} color="#6366f1" /> All Incidents
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b', marginLeft: '0.5rem' }}>({pagination.total || 0})</span>
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-ghost" style={{ padding: '0.55rem 1rem' }}>
            <Filter size={15} /> {showFilters ? 'Hide' : 'Filters'}
          </button>
          <Link to="/incidents/create" className="btn-primary"><Plus size={16} /> Report</Link>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', marginBottom: showFilters ? '1rem' : 0 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#6366f1', pointerEvents: 'none' }} />
          <input className="form-input" placeholder="Search incidents..." value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
            style={{ paddingLeft: '2.5rem' }} />
        </div>
        {showFilters && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <SelectFilter label="Status" value={filters.status} onChange={v => handleFilterChange('status', v)} options={STATUSES} />
            <SelectFilter label="Priority" value={filters.priority} onChange={v => handleFilterChange('priority', v)} options={PRIORITIES} />
            <SelectFilter label="Category" value={filters.category} onChange={v => handleFilterChange('category', v)} options={CATEGORIES} />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={() => setFilters({ search: '', status: '', priority: '', category: '', page: 1 })} className="btn-ghost" style={{ padding: '0.55rem 1rem' }}>
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* List */}
      <div className="glass-card">
        {loading ? (
          <LoadingSpinner message="Fetching incidents..." />
        ) : incidents.length === 0 ? (
          <EmptyState
            icon={List}
            title="No incidents found"
            description="No incidents match your current filters. Try adjusting search or filters."
            action={<Link to="/incidents/create" className="btn-primary"><Plus size={16} /> Report Incident</Link>}
          />
        ) : (
          <>
            {incidents.map((inc) => (
              <div key={inc._id} className="incident-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem', fontSize: '0.95rem' }}>{inc.title}</p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', color: '#475569', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                      <span>📁 {inc.category}</span>
                      <span>👤 {inc.reportedBy?.name}</span>
                      <span>🕐 {formatDate(inc.createdAt)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                    <PriorityBadge priority={inc.priority} />
                    <StatusBadge status={inc.status} />
                    <Link to={`/incidents/${inc._id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', color: '#818cf8', textDecoration: 'none' }}>
                      <Eye size={14} />
                    </Link>
                    {(isAdmin || inc.reportedBy?._id === user?.id) && (
                      <button onClick={(e) => handleDelete(inc._id, e)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1.25rem' }}>
                <button onClick={() => handlePage(filters.page - 1)} disabled={filters.page <= 1} className="btn-ghost" style={{ padding: '0.45rem 0.75rem' }}>
                  <ChevronLeft size={16} />
                </button>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Page {filters.page} of {pagination.pages}</span>
                <button onClick={() => handlePage(filters.page + 1)} disabled={filters.page >= pagination.pages} className="btn-ghost" style={{ padding: '0.45rem 0.75rem' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IncidentList;
