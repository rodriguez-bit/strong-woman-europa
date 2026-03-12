import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Instagram, Send, Brain, Calendar, Phone, Mail, User, ExternalLink } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { collaboratorsApi, outreachApi, aiApi } from '../services/api';
import { Collaborator, ContactLog } from '../types/collaborator';
import { STATUS_COLORS, PHASE_COLORS, PRIORITY_COLORS, formatFollowers, getCountryFlag } from '../config/theme';

export default function CollaboratorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Collaborator | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ method: 'email', note: '', follow_up_date: '', direction: 'outbound' });

  useEffect(() => {
    if (id) collaboratorsApi.get(parseInt(id)).then(setData);
  }, [id]);

  const handleAddContact = async () => {
    if (!id || !contactForm.note) return;
    await outreachApi.addContact(parseInt(id), contactForm);
    setShowContactForm(false);
    setContactForm({ method: 'email', note: '', follow_up_date: '', direction: 'outbound' });
    collaboratorsApi.get(parseInt(id)).then(setData);
  };

  const handleAnalyze = async () => {
    if (!id) return;
    setAnalyzing(true);
    try {
      const res = await aiApi.analyze(parseInt(id));
      setAnalysis(res.analysis);
    } catch { setAnalysis('AI analysis failed. Check API key.'); }
    setAnalyzing(false);
  };

  const handleStatusChange = async (field: string, value: string) => {
    if (!id) return;
    await collaboratorsApi.updateStatus(parseInt(id), { [field]: value });
    collaboratorsApi.get(parseInt(id)).then(setData);
  };

  if (!data) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 border-2 border-dr-purple border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <TopBar title={data.name} subtitle={`${getCountryFlag(data.country)} ${data.country} · ${data.profession}`} />
      <div className="p-8 space-y-6">
        <button onClick={() => navigate('/collaborators')} className="flex items-center gap-2 text-sm text-white/40 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to list
        </button>

        <div className="grid grid-cols-3 gap-6">
          {/* Profile */}
          <GlassCard className="p-6 space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-dr-purple/20 flex items-center justify-center font-heading text-3xl font-bold text-dr-purple">
                {data.name.charAt(0)}
              </div>
              <h2 className="font-heading text-2xl font-bold mt-3">{data.name}</h2>
              <p className="text-sm text-white/40">{getCountryFlag(data.country)} {data.city ? `${data.city}, ` : ''}{data.country}</p>
              <p className="text-sm text-dr-purple-light capitalize mt-1">{data.profession.replace('_', ' ')}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/40">Relevance Score</span>
                <span className="text-lg font-bold text-dr-purple">{data.relevance_score}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-dr-purple to-dr-purple-light h-2 rounded-full" style={{ width: `${data.relevance_score}%` }} />
              </div>
            </div>

            {/* Social */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase text-white/30 tracking-wider">Social Media</h4>
              {data.instagram_handle && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-400" /><span className="text-sm">@{data.instagram_handle}</span></div>
                  <span className="text-sm font-semibold">{formatFollowers(data.instagram_followers)}</span>
                </div>
              )}
              {data.tiktok_handle && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2"><span className="text-sm">TikTok</span><span className="text-sm text-white/60">@{data.tiktok_handle}</span></div>
                  <span className="text-sm font-semibold">{formatFollowers(data.tiktok_followers)}</span>
                </div>
              )}
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-sm text-white/40">Total Followers</span>
                <span className="text-sm font-bold text-dr-purple">{formatFollowers(data.total_followers)}</span>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase text-white/30 tracking-wider">Contact Info</h4>
              {data.email && <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-white/40" />{data.email}</div>}
              {data.phone && <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-white/40" />{data.phone}</div>}
              {data.manager_name && <div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-white/40" />Manager: {data.manager_name}</div>}
              {data.manager_email && <div className="flex items-center gap-2 text-sm text-white/40"><Mail className="w-3 h-3" />{data.manager_email}</div>}
            </div>

            {/* Pipeline Status */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase text-white/30 tracking-wider">Pipeline</h4>
              <div>
                <label className="text-xs text-white/30">Status</label>
                <select className="input-field w-full mt-1" value={data.contact_status} onChange={e => handleStatusChange('contact_status', e.target.value)}>
                  {Object.entries(STATUS_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/30">Phase</label>
                <select className="input-field w-full mt-1" value={data.project_phase} onChange={e => handleStatusChange('project_phase', e.target.value)}>
                  {Object.entries(PHASE_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/30">Priority</label>
                <select className="input-field w-full mt-1" value={data.priority} onChange={e => handleStatusChange('priority', e.target.value)}>
                  {Object.entries(PRIORITY_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Contact Timeline + AI */}
          <div className="col-span-2 space-y-6">
            {/* Bio */}
            {(data.bio || data.what_makes_special || data.notable_achievements) && (
              <GlassCard className="p-6 space-y-3">
                {data.bio && <div><h4 className="text-xs uppercase text-white/30 tracking-wider mb-1">Bio</h4><p className="text-sm text-white/70">{data.bio}</p></div>}
                {data.what_makes_special && <div><h4 className="text-xs uppercase text-white/30 tracking-wider mb-1">What Makes Special</h4><p className="text-sm text-white/70">{data.what_makes_special}</p></div>}
                {data.notable_achievements && <div><h4 className="text-xs uppercase text-white/30 tracking-wider mb-1">Achievements</h4><p className="text-sm text-white/70">{data.notable_achievements}</p></div>}
                {data.notes && <div><h4 className="text-xs uppercase text-white/30 tracking-wider mb-1">Notes</h4><p className="text-sm text-white/70">{data.notes}</p></div>}
              </GlassCard>
            )}

            {/* Contact Timeline */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold">Contact History</h3>
                <button onClick={() => setShowContactForm(true)} className="btn-primary text-sm flex items-center gap-2">
                  <Send className="w-4 h-4" /> Log Contact
                </button>
              </div>
              <div className="space-y-4">
                {data.contacts?.map((c: ContactLog) => (
                  <div key={c.id} className="flex gap-4 p-3 rounded-xl bg-white/5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-dr-purple/20 flex items-center justify-center">
                      {c.direction === 'outbound' ? <Send className="w-4 h-4 text-dr-purple" /> : <Mail className="w-4 h-4 text-green-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge bg="bg-dr-purple/20" text="text-dr-purple-light" label={c.method} />
                        <span className="text-xs text-white/30">{c.direction}</span>
                        <span className="text-xs text-white/20 ml-auto">{new Date(c.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-white/70 mt-1">{c.note}</p>
                      {c.follow_up_date && (
                        <p className={`text-xs mt-1 flex items-center gap-1 ${c.follow_up_done ? 'text-green-400' : 'text-yellow-400'}`}>
                          <Calendar className="w-3 h-3" /> Follow-up: {c.follow_up_date} {c.follow_up_done ? '(done)' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {(!data.contacts || data.contacts.length === 0) && (
                  <p className="text-center text-white/30 py-6">No contact history yet</p>
                )}
              </div>
            </GlassCard>

            {/* AI Analysis */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-dr-purple" /> AI Analysis
                </h3>
                <button onClick={handleAnalyze} disabled={analyzing} className="btn-primary text-sm">
                  {analyzing ? 'Analyzing...' : 'Run Analysis'}
                </button>
              </div>
              {analysis ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-white/70 font-body">{analysis}</pre>
                </div>
              ) : (
                <p className="text-center text-white/30 py-6">Click "Run Analysis" to get AI-powered insights about this collaborator</p>
              )}
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <Modal open={showContactForm} onClose={() => setShowContactForm(false)} title="Log Contact">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/40 mb-1">Method</label>
              <select className="input-field w-full" value={contactForm.method} onChange={e => setContactForm(p => ({ ...p, method: e.target.value }))}>
                <option value="email">Email</option>
                <option value="dm">DM</option>
                <option value="phone">Phone</option>
                <option value="manager">Via Manager</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-1">Direction</label>
              <select className="input-field w-full" value={contactForm.direction} onChange={e => setContactForm(p => ({ ...p, direction: e.target.value }))}>
                <option value="outbound">Outbound</option>
                <option value="inbound">Inbound</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/40 mb-1">Note *</label>
            <textarea className="input-field w-full h-24 resize-none" value={contactForm.note} onChange={e => setContactForm(p => ({ ...p, note: e.target.value }))} placeholder="What happened..." />
          </div>
          <div>
            <label className="block text-sm text-white/40 mb-1">Follow-up Date</label>
            <input type="date" className="input-field w-full" value={contactForm.follow_up_date} onChange={e => setContactForm(p => ({ ...p, follow_up_date: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowContactForm(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAddContact} className="btn-primary">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
