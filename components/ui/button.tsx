import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25',
  secondary:
    'border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
  dark:
    'bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-xl px-3 text-xs',
  md: 'h-11 rounded-2xl px-5 text-sm',
  lg: 'h-12 rounded-2xl px-6 text-sm',
  icon: 'h-10 w-10 rounded-2xl p-0',
}

type BaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type LinkButtonProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

export function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-ring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )

  if ('href' in props && props.href) {
    return (
      <Link className={classes} {...(rest as LinkButtonProps)} href={props.href}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonProps)}>
      {children}
    </button>
  )
}
