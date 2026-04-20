# Orbyte

Orbyte is a modern, high-performance task management and productivity platform built with **Next.js 16**, **Supabase**, and **Tailwind CSS**. It streamlines work processes, enhances productivity, and improves team collaboration through a sleek, user-friendly interface.

## 🚀 Features

- **Dynamic Landing Page**: A modern, dark-themed landing page featuring hero sections, feature highlights, and performance metrics.
- **Comprehensive Dashboard**:
  - **Overview**: High-level summary of your tasks and productivity metrics.
  - **Kanban Board**: Drag-and-drop workflow management using `@hello-pangea/dnd`.
  - **Calendar View**: Visual task scheduling and deadline tracking.
  - **Notes**: A dedicated section for quick notes and thoughts.
- **Authentication**: Secure login and registration powered by **Supabase Auth**.
- **Realtime Updates**: Seamless data synchronization across tabs and devices using Supabase Realtime.
- **Automated Notifications**:
  - In-app notifications for task updates.
  - Daily task reminders triggered via **Vercel Cron** jobs.
- **Progressive Web App (PWA)**: Installable on mobile and desktop for a native-like experience, featuring offline support and home screen shortcuts.
- **Modern UI/UX**:
  - Built with **shadcn/ui** and **Radix UI** primitives.
  - Smooth animations with **Framer Motion**.
  - Responsive design for all screen sizes.
  - Interactive 3D globe visualization.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PWA**: Custom service worker and manifest implementation

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (recommended) or npm/yarn
- A Supabase project

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
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

## 📅 Cron Jobs

Orbyte uses Vercel Cron to automate background tasks, such as checking for due tasks and sending notifications.

- **Endpoint**: `/api/notifications/check-due`
- **Schedule**: Defined in `vercel.json` (defaults to daily at 08:00 UTC).
- **Security**: Protected via `CRON_SECRET` authorization header.

## 📱 PWA Support

The application is fully PWA-compliant. You can install it on your device for:
- Home screen icon
- Faster loading
- Native-like app feel

Configuration can be found in `app/manifest.ts` and `public/sw.js`.

## 🚢 Deployment

The project is optimized for deployment on [Vercel](https://vercel.com/):

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Configure the environment variables in the Vercel dashboard.
4.  Vercel will automatically detect the `vercel.json` and set up the cron jobs.

## 📄 License

This project is private and for internal use only.
