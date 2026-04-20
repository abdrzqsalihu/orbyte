# Orbyte

Orbyte is a modern, high-performance productivity platform designed to help individuals and teams stay organized, focused, and in control of their workflow.

Built with speed and simplicity at its core, Orbyte combines powerful task management tools with a clean, intuitive interface—so you can spend less time managing work and more time actually doing it.

## Why Orbyte?

Most productivity tools are either too simple or overwhelmingly complex. Orbyte sits in the sweet spot:

- Fast and responsive (built with modern web tech)
- Thoughtfully designed UX (minimal friction, maximum clarity)
- Real-time sync across devices
- Works like a native app (PWA support)

## Features
### Unified Workspace

A single place to manage everything:

- **Dashboard Overview**: Get a high-level view of tasks, activity, and productivity trends.
- **Kanban Board**: Organize workflows visually with drag-and-drop simplicity.
- **Calendar View**: Plan ahead with clear scheduling and deadline tracking.
- **Notes**: Capture quick thoughts, ideas, or reminders without breaking flow.
- **Authentication**: Secure login and registration.
- **Automated Notifications**:
  - In-app notifications for task updates.
  - Daily task reminders.
- **Progressive Web App (PWA)**: Installable on mobile and desktop for a native-like experience, featuring offline support and home screen shortcuts.

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PWA**: Custom service worker and manifest implementation

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (recommended) or npm/yarn
- A Supabase project

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/abdrzqsalihu/orbyte.git
    cd orbyte
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root directory and add the following:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    CRON_SECRET=your_cron_secret_for_vercel
    ```

4.  **Run the development server**:
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Cron Jobs

Orbyte uses Vercel Cron to automate background tasks, such as checking for due tasks and sending notifications.

- **Endpoint**: `/api/notifications/check-due`
- **Schedule**: Defined in `vercel.json` (defaults to daily at 08:00 UTC).
- **Security**: Protected via `CRON_SECRET` authorization header.

## PWA Support

The application is fully PWA-compliant. You can install it on your device for:
- Home screen icon
- Faster loading
- Native-like app feel

Configuration can be found in `app/manifest.ts` and `public/sw.js`.

## License

This project is source-available for learning and inspiration.

You are welcome to explore the code and learn from it, but you may not use it to build or distribute a competing product without permission.

All rights reserved.
