import React from 'react';
import { 
  Bell, 
  Search, 
  UserCheck, 
  CheckCircle2, 
  Truck, 
  Activity, 
  Flag 
} from 'lucide-react';

const STAGES = [
  { id: 'reported', label: 'Incident Reported', icon: <Bell size={16} /> },
  { id: 'under-review', label: 'Network Review', icon: <Search size={16} /> },
  { id: 'assigned', label: 'Unit Assigned', icon: <UserCheck size={16} /> },
  { id: 'accepted', label: 'Dispatch Accepted', icon: <CheckCircle2 size={16} /> },
  { id: 'dispatched', label: 'Unit Dispatched', icon: <Truck size={16} /> },
  { id: 'in-progress', label: 'On-Site Action', icon: <Activity size={16} /> },
  { id: 'resolved', label: 'Incident Resolved', icon: <Flag size={16} /> },
];

const ResponseTracker = ({ currentStatus }) => {
  // Map currentStatus to STAGES index
  const getActiveIndex = () => {
    const index = STAGES.findIndex(s => s.id === currentStatus);
    return index === -1 ? 0 : index;
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="space-y-4">
      {STAGES.map((stage, i) => {
        const isCompleted = i < activeIndex;
        const isActive = i === activeIndex;
        const isPending = i > activeIndex;

        return (
          <div key={stage.id} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500
                ${isCompleted ? 'bg-success/20 border-success/40 text-success' : ''}
                ${isActive ? 'bg-accent border-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-pulse' : ''}
                ${isPending ? 'bg-white/5 border-white/5 text-muted' : ''}
              `}>
                {stage.icon}
              </div>
              {i < STAGES.length - 1 && (
                <div className={`w-0.5 h-8 my-1 transition-colors duration-500 ${isCompleted ? 'bg-success/40' : 'bg-white/5'}`}></div>
              )}
            </div>
            
            <div className="pt-2">
              <p className={`text-xs font-black uppercase tracking-widest transition-colors ${
                isActive ? 'text-white' : isCompleted ? 'text-success/80' : 'text-muted'
              }`}>
                {stage.label}
              </p>
              {isActive && (
                <p className="text-[10px] text-accent font-bold mt-1 animate-in fade-in slide-in-from-left-2">
                  LIVE TRACKING ACTIVE...
                </p>
              )}
              {isCompleted && (
                <p className="text-[10px] text-muted font-medium mt-1">
                  Completed
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResponseTracker;
