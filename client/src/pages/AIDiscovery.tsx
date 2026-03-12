import { useState } from 'react';
import { Brain, Search, Plus, Sparkles, Users, MapPin, Star } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import GlassCard from '../components/ui/GlassCard';
import { aiApi, collaboratorsApi } from '../services/api';
import { AISuggestion } from '../types/collaborator';
import { formatFollowers, getCountryFlag } from '../config/theme';

const QUICK_SEARCHES = [
  'German actress with 500K+ followers who supports women causes',
  'Hungarian singer popular on Instagram and TikTok',
  'Austrian model or TV host with strong personal brand',
  'Polish athlete or sports figure known for empowering women',
  'Czech influencer with engagement in fashion and lifestyle',
];

export default function AIDiscovery() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addedNames, setAddedNames] = useState<Set<string>>(new Set());

  const handleSearch = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    setSuggestions([]);
    try {
      const res = await aiApi.suggest(searchQuery);
      setSuggestions(res.suggestions || []);
    } catch (err: any) {
      setError(err.message || 'AI search failed');
    }
    setLoading(false);
  };

  const handleAddToPipeline = async (s: AISuggestion) => {
    try {
      await collaboratorsApi.create({
        name: s.name,
        country: s.country,
        city: s.city || '',
        profession: s.profession,
        instagram_handle: s.instagram_handle || '',
        instagram_followers: s.instagram_followers_estimate || 0,
        tiktok_handle: s.tiktok_handle || '',
        tiktok_followers: s.tiktok_followers_estimate || 0,
        notable_achievements: s.notable_achievements || '',
        bio: s.why_good_fit,
        notes: `AI suggested. Known contact: ${s.known_contact_approach || 'Unknown'}`,
        contact_status: 'not_contacted',
        project_phase: 'research',
        priority: s.relevance_score_estimate > 75 ? 'high' : s.relevance_score_estimate > 50 ? 'medium' : 'low',
      });
      setAddedNames(prev => new Set(prev).add(s.name));
    } catch (err: any) {
      alert('Failed to add: ' + err.message);
    }
  };

  return (
    <div>
      <TopBar title="AI Discovery" subtitle="Find potential collaborators with AI" />
      <div className="p-8 space-y-6">
        {/* Search */}
        <GlassCard className="p-6 glow-purple">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-dr-purple" />
            <h3 className="font-heading text-lg font-semibold">Ask AI to Find Women</h3>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dr-purple/50" />
              <input
                className="input-field w-full pl-12 pr-4 py-3 text-base"
                placeholder="Describe who you're looking for... e.g., 'German actress with 500K+ followers'"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button onClick={() => handleSearch()} disabled={loading} className="btn-primary flex items-center gap-2 px-8">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
              Search
            </button>
          </div>

          {/* Quick searches */}
          <div className="flex flex-wrap gap-2 mt-4">
            {QUICK_SEARCHES.map(qs => (
              <button
                key={qs}
                onClick={() => { setQuery(qs); handleSearch(qs); }}
                className="text-xs px-3 py-1.5 rounded-full bg-dr-purple/10 text-dr-purple-light hover:bg-dr-purple/20 transition-colors"
              >
                {qs.substring(0, 50)}{qs.length > 50 ? '...' : ''}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Error */}
        {error && (
          <GlassCard className="p-4 border-red-500/30">
            <p className="text-red-400 text-sm">{error}</p>
          </GlassCard>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-3 border-dr-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/40">AI is searching for the best matches...</p>
          </div>
        )}

        {/* Results */}
        {suggestions.length > 0 && (
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">
              <Sparkles className="inline w-5 h-5 text-dr-purple mr-2" />
              AI Suggestions ({suggestions.length})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {suggestions.map((s, i) => (
                <GlassCard key={i} className="p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-dr-purple/5 rounded-bl-[40px]" />
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-heading font-bold text-lg">{getCountryFlag(s.country)} {s.name}</h4>
                      <p className="text-sm text-dr-purple-light capitalize">{s.profession.replace('_', ' ')}</p>
                      {s.city && <p className="text-xs text-white/30 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{s.city}, {s.country}</p>}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-dr-purple" />
                        <span className="font-bold text-dr-purple">{s.relevance_score_estimate}</span>
                      </div>
                      <span className="text-xs text-white/30">relevance</span>
                    </div>
                  </div>

                  <p className="text-sm text-white/60 mb-3">{s.why_good_fit}</p>

                  <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                    {s.instagram_handle && <span>IG: @{s.instagram_handle}</span>}
                    {s.instagram_followers_estimate && <span>{formatFollowers(s.instagram_followers_estimate)} followers</span>}
                    {s.tiktok_handle && <span>TT: @{s.tiktok_handle}</span>}
                  </div>

                  {s.notable_achievements && (
                    <p className="text-xs text-white/30 mb-3">{s.notable_achievements}</p>
                  )}

                  {s.known_contact_approach && (
                    <p className="text-xs text-white/40 mb-4">Contact: {s.known_contact_approach}</p>
                  )}

                  <button
                    onClick={() => handleAddToPipeline(s)}
                    disabled={addedNames.has(s.name)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      addedNames.has(s.name)
                        ? 'bg-green-500/20 text-green-300 cursor-default'
                        : 'btn-primary'
                    }`}
                  >
                    {addedNames.has(s.name) ? (
                      <>Added to Pipeline</>
                    ) : (
                      <><Plus className="w-4 h-4" /> Add to Pipeline</>
                    )}
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && suggestions.length === 0 && !error && (
          <div className="text-center py-16">
            <Brain className="w-16 h-16 text-dr-purple/30 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold text-white/40 mb-2">AI-Powered Discovery</h3>
            <p className="text-sm text-white/20 max-w-md mx-auto">
              Describe the type of woman you're looking for and AI will suggest real European celebrities, influencers, and public figures that match your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
