# AIQ Readiness Quiz - PRD (MVP)

## Goal
Help users assess their AI readiness quickly and share a simple result. MVP is fully client-side (no backend), fast, and privacy-respecting.

## Users
- Primary: Individuals curious about their AI readiness.
- Secondary: People who receive a shared result link and want to try the quiz.

## Success metrics (MVP)
- Users can complete quiz in under 2 minutes.
- Results are deterministic and understandable.
- Sharing produces a working URL that can be opened elsewhere.

## Architecture (MVP)
- Client-only Next.js App Router.
- Local state persisted in `localStorage`.
- No database or server APIs.

## Screens / Flow
1. Landing
   - CTA to start quiz.
2. Confidence
   - Slider 0–100.
3. Questions (1–8)
   - Single- or multi-select options.
4. Email Capture (optional)
   - Captured locally only (no network).
   - Layout:
     - Centered logo (from `Card`), Start over button top-right.
     - Headline: "Your Results Are Ready".
     - Red subhead strip: "See your score, confidence level and more!".
     - Teaser preview: results card shown blurred with lock icon to signal it's computed and gated.
     - Gift strip: "🎁 Free bonus: AI Prompt Mastery (7-page PDF)." on first line; second line smaller, italic: "Delivered when you unlock your results.".
     - Email field labeled "Enter your email" (required to unlock CTA).
     - Optional role chips (single select): Product, Marketing, Sales, Finance, HR, C‑Level, Engineering, Educator, Other.
     - Primary CTA: "Unlock my Results" (enabled when email valid).
     - Trust note: xs grey "We never share your responses. Unsubscribe anytime.".
     - Secondary CTA: "Skip for now (for demo only)" goes to Results.
5. Results
   - Recommendation + reasons + next steps.
   - Share button copies URL.
6. Shared Results
   - Route: `/r/[id]` renders a read-only view.

## Data Model
- Question
  - `id: string`
  - `text: string`
  - `options: string[]`
  - `multiSelect?: boolean`
- QuizState
  - `currentStep: 'landing' | 'confidence' | 'question' | 'email' | 'results'`
  - `confidence: number`
  - `answers: Record<string, string | string[]>`
  - `currentQuestion?: number`
  - `email?: string`
  - `role?: string`
  - `completedAt?: string`

## Scoring/Recommendation Logic (MVP)
- Input: `confidence`, selected `answers`.
- Output: `{ recommendation: string, reasons: string[], nextSteps: string[] }`
- Simple tiers: Beginner, Learner, Practitioner, Power User based on confidence, usage frequency, and tool breadth.

## Share Behavior
- Encode `{ confidence, answers }` as JSON, then Base64URL (no `+`, `/`, or `=`) → `/r/[id]`.
- Decode on the shared results route only.
- No PII beyond answers and confidence; email is NOT included.

## Non-Goals (MVP)
- No authentication or server persistence.
- No complex analytics.
- No A/B testing.

## Accessibility & UX
- Keyboard navigable controls.
- Sufficient contrast.
- Clear step progression and back navigation.

## Future
- Backend for saving results and emailing reports.
- Admin analytics/dashboard.
- More nuanced scoring model. 