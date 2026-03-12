import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GitBranch, TrendingUp, Star, Activity, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TopBar from '../components/layout/TopBar';
import GlassCard from '../components/ui/GlassCard';
import MetricCard from '../components/ui/MetricCard';
import Badge from '../components/ui/Badge';
import { dashboardApi } from '../services/api';
import { DashboardStats, Collaborator, ContactLog } from '../types/collaborator';
import { STATUS_COLORS, PHASE_COLORS, CHART_COLORS, formatFollowers, getCountryFlag } from '../config/theme';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [prospects, setProspects] = useState<Collaborator[]>([]);
  const [timeline, setTimeline] = useState<ContactLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getStats(),
      dashboardApi.getTopProspects(5),
      dashboardApi.getTimeline(10),
    ]).then(([s, p, t]) => {
      setStats(s);
      setProspects(p);
      setTimeline(t);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-dr-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pipelineData = stats?.byPhase.map(p => ({
    name: PHASE_COLORS[p.project_phase]?.label || p.project_phase,
    value: p.count,
  })) || [];

  const countryData = stats?.byCountry.slice(0, 8).map(c => ({
    name: c.country,
    value: c.count,
  })) || [];

  return (
    <div>
      <TopBar title="Dashboard" subtitle="Strong Woman Europa Overview" />
      <div className="p-8 space-y-8">
        {/* Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <MetricCard label="Total Women" value={stats?.total || 0} icon={<Users className="w-6 h-6" />} />
          <MetricCard label="In Pipeline" value={stats?.byPhase.filter(p => !['completed', 'research'].includes(p.project_phase)).reduce((a, b) => a + b.count, 0) || 0} icon={<GitBranch className="w-6 h-6" />} />
          <MetricCard label="Response Rate" value={`${stats?.responseRate || 0}%`} icon={<TrendingUp className="w-6 h-6" />} />
          <MetricCard label="Avg. Relevance" value={stats?.avgRelevance || 0} subtitle="out of 100" icon={<Star className="w-6 h-6" />} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">Pipeline Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pipelineData}>
                <XAxis dataKey="name" tick={{ fill: '#ffffff60', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#ffffff40', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="value" fill="#753BBD" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">By Country</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={countryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${getCountryFlag(name)} ${value}`}>
                  {countryData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: 12, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Top Prospects */}
          <GlassCard className="p-6 col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold">Top Prospects</h3>
              <button onClick={() => navigate('/collaborators')} className="text-sm text-dr-purple-light hover:text-dr-purple flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {prospects.map((p: any) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/collaborators/${p.id}`)}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dr-purple/20 flex items-center justify-center font-heading font-bold text-dr-purple">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{getCountryFlag(p.country)} {p.name}</p>
                      <p className="text-xs text-white/40">{p.profession} · {formatFollowers(p.total_followers)} followers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge {...(STATUS_COLORS[p.contact_status] || STATUS_COLORS.not_contacted)} />
                    <div className="text-right">
                      <p className="text-sm font-semibold text-dr-purple">{p.relevance_score}</p>
                      <p className="text-xs text-white/30">score</p>
                    </div>
                  </div>
                </div>
              ))}
              {prospects.length === 0 && (
                <p className="text-center text-white/30 py-8">No prospects yet. Start adding collaborators!</p>
              )}
            </div>
          </GlassCard>

          {/* Activity */}
          <GlassCard className="p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {timeline.map((t: any) => (
                <div key={t.id} className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-dr-purple flex-shrink-0" />
                  <div>
                    <p className="text-sm">
                      <span className="text-dr-purple-light">{t.collaborator_name}</span>
                      {' '}<span className="text-white/40">— {t.method}</span>
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">{t.note?.substring(0, 60)}{t.note?.length > 60 ? '...' : ''}</p>
                    <p className="text-xs text-white/20 mt-0.5">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {timeline.length === 0 && (
                <p className="text-center text-white/30 py-8">No activity yet</p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
