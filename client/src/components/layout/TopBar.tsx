import { Bell, Search } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-16 border-b border-dark-border flex items-center justify-between px-8">
      <div>
        <h2 className="font-heading text-xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-white/40">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Quick search..."
            className="input-field pl-10 pr-4 py-2 text-sm w-64"
          />
        </div>
        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-white/60" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-dr-purple rounded-full" />
        </button>
      </div>
    </header>
  );
}
