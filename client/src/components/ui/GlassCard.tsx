import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', hover = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`${hover ? 'glass-card-hover cursor-pointer' : 'glass-card'} ${className}`}
    >
      {children}
    </div>
  );
}
