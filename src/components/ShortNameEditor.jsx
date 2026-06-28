import { PencilLine } from "lucide-react";

export default function ShortNameEditor({ courses, shortNames, onChange }) {
  if (!courses.length) return null;

  return (
    <section className="panel min-w-0 p-4 sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-violet-300">
          <PencilLine size={17} />
        </span>
        <div>
          <h2 className="font-semibold text-white">Course labels</h2>
          <p className="mt-0.5 text-sm text-slate-400">Fine-tune the short names shown in your routine.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <label key={course.courseCode} className="rounded-xl border border-white/[.07] bg-white/[.025] p-3">
            <span className="mb-2 flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-semibold text-mint-300">{course.courseCode}</span>
              <span className="truncate text-[11px] text-slate-500">{course.courseTitle}</span>
            </span>
            <input
              value={shortNames[course.courseCode] ?? course.shortTitle}
              onChange={(event) => onChange(course.courseCode, event.target.value)}
              className="field py-2 text-sm font-medium"
              aria-label={`Short name for ${course.courseCode}`}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
