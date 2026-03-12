import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Instagram, Trash2, Edit2 } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { collaboratorsApi } from '../services/api';
import { Collaborator, CollaboratorFilters, PaginatedResponse } from '../types/collaborator';
import { STATUS_COLORS, PHASE_COLORS, PRIORITY_COLORS, PROFESSIONS, COUNTRIES, formatFollowers, getCountryFlag } from '../config/theme';

function CollaboratorForm({ initial, onSubmit, onClose }: { initial?: Collaborator | null; onSubmit: (data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: initial?.name || '', country: initial?.country || '', city: initial?.city || '',
    profession: initial?.profession || '', bio: initial?.bio || '',
    what_makes_special: initial?.what_makes_special || '', notable_achievements: initial?.notable_achievements || '',
    instagram_handle: initial?.instagram_handle || '', instagram_followers: initial?.instagram_followers || 0,
    tiktok_handle: initial?.tiktok_handle || '', tiktok_followers: initial?.tiktok_followers || 0,
    youtube_handle: initial?.youtube_handle || '', youtube_followers: initial?.youtube_followers || 0,
    twitter_handle: initial?.twitter_handle || '', twitter_followers: initial?.twitter_followers || 0,
    email: initial?.email || '', phone: initial?.phone || '',
    manager_name: initial?.manager_name || '', manager_email: initial?.manager_email || '', manager_phone: initial?.manager_phone || '',
    contact_status: initial?.contact_status || 'not_contacted', project_phase: initial?.project_phase || 'research',
    priority: initial?.priority || 'medium', assigned_to: initial?.assigned_to || '', notes: initial?.notes || '',
  });

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/40 mb-1">Name *</label>
          <input className="input-field w-full" value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm text-white/40 mb-1">Country *</label>
          <select className="input-field w-full" value={form.country} onChange={e => set('country', e.target.value)} required>
            <option value="">Select...</option>
            {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.flag} {c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/40 mb-1">City</label>
          <input className="input-field w-full" value={form.city} onChange={e => set('city', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-white/40 mb-1">Profession *</label>
          <select className="input-field w-full" value={form.profession} onChange={e => set('profession', e.target.value)} required>
            <option value="">Select...</option>
            {PROFESSIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/40 mb-1">Bio</label>
        <textarea className="input-field w-full h-20 resize-none" value={form.bio} onChange={e => set('bio', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-white/40 mb-1">What Makes Special</label>
        <textarea className="input-field w-full h-16 resize-none" value={form.what_makes_special} onChange={e => set('what_makes_special', e.target.value)} />
      </div>

      <h4 className="font-heading font-semibold text-dr-purple-light">Social Media</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/40 mb-1">Instagram</label>
          <input className="input-field w-full" value={form.instagram_handle} onChange={e => set('instagram_handle', e.target.value)} placeholder="@handle" />
        </div>
        <div>
          <label className="block text-sm text-white/40 mb-1">IG Followers</label>
          <input className="input-field w-full" type="number" value={form.instagram_followers} onChange={e => set('instagram_followers', parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <label className="block text-sm text-white/40 mb-1">TikTok</label>
          <input className="input-field w-full" value={form.tiktok_handle} onChange={e => set('tiktok_handle', e.target.value)} placeholder="@handle" />
        </div>
        <div>
          <label className="block text-sm text-white/40 mb-1">TikTok Followers</label>
          <input className="input-field w-full" type="number" value={form.tiktok_followers} onChange={e => set('tiktok_followers', parseInt(e.target.value) || 0)} />
        </div>
      </div>

      <h4 className="font-heading font-semibold text-dr-purple-light">Contact</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/40 mb-1">Email</label>
          <input className="input-field w-full" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-white/40 mb-1">Phone</label>
          <input className="input-field w-full" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-white/40 mb-1">Manager Name</label>
          <input className="input-field w-full" value={form.manager_name} onChange={e => set('manager_name', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-white/40 mb-1">Manager Email</label>
          <input className="input-field w-full" type="email" value={form.manager_email} onChange={e => set('manager_email', e.target.value)} />
        </div>
      </div>

      <h4 className="font-heading font-semibold text-dr-purple-light">Pipeline</h4>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-white/40 mb-1">Status</label>
          <select className="input-field w-full" value={form.contact_status} onChange={e => set('contact_status', e.target.value)}>
            {Object.entries(STATUS_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/40 mb-1">Phase</label>
          <select className="input-field w-full" value={form.project_phase} onChange={e => set('project_phase', e.target.value)}>
            {Object.entries(PHASE_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/40 mb-1">Priority</label>
          <select className="input-field w-full" value={form.priority} onChange={e => set('priority', e.target.value)}>
            {Object.entries(PRIORITY_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/40 mb-1">Notes</label>
        <textarea className="input-field w-full h-16 resize-none" value={form.notes} onChange={e => set('notes', e.target.value)} />
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">{initial ? 'Update' : 'Add Collaborator'}</button>
      </div>
    </form>
  );
}

export default function Collaborators() {
  const navigate = useNavigate();
  const [data, setData] = useState<PaginatedResponse<Collaborator> | null>(null);
  const [filters, setFilters] = useState<CollaboratorFilters>({ page: 1, limit: 25, sort: 'relevance_score', order: 'desc' });
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Collaborator | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    collaboratorsApi.list({ ...filters, search: search || undefined }).then(d => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filters, search]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (formData: any) => {
    await collaboratorsApi.create(formData);
    setShowForm(false);
    load();
  };

  const handleUpdate = async (formData: any) => {
    if (editItem) {
      await collaboratorsApi.update(editItem.id, formData);
      setEditItem(null);
      load();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this collaborator?')) {
      await collaboratorsApi.delete(id);
      load();
    }
  };

  const setFilter = (k: string, v: any) => setFilters(p => ({ ...p, [k]: v, page: 1 }));

  return (
    <div>
      <TopBar title="Collaborators" subtitle={`${data?.total || 0} women in database`} />
      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              className="input-field w-full pl-10"
              placeholder="Search by name, bio, notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field" value={filters.country || ''} onChange={e => setFilter('country', e.target.value)}>
            <option value="">All Countries</option>
            {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.flag} {c.label}</option>)}
          </select>
          <select className="input-field" value={filters.profession || ''} onChange={e => setFilter('profession', e.target.value)}>
            <option value="">All Professions</option>
            {PROFESSIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <select className="input-field" value={filters.contact_status || ''} onChange={e => setFilter('contact_status', e.target.value)}>
            <option value="">All Statuses</option>
            {Object.entries(STATUS_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Table */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  {['Name', 'Country', 'Profession', 'Followers', 'Status', 'Phase', 'Priority', 'Score', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs text-white/40 font-medium px-4 py-3 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.data.map((c: Collaborator) => (
                  <tr
                    key={c.id}
                    className="border-b border-dark-border/50 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => navigate(`/collaborators/${c.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-dr-purple/20 flex items-center justify-center font-heading font-bold text-sm text-dr-purple">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{c.name}</p>
                          {c.instagram_handle && <p className="text-xs text-white/30">@{c.instagram_handle}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{getCountryFlag(c.country)} {c.country}</td>
                    <td className="px-4 py-3 text-sm text-white/60 capitalize">{c.profession.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-sm">{formatFollowers(c.total_followers)}</td>
                    <td className="px-4 py-3"><Badge {...(STATUS_COLORS[c.contact_status] || STATUS_COLORS.not_contacted)} /></td>
                    <td className="px-4 py-3"><Badge {...(PHASE_COLORS[c.project_phase] || PHASE_COLORS.research)} /></td>
                    <td className="px-4 py-3"><Badge {...(PRIORITY_COLORS[c.priority] || PRIORITY_COLORS.medium)} /></td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-dr-purple">{c.relevance_score}</span>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditItem(c)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-dark-border">
              <p className="text-sm text-white/40">
                Page {data.page} of {data.totalPages} ({data.total} total)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilters(p => ({ ...p, page: Math.max(1, (p.page || 1) - 1) }))}
                  disabled={data.page <= 1}
                  className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setFilters(p => ({ ...p, page: Math.min(data.totalPages, (p.page || 1) + 1) }))}
                  disabled={data.page >= data.totalPages}
                  className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </GlassCard>

        {loading && <div className="text-center py-8"><div className="w-6 h-6 border-2 border-dr-purple border-t-transparent rounded-full animate-spin mx-auto" /></div>}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Collaborator" wide>
        <CollaboratorForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      </Modal>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Collaborator" wide>
        <CollaboratorForm initial={editItem} onSubmit={handleUpdate} onClose={() => setEditItem(null)} />
      </Modal>
    </div>
  );
}
