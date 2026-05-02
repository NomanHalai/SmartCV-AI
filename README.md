# SmartCV AI

AI-powered resume builder SaaS UI for creating recruiter-ready, ATS-optimized resumes.

## Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS with shadcn-style reusable primitives
- Lucide React icons
- Framer Motion animations
- Zustand resume builder state
- Existing API routes for parsing, ATS scoring, AI suggestions, and DOCX export

## Pages

- `/` Landing page
- `/dashboard` SaaS dashboard
- `/builder` Resume builder
- `/templates` Templates gallery
- `/ats-checker` ATS score checker
- `/pricing` Pricing page
- `/auth/login` Login page
- `/auth/register` Registration page

## Project Structure

```txt
smartcv-ai/
├── app/
│   ├── page.tsx
│   ├── dashboard/page.tsx
│   ├── builder/page.tsx
│   ├── templates/page.tsx
│   ├── ats-checker/page.tsx
│   ├── pricing/page.tsx
│   ├── auth/page.tsx
│   ├── auth/login/page.tsx
│   ├── auth/register/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── api/
├── components/
│   ├── ui/
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   └── skeleton.tsx
│   ├── saas/
│   │   ├── auth-panel.tsx
│   │   ├── brand-logo.tsx
│   │   ├── product-data.ts
│   │   ├── resume-mockup.tsx
│   │   ├── score-ring.tsx
│   │   └── template-card.tsx
│   ├── builder/
│   ├── ats/
│   └── preview/
├── public/
│   └── brand/
│       ├── smartcv-ai-logo.svg
│       └── smartcv-ai-mark.svg
├── lib/
├── store/
├── types/
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Package Notes

`package.json` has been updated for the requested SaaS UI stack:

- Project name changed to `smartcv-ai`
- `next` updated to `^15.3.0`
- React kept on `^18.3.1` for compatibility with the existing PDF/export dependencies
- `framer-motion`, `lucide-react`, Tailwind, and the existing resume/AI dependencies are retained
- Removed `@types/mammoth` because that package does not exist in npm; `mammoth` is kept

## Run Locally

```bash
npm install
npm run dev
```

The previous install attempt hit local disk space/cache issues in this environment, so dependencies were not installed here.
