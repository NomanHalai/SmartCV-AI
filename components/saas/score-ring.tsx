import { cn } from '@/lib/utils'

export function ScoreRing({
  score,
  size = 116,
  className,
}: {
  score: number
  size?: number
  className?: string
}) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 112 112" className="h-full w-full">
        <circle cx="56" cy="56" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="url(#smartcv-score-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 56 56)"
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="smartcv-score-gradient" x1="12" x2="96" y1="18" y2="96" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F46E5" />
            <stop offset="0.5" stopColor="#7C3AED" />
            <stop offset="1" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-bold tracking-tight text-foreground">{score}</div>
        <div className="text-[11px] font-semibold text-emerald-600">Excellent</div>
      </div>
    </div>
  )
}
