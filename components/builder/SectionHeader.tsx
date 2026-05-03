import { type LucideIcon } from 'lucide-react'

interface SectionHeaderProps {
  icon: LucideIcon
  title: string
  description: string
}

export function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center dark:bg-teal-400/10">
          <Icon size={15} className="text-teal-600" />
        </div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground ml-9">{description}</p>
    </div>
  )
}
