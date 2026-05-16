import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Share2, 
  Flag, 
  CheckCircle2, 
  AlertTriangle,
  MoreHorizontal,
  User,
  Heart,
  Trash2,
  Activity
} from 'lucide-react';
import { formatDate } from './UI';

const IncidentCard = ({ incident, user, onVerify, onFlag, onDelete }) => {
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.id === incident.reportedBy?._id || user?.id === incident.reportedBy;
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
    verificationStatus,
    assignedDepartments = [],
    verifications = [],
    flags = [],
    comments = []
  } = incident;

  const severityColor = {
    critical: 'text-danger',
    high: 'text-warning',
    medium: 'text-accent',
    low: 'text-success'
  };

  const getDeptColor = (type) => {
    switch (type) {
      case 'police': return 'text-secondary';
      case 'hospital': return 'text-danger';
      case 'fire': return 'text-warning';
      case 'ambulance': return 'text-danger';
      default: return 'text-accent';
    }
  };

  const getDeptIcon = (type) => {
    switch (type) {
      case 'police': return <ShieldCheck size={14} />;
      case 'hospital': return <Heart size={14} />;
      case 'ambulance': return <Activity size={14} />;
      case 'fire': return <AlertTriangle size={14} />;
      default: return <CheckCircle2 size={14} />;
    }
  };

  return (
    <div className={`glass-card p-0 overflow-hidden mb-6 group transition-all duration-500 hover:scale-[1.01] ${priority === 'critical' ? 'border-danger/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : ''}`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center overflow-hidden">
            {reportedBy?.avatarUrl ? (
              <img src={reportedBy.avatarUrl} alt={reportedBy.name} className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="text-accent" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{reportedBy?.name || 'Anonymous User'}</span>
              {reportedBy?.isVerifiedAuthority && (
                <ShieldCheck size={14} className="text-accent fill-accent/10" />
              )}
              <span className="text-muted text-xs">• {formatDate(createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-black uppercase tracking-tighter ${severityColor[priority]}`}>
                {priority} PRIORITY
              </span>
              <span className="text-muted text-[10px]">•</span>
              <span className="text-muted text-[10px] flex items-center gap-1">
                <MapPin size={10} /> {location?.address || 'GPS Locked'}
              </span>
            </div>
          </div>
        </div>
        {priority === 'critical' && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-danger/10 border border-danger/20 animate-pulse">
            <Activity size={12} className="text-danger" />
            <span className="text-[10px] font-black text-danger uppercase tracking-widest">Live Alert</span>
          </div>
        )}
      </div>

      {/* Content */}
      <Link to={`/incidents/${_id}`} className="block px-4 pb-2">
        <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{title}:</h3>
        <p className="text-muted text-sm line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>
      </Link>

      {/* Image Preview if exists */}
      {imageUrl && (
        <div className="px-4 pb-4">
          <div className="rounded-xl overflow-hidden aspect-video relative border border-white/5">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3">
              <span className="badge bg-black/40 backdrop-blur-md border-white/10 text-[10px] font-black uppercase">
                {category}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Interaction Bar */}
      <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onVerify?.(_id)}
            className={`flex items-center gap-2 transition-colors group/btn ${verifications.includes(user?.id) ? 'text-success' : 'text-muted hover:text-success'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${verifications.includes(user?.id) ? 'bg-success/10' : 'group-hover/btn:bg-success/10'}`}>
              <CheckCircle2 size={18} className={verifications.includes(user?.id) ? 'fill-success/20' : ''} />
            </div>
            <span className="text-xs font-bold">{verifications.length || 'Verify'}</span>
          </button>

          <button className="flex items-center gap-2 text-muted hover:text-accent transition-colors group/btn">
            <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover/btn:bg-accent/10 transition-colors">
              <MessageCircle size={18} />
            </div>
            <span className="text-xs font-bold">{comments.length}</span>
          </button>

          <button className="flex items-center gap-2 text-muted hover:text-secondary transition-colors group/btn">
            <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover/btn:bg-secondary/10 transition-colors">
              <Share2 size={18} />
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {(isAdmin || isOwner) && (
            <button 
              onClick={() => onDelete?.(_id)}
              className="text-muted hover:text-danger transition-colors p-2"
              title="Delete Record"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button 
            onClick={() => onFlag?.(_id)}
            className="text-muted hover:text-danger transition-colors p-2"
            title="Flag Intelligence"
          >
            <Flag size={18} />
          </button>
        </div>
      </div>

      {/* Smart Routing Panel */}
      {assignedDepartments.length > 0 && (
        <div className="px-4 py-3 border-t border-white/5 bg-accent/[0.02] flex flex-wrap gap-4">
          {assignedDepartments.map((dept, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 ${getDeptColor(dept.deptType)}`}>
                {getDeptIcon(dept.deptType)}
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-black uppercase tracking-tight text-white/90">
                  {dept.name.split(' ')[0]} {dept.name.split(' ')[1]}
                </p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase">
                  <span className="text-accent">{dept.distance}km</span>
                  <span>•</span>
                  <span className="text-success">{dept.eta} MINS</span>
                  <span>•</span>
                  <span className="animate-pulse">{dept.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Line */}
      <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between text-[9px] font-black tracking-widest text-muted/60 uppercase">
        <div className="flex gap-4">
          <span>GLOBAL ID: #{_id.slice(-6)}</span>
          <span>SYNC: STABLE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'resolved' ? 'bg-success' : 'bg-warning animate-pulse'}`}></div>
          {status}
        </div>
      </div>
    </div>
  );
};

export default IncidentCard;
