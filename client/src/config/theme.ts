export const COLORS = {
  purple: '#753BBD',
  purpleLight: '#C1A7E2',
  purpleDark: '#512D6D',
  smoke: '#EAE7ED',
  smokeLight: '#F3F3F3',
  darkBg: '#0a0a14',
  darkCard: '#12121e',
  darkBorder: '#1e1e2e',
  darkSurface: '#16162a',
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  not_contacted: { bg: 'bg-gray-500/20', text: 'text-gray-300', label: 'Not Contacted' },
  contacted: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'Contacted' },
  in_negotiation: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', label: 'In Negotiation' },
  agreed: { bg: 'bg-green-500/20', text: 'text-green-300', label: 'Agreed' },
  declined: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Declined' },
  no_response: { bg: 'bg-orange-500/20', text: 'text-orange-300', label: 'No Response' },
};

export const PHASE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  research: { bg: 'bg-slate-500/20', text: 'text-slate-300', label: 'Research' },
  outreach: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'Outreach' },
  negotiation: { bg: 'bg-amber-500/20', text: 'text-amber-300', label: 'Negotiation' },
  contract: { bg: 'bg-purple-500/20', text: 'text-purple-300', label: 'Contract' },
  production: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', label: 'Production' },
  live: { bg: 'bg-green-500/20', text: 'text-green-300', label: 'Live' },
  completed: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: 'Completed' },
};

export const PRIORITY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-gray-500/20', text: 'text-gray-300', label: 'Low' },
  medium: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'Medium' },
  high: { bg: 'bg-orange-500/20', text: 'text-orange-300', label: 'High' },
  critical: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Critical' },
};

export const PROFESSIONS = [
  { value: 'singer', label: 'Singer' },
  { value: 'actress', label: 'Actress' },
  { value: 'politician', label: 'Politician' },
  { value: 'athlete', label: 'Athlete' },
  { value: 'model', label: 'Model' },
  { value: 'tv_host', label: 'TV Host' },
  { value: 'influencer', label: 'Influencer' },
  { value: 'businesswoman', label: 'Businesswoman' },
  { value: 'other', label: 'Other' },
];

export const COUNTRIES = [
  { value: 'DE', label: 'Germany', flag: '🇩🇪' },
  { value: 'AT', label: 'Austria', flag: '🇦🇹' },
  { value: 'HU', label: 'Hungary', flag: '🇭🇺' },
  { value: 'CZ', label: 'Czech Republic', flag: '🇨🇿' },
  { value: 'PL', label: 'Poland', flag: '🇵🇱' },
  { value: 'SK', label: 'Slovakia', flag: '🇸🇰' },
  { value: 'CH', label: 'Switzerland', flag: '🇨🇭' },
  { value: 'IT', label: 'Italy', flag: '🇮🇹' },
  { value: 'FR', label: 'France', flag: '🇫🇷' },
  { value: 'NL', label: 'Netherlands', flag: '🇳🇱' },
  { value: 'RO', label: 'Romania', flag: '🇷🇴' },
  { value: 'HR', label: 'Croatia', flag: '🇭🇷' },
  { value: 'SI', label: 'Slovenia', flag: '🇸🇮' },
  { value: 'RS', label: 'Serbia', flag: '🇷🇸' },
  { value: 'OTHER', label: 'Other', flag: '🌍' },
];

export const CHART_COLORS = ['#753BBD', '#C1A7E2', '#512D6D', '#9B6DD7', '#A78BFA', '#7C3AED', '#6D28D9', '#5B21B6'];

export function formatFollowers(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

export function getCountryFlag(code: string): string {
  return COUNTRIES.find(c => c.value === code)?.flag || '🌍';
}
