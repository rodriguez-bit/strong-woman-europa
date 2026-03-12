import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, GitBranch, Brain, Upload, Settings, Crown } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/collaborators', icon: Users, label: 'Collaborators' },
  { to: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { to: '/ai', icon: Brain, label: 'AI Discovery' },
  { to: '/import', icon: Upload, label: 'Import' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-card border-r border-dark-border flex flex-col z-50">
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dr-purple/20 flex items-center justify-center">
            <Crown className="w-5 h-5 text-dr-purple" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold text-white">Strong Woman</h1>
            <p className="text-xs text-dr-purple-light">Europa</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-dr-purple/20 text-dr-purple-light border border-dr-purple/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-dark-border">
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-white/40">Powered by</p>
          <p className="text-sm font-heading font-semibold text-dr-purple-light">Dajana Rodriguez</p>
        </div>
      </div>
    </aside>
  );
}
