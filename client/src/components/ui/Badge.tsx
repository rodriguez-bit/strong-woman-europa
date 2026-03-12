interface BadgeProps {
  bg: string;
  text: string;
  label: string;
}

export default function Badge({ bg, text, label }: BadgeProps) {
  return (
    <span className={`badge ${bg} ${text}`}>
      {label}
    </span>
  );
}
