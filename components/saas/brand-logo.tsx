import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function BrandLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-3 focus-ring rounded-2xl', className)}>
      <Image
        src={compact ? '/brand/smartcv-ai-mark.svg' : '/brand/smartcv-ai-logo.svg'}
        alt="SmartCV AI"
        width={compact ? 40 : 182}
        height={40}
        priority
        className={compact ? 'h-10 w-10' : 'h-10 w-auto'}
      />
    </Link>
  )
}
