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

## Auth And Theme Notes

- Authentication uses Firebase Authentication with email/password and Google OAuth.
- The client exchanges Firebase ID tokens for secure HTTP-only session cookies through `/api/auth/session`.
- Protected screens redirect unauthenticated users to `/auth/login` through `middleware.ts`.
- Protected API routes verify the Firebase session cookie with Firebase Admin SDK.
- User profiles are stored in Firestore under `users/{uid}` when a session is created.
- Light/dark mode is handled by a shared theme provider and persisted in local storage.

Required Netlify environment variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
ANTHROPIC_API_KEY=
```

`FIREBASE_PRIVATE_KEY` can be stored with escaped newlines. The server code converts `\\n` to real newlines.

## Run Locally

```bash
npm install
npm run dev
```

The previous install attempt hit local disk space/cache issues in this environment, so dependencies were not installed here.
