import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function BrandLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-3 focus-ring rounded-2xl', className)}>
      {compact ? (
        <Image
          src="/brand/smartcv-ai-mark.svg"
          alt="SmartCV AI"
          width={40}
          height={40}
          priority
          className="h-10 w-10"
        />
      ) : (
        <>
          <Image
            src="/brand/smartcv-ai-logo-light.svg"
            alt="SmartCV AI"
            width={196}
            height={48}
            priority
            className="h-10 w-auto dark:hidden"
          />
          <Image
            src="/brand/smartcv-ai-logo-dark.svg"
            alt="SmartCV AI"
            width={196}
            height={48}
            priority
            className="hidden h-10 w-auto dark:block"
          />
        </>
      )}
    </Link>
  )
}
