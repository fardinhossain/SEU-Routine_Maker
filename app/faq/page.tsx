import type { Metadata } from 'next';
import { ArrowLeft, CalendarDays } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers about creating an SEU class routine from UMS HTML, using Magic Organizer, detecting schedule conflicts, privacy, and routine exports.',
  alternates: {
    canonical: '/faq',
  },
};

const questions = [
  {
    question: 'What is SEU Routine Maker?',
    answer: 'It is a free browser-based class routine builder for Southeast University students. It converts saved UMS course data into a clear weekly schedule.',
  },
  {
    question: 'How do I create my SEU class routine?',
    answer: 'Save the UMS Offered Sections or Registered Courses page as HTML or MHTML, upload it to the routine maker, then choose sections manually or with Magic Organizer.',
  },
  {
    question: 'Does it detect class conflicts?',
    answer: 'Yes. The routine builder checks overlapping class times and duplicate course selections before you print or export your schedule.',
  },
  {
    question: 'Is my UMS data uploaded to a server?',
    answer: 'No. UMS parsing, routine generation, conflict checking, and exports run locally inside your browser. The tool never asks for your UMS password.',
  },
  {
    question: 'Which UMS pages can I use?',
    answer: 'You can import the Offered Sections page while planning courses or the Registered Courses page from the Student Dashboard after advising.',
  },
  {
    question: 'Can I download my finished routine?',
    answer: 'Yes. A conflict-free routine can be printed or exported in multiple PNG layouts and as a PDF for desktop or mobile use.',
  },
];

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData).replace(/</g, '\\u003c'),
        }}
      />

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
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-mint-400">Help and answers</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-white sm:text-5xl">SEU Routine Maker FAQ</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            Learn how to create a Southeast University class routine, import your UMS data, organize sections, detect timetable conflicts, and export your weekly schedule.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-white/[.07] bg-white/[.02] p-5 sm:p-8" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-white">Frequently asked questions</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {questions.map(({ question, answer }) => (
              <article key={question} className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5 sm:p-6">
                <h3 className="font-semibold text-slate-100">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel mt-6 p-6 text-center sm:p-8">
          <h2 className="text-xl font-semibold text-white">Ready to build your routine?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">Import your saved UMS page and create a clear, clash-free weekly class schedule.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href="/" className="primary-button">Open SEU Routine Maker</a>
            <a href="/about" className="secondary-button">About the project</a>
          </div>
        </section>
      </main>
    </div>
  );
}
