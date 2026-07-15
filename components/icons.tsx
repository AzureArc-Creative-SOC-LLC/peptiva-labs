import type { SVGProps } from "react";

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PlanIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="5" width="16" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M4 11h16" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  );
}

export function HeartPulseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 1.7-.7 3.3-1.7 4.6" />
      <path d="M4 14h3l1.5-3L11 17l1.5-4 1.5 1.5h4" />
    </svg>
  );
}

export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19c0-8 5-13 14-13 0 9-5 14-13 14a4 4 0 0 1-1-1z" />
      <path d="M5 19c5-3 8-7 10-12" />
    </svg>
  );
}

export function DumbbellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 9v6M6 7v10M18 7v10M21 9v6" />
      <path d="M6 12h12" />
    </svg>
  );
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3z" />
    </svg>
  );
}

export function CoachIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1-3.5 4-5.5 7.5-5.5s6.5 2 7.5 5.5" />
    </svg>
  );
}

export function ChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V8M10 20v-6M16 20V4M22 20H2" />
    </svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={18} height={18} {...props}>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function QuoteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={32} height={32} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.5 6C6.5 7.3 5 9.7 5 13.2V18h5v-5H7.6c.1-1.8.9-3 2.4-3.6L9.5 6zm9 0c-3 1.3-4.5 3.7-4.5 7.2V18h5v-5h-2.4c.1-1.8.9-3 2.4-3.6L18.5 6z" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function DotIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width={8}
      height={8}
      viewBox="0 0 8 8"
      className={className}
      aria-hidden
    >
      <circle cx="4" cy="4" r="3" fill="currentColor" />
    </svg>
  );
}

export function PenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3h6" />
      <path d="M10 3v12a3 3 0 0 0 6 0V3" />
      <path d="M10 9h6" />
    </svg>
  );
}

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

export function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16v11H8l-4 4V5z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  );
}

export function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 4h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
      <circle cx="9.5" cy="20" r="1.3" />
      <circle cx="17.5" cy="20" r="1.3" />
    </svg>
  );
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    </svg>
  );
}

export function ArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="M19 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-ink_btn">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5.5 15.5 12 6.5l6.5 9"
            stroke="#fff"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="5.5" cy="15.5" r="2.1" fill="#fff" />
          <circle cx="12" cy="6.5" r="2.1" fill="#fff" />
          <circle cx="18.5" cy="15.5" r="2.1" fill="#fff" />
        </svg>
      </span>
      <span className="font-display text-[21px] font-medium leading-none tracking-tight2 text-ink">
        Peptiva Labs
      </span>
    </span>
  );
}
