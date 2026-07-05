import type { Metadata } from 'next';
import { ArrowLeft, CalendarDays, Code2, ShieldCheck, WandSparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn how SEU Routine Maker creates Southeast University class schedules from UMS data, protects student privacy, and who developed the tool.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-200">
      <header className="border-b border-white/[.06] bg-ink-950/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white">
            <ArrowLeft size={17} /> Back to Routine Maker
          </a>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
            <CalendarDays className="text-mint-400" size={18} /> SEU Routine Maker
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <section className="rounded-3xl border border-white/[.07] bg-[radial-gradient(circle_at_85%_10%,rgba(32,222,214,.1),transparent_32%),rgba(255,255,255,.025)] p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-mint-400">About the project</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-white sm:text-5xl">A simpler way to build an SEU class routine.</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            SEU Routine Maker is a browser-based schedule builder created for Southeast University students. It turns saved UMS course information into a readable weekly routine, helps students compare sections, and warns about overlapping class times.
          </p>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="panel p-5 sm:p-6">
            <Code2 className="text-mint-400" size={22} />
            <h2 className="mt-4 text-lg font-semibold text-white">How it works</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              The tool reads saved UMS Offered Sections or Registered Courses HTML/MHTML files. It extracts course codes, faculty, rooms, days, and times directly in the browser.
            </p>
          </article>
          <article className="panel p-5 sm:p-6">
            <WandSparkles className="text-mint-400" size={22} />
            <h2 className="mt-4 text-lg font-semibold text-white">What it provides</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Students can organize sections, detect clashes and duplicate courses, preview a weekly schedule, and export the finished routine as PNG or PDF.
            </p>
          </article>
          <article className="panel p-5 sm:p-6">
            <ShieldCheck className="text-mint-400" size={22} />
            <h2 className="mt-4 text-lg font-semibold text-white">Privacy by design</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              UMS files and routine data stay in the student’s browser. There is no routine database, user account, or request for a UMS username or password.
            </p>
          </article>
        </div>

        <section className="panel mt-6 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Created by Fardin Hossain</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
            The project was developed to make SEU advising and weekly schedule planning faster and easier. It is a student-focused utility, not a replacement for official UMS records; students should confirm final course and room information in UMS.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/" className="primary-button">Open SEU Routine Maker</a>
            <a
              href="https://mdfardin.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-button"
            >
              Developer profile
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
