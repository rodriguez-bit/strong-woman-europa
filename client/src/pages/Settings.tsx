import TopBar from '../components/layout/TopBar';
import GlassCard from '../components/ui/GlassCard';
import { Shield, Database, Cpu } from 'lucide-react';

export default function Settings() {
  return (
    <div>
      <TopBar title="Settings" subtitle="Application configuration" />
      <div className="p-8 space-y-6 max-w-3xl mx-auto">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-5 h-5 text-dr-purple" />
            <h3 className="font-heading font-semibold">AI Configuration</h3>
          </div>
          <p className="text-sm text-white/40 mb-4">
            Claude AI is used for collaborator discovery and analysis. API key is configured on the server.
          </p>
          <div className="p-3 rounded-xl bg-green-500/10 text-sm text-green-400">
            AI Service: Connected
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-dr-purple" />
            <h3 className="font-heading font-semibold">Database</h3>
          </div>
          <p className="text-sm text-white/40">
            SQLite database stored locally. Data is persistent across restarts.
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-dr-purple" />
            <h3 className="font-heading font-semibold">About</h3>
          </div>
          <div className="space-y-2 text-sm text-white/40">
            <p>Strong Woman Europa v1.0</p>
            <p>Built for Dajana Rodriguez</p>
            <p>Project: Silne Zeny - European Ambassador Discovery</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
