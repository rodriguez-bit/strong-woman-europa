import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { collaboratorsApi } from '../services/api';
import { Collaborator } from '../types/collaborator';
import { PHASE_COLORS, PRIORITY_COLORS, formatFollowers, getCountryFlag } from '../config/theme';

const PHASES = ['research', 'outreach', 'negotiation', 'contract', 'production', 'live', 'completed'];

export default function Pipeline() {
  const navigate = useNavigate();
  const [allData, setAllData] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    collaboratorsApi.list({ limit: 200 }).then(d => {
      setAllData(d.data);
      setLoading(false);
    });
  }, []);

  const handlePhaseChange = async (id: number, newPhase: string) => {
    await collaboratorsApi.updateStatus(id, { project_phase: newPhase });
    collaboratorsApi.list({ limit: 200 }).then(d => setAllData(d.data));
  };

  const grouped = PHASES.reduce((acc, phase) => {
    acc[phase] = allData.filter(c => c.project_phase === phase);
    return acc;
  }, {} as Record<string, Collaborator[]>);

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 border-2 border-dr-purple border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <TopBar title="Pipeline" subtitle="Kanban view of all collaborators" />
      <div className="p-8">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PHASES.map(phase => {
            const phaseInfo = PHASE_COLORS[phase];
            const items = grouped[phase] || [];
            return (
              <div key={phase} className="flex-shrink-0 w-72">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className={`w-3 h-3 rounded-full ${phaseInfo.bg.replace('/20', '')}`} />
                  <h3 className="font-heading font-semibold text-sm">{phaseInfo.label}</h3>
                  <span className="text-xs text-white/30 ml-auto">{items.length}</span>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {items.map(c => (
                    <GlassCard
                      key={c.id}
                      hover
                      className="p-4"
                      onClick={() => navigate(`/collaborators/${c.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{getCountryFlag(c.country)} {c.name}</p>
                          <p className="text-xs text-white/40 capitalize">{c.profession.replace('_', ' ')}</p>
                        </div>
                        <Badge {...(PRIORITY_COLORS[c.priority] || PRIORITY_COLORS.medium)} />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/30">{formatFollowers(c.total_followers)} followers</span>
                        <span className="text-dr-purple font-semibold">{c.relevance_score}</span>
                      </div>
                      {/* Phase move buttons */}
                      <div className="flex gap-1 mt-3" onClick={e => e.stopPropagation()}>
                        {PHASES.filter(p => p !== phase).slice(0, 3).map(p => (
                          <button
                            key={p}
                            onClick={() => handlePhaseChange(c.id, p)}
                            className="text-[10px] px-2 py-1 rounded-lg bg-white/5 hover:bg-dr-purple/20 text-white/40 hover:text-white transition-colors"
                          >
                            {PHASE_COLORS[p].label}
                          </button>
                        ))}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
