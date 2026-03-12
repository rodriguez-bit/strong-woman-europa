import GlassCard from './GlassCard';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
}

export default function MetricCard({ label, value, subtitle, icon, trend }: MetricCardProps) {
  return (
    <GlassCard className="p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-dr-purple to-dr-purple-dark rounded-l-2xl" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/40 mb-1">{label}</p>
          <p className="text-3xl font-heading font-bold">{value}</p>
          {subtitle && <p className="text-xs text-white/30 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-2 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.positive ? '+' : ''}{trend.value}%
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-dr-purple/10 flex items-center justify-center text-dr-purple">
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}
