import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function BrandLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-3 focus-ring rounded-2xl', className)}>
      <Image
        src="/brand/smartcv-ai-mark.svg"
        alt="SmartCV AI"
        width={40}
        height={40}
        priority
        className="h-10 w-10"
      />
      {!compact && (
        <span className="text-xl font-extrabold tracking-tight leading-none">
          <span className="text-slate-950 dark:text-white">SmartCV</span>
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-300 dark:to-violet-300"> AI</span>
        </span>
      )}
    </Link>
  )
}
