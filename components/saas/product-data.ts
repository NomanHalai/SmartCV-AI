import {
  BadgeCheck,
  BarChart3,
  Bot,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Gauge,
  LayoutTemplate,
  LineChart,
  Lock,
  MessageSquareText,
  Palette,
  PenLine,
  Rocket,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from 'lucide-react'

export const navItems = [
  { label: 'Features', href: '/#features' },
  { label: 'Templates', href: '/templates' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'ATS Checker', href: '/ats-checker' },
]

export const features = [
  {
    icon: Brain,
    title: 'AI Resume Writing',
    description: 'Turn rough career notes into recruiter-ready bullets with impact metrics and crisp role language.',
  },
  {
    icon: Gauge,
    title: 'ATS Optimization',
    description: 'Score every resume against a job description and see keyword gaps before you apply.',
  },
  {
    icon: LayoutTemplate,
    title: 'Premium Templates',
    description: 'Choose polished layouts built for product, engineering, finance, marketing, and leadership roles.',
  },
  {
    icon: MessageSquareText,
    title: 'AI Interview Framing',
    description: 'Get suggested talking points from your resume achievements so your application tells one story.',
  },
  {
    icon: Palette,
    title: 'Theme Controls',
    description: 'Tune typography, accent color, density, and section order while keeping everything ATS-safe.',
  },
  {
    icon: ShieldCheck,
    title: 'Private By Design',
    description: 'Your workspace is designed around secure document handling, export control, and professional review.',
  },
]

export const stats = [
  { label: 'Resumes created', value: '38.4k' },
  { label: 'Average ATS lift', value: '+31%' },
  { label: 'Template rating', value: '4.9/5' },
]

export const templates = [
  {
    name: 'Executive Slate',
    role: 'Leadership and operations',
    score: 96,
    accent: 'from-slate-900 to-indigo-700',
    layout: 'Classic two-column',
  },
  {
    name: 'Product Clarity',
    role: 'Product managers',
    score: 94,
    accent: 'from-indigo-600 to-sky-500',
    layout: 'Impact-first',
  },
  {
    name: 'Engineering Signal',
    role: 'Software engineers',
    score: 98,
    accent: 'from-blue-600 to-cyan-500',
    layout: 'Project-rich',
  },
  {
    name: 'Creative Systems',
    role: 'Design and marketing',
    score: 92,
    accent: 'from-violet-600 to-fuchsia-500',
    layout: 'Portfolio-led',
  },
  {
    name: 'Consulting Edge',
    role: 'Consultants and analysts',
    score: 95,
    accent: 'from-emerald-600 to-teal-500',
    layout: 'Case-study style',
  },
  {
    name: 'Graduate Launch',
    role: 'Students and early career',
    score: 91,
    accent: 'from-amber-500 to-orange-500',
    layout: 'Skills-forward',
  },
]

export const testimonials = [
  {
    name: 'Sophia Bennett',
    role: 'Senior Product Designer',
    quote: 'SmartCV AI helped me rewrite my experience around outcomes. I went from no callbacks to four recruiter screens in two weeks.',
  },
  {
    name: 'Arjun Mehta',
    role: 'Frontend Engineer',
    quote: 'The ATS checker made the gaps obvious. The builder felt polished enough that I stopped fighting formatting and focused on content.',
  },
  {
    name: 'Maya Thompson',
    role: 'Growth Marketing Lead',
    quote: 'The AI suggestions were specific, not generic. It helped me quantify work I had been underselling for years.',
  },
]

export const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    cadence: 'forever',
    description: 'For exploring templates and building a polished first resume.',
    features: ['1 active resume', '3 ATS scans per month', 'Basic templates', 'PDF export'],
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$12',
    cadence: 'per month',
    description: 'For active job seekers who want AI writing and serious optimization.',
    features: ['Unlimited resumes', 'Unlimited ATS scans', 'AI bullet rewrites', 'DOCX and PDF export', 'Premium templates'],
    cta: 'Upgrade to Pro',
    featured: true,
  },
  {
    name: 'Career Team',
    price: '$29',
    cadence: 'per seat',
    description: 'For coaches, bootcamps, and teams supporting many candidates.',
    features: ['Shared template library', 'Candidate analytics', 'Review comments', 'Brand controls', 'Priority support'],
    cta: 'Contact sales',
    featured: false,
  },
]

export const dashboardMetrics = [
  { label: 'Active resumes', value: '7', change: '+2 this week', icon: FileText },
  { label: 'Avg. ATS score', value: '87%', change: '+14% after AI edits', icon: Gauge },
  { label: 'Recruiter views', value: '124', change: '18 new views', icon: LineChart },
  { label: 'Profile strength', value: '90%', change: 'Excellent', icon: BadgeCheck },
]

export const recentResumes = [
  { title: 'Product Designer Resume', updated: 'Updated 2 days ago', score: 92, status: 'Ready' },
  { title: 'Frontend Developer Resume', updated: 'Updated 5 days ago', score: 88, status: 'Needs keywords' },
  { title: 'Marketing Manager Resume', updated: 'Updated 1 week ago', score: 76, status: 'Improve summary' },
]

export const assistantActions = [
  { label: 'Improve my summary', icon: WandSparkles },
  { label: 'Suggest skills', icon: Sparkles },
  { label: 'Write work experience', icon: PenLine },
  { label: 'Optimize for ATS', icon: Gauge },
]

export const builderSteps = [
  { label: 'Profile', icon: FileText, complete: true },
  { label: 'Experience', icon: BriefcaseBusiness, complete: true },
  { label: 'AI Enhancements', icon: Bot, complete: false },
  { label: 'Theme', icon: Palette, complete: false },
  { label: 'Export', icon: Rocket, complete: false },
]

export const faqs = [
  {
    question: 'Is SmartCV AI safe for ATS systems?',
    answer: 'Yes. Templates use semantic sections, readable typography, and restrained formatting so parsing tools can understand your resume.',
  },
  {
    question: 'Can I export PDF and DOCX files?',
    answer: 'Yes. The product experience includes PDF, DOCX, and plain text export options for different application portals.',
  },
  {
    question: 'Does it replace a career coach?',
    answer: 'It speeds up drafting and optimization, then gives you a clear quality signal before you send applications.',
  },
  {
    question: 'Do I need a job description?',
    answer: 'You can build without one, but ATS scoring and keyword recommendations become much stronger when you paste the role description.',
  },
]

export const trustItems = [
  { label: 'SOC2-ready workflows', icon: Lock },
  { label: 'Recruiter-tested templates', icon: CheckCircle2 },
  { label: 'AI suggestions with context', icon: Sparkles },
  { label: 'Application analytics', icon: BarChart3 },
]
