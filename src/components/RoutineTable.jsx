import { forwardRef, useState, useEffect } from "react";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import { formatTime12, WEEK_DAYS, timeToMinutes } from "../lib/routine";
import { readStoredValue, writeStoredValue, STORAGE_KEYS } from "../lib/storage";

const CARD_STYLES = [
  "border-gold-400/20 bg-gold-400/[.09] text-amber-100",
  "border-violet-300/20 bg-violet-300/[.09] text-violet-100",
  "border-amber-300/20 bg-amber-300/[.09] text-amber-100",
  "border-emerald-300/20 bg-emerald-300/[.09] text-emerald-100",
  "border-cream-300/20 bg-cream-300/[.09] text-cream-100",
  "border-fuchsia-300/20 bg-fuchsia-300/[.09] text-fuchsia-100",
];

function getBangladeshDayCode() {
  try {
    const options = { timeZone: "Asia/Dhaka", weekday: "short" };
    const dayStr = new Intl.DateTimeFormat("en-US", options).format(new Date()).toUpperCase();
    const map = { SAT: "SAT", SUN: "SUN", MON: "MON", TUE: "TUE", WED: "WED", THU: "THU", FRI: "FRI" };
    return map[dayStr] || "SAT";
  } catch {
    return "SAT";
  }
}

function formatGapDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return [
    hours ? `${hours} hr` : "",
    minutes ? `${minutes} min` : "",
  ].filter(Boolean).join(" ");
}

function CourseCard({ entry, selectedCourses, conflict, shortNames, showFullCourse, showFullTeacher }) {
  const colorIndex = selectedCourses.findIndex((course) => course.courseCode === entry.course.courseCode);
  const style = conflict
    ? "border-rose-400/55 bg-rose-400/15 text-rose-50 ring-1 ring-rose-400/20"
    : CARD_STYLES[Math.max(0, colorIndex) % CARD_STYLES.length];

  const courseTitle = showFullCourse
    ? (entry.course.courseTitle || shortNames[entry.course.courseCode] || entry.course.shortTitle)
    : (shortNames[entry.course.courseCode] || entry.course.shortTitle);

  const teacherName = showFullTeacher
    ? (entry.course.facultyName || entry.course.faculty)
    : entry.course.faculty;

  return (
    <article
      className={`routine-course-card rounded-xl border p-3 ${style}`}
      data-color-index={Math.max(0, colorIndex) % CARD_STYLES.length}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-xs font-bold tracking-wide">{entry.course.courseCode}</p>
        {conflict && <span className="rounded bg-rose-400/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">Conflict</span>}
      </div>
      {entry.gap && (
        <p className="routine-course-gap mt-2 text-[10px] font-semibold leading-snug opacity-75">
          Gap: {formatGapDuration(entry.gap.minutes)}
        </p>
      )}
      <h3 className="routine-course-title mt-1.5 text-xs font-bold leading-snug text-white">{courseTitle}</h3>
      <div className="routine-course-meta mt-2 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
        {entry.room && <span className="routine-course-room font-semibold opacity-90">{entry.room}</span>}
        {teacherName && <span className="routine-course-teacher opacity-75">{teacherName}</span>}
      </div>
    </article>
  );
}

const RoutineTable = forwardRef(function RoutineTable(
  { selectedCourses, routine, shortNames },
  ref,
) {
  const sessions = routine.entries.length;
  const weeklyMinutes = routine.entries.reduce(
    (total, entry) => total + timeToMinutes(entry.end) - timeToMinutes(entry.start),
    0,
  );

  const bdToday = getBangladeshDayCode();
  const [mobileSelectedDay, setMobileSelectedDay] = useState(bdToday);
  const [showFullMobileTable, setShowFullMobileTable] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const [showFullCourse, setShowFullCourse] = useState(false);
  const [showFullTeacher, setShowFullTeacher] = useState(false);
  const [settingsHydrated, setSettingsHydrated] = useState(false);

  useEffect(() => {
    setShowFullCourse(readStoredValue(STORAGE_KEYS.showFullCourse, false));
    setShowFullTeacher(readStoredValue(STORAGE_KEYS.showFullTeacher, false));
    setSettingsHydrated(true);
  }, []);

  useEffect(() => {
    if (!settingsHydrated) return;
    writeStoredValue(STORAGE_KEYS.showFullCourse, showFullCourse);
  }, [settingsHydrated, showFullCourse]);

  useEffect(() => {
    if (!settingsHydrated) return;
    writeStoredValue(STORAGE_KEYS.showFullTeacher, showFullTeacher);
  }, [settingsHydrated, showFullTeacher]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffX) > 40) {
      const currentIndex = WEEK_DAYS.indexOf(mobileSelectedDay);
      if (diffX > 0) {
        // Swiped left -> Next Day
        const nextIndex = (currentIndex + 1) % WEEK_DAYS.length;
        setMobileSelectedDay(WEEK_DAYS[nextIndex]);
      } else {
        // Swiped right -> Previous Day
        const prevIndex = (currentIndex - 1 + WEEK_DAYS.length) % WEEK_DAYS.length;
        setMobileSelectedDay(WEEK_DAYS[prevIndex]);
      }
    }
    setTouchStartX(null);
  };

  return (
    <section
      ref={ref}
      data-routine-capture="true"
      data-slot-count={routine.slots.length}
      className="print-area max-w-full scroll-mt-4 overflow-hidden rounded-2xl border border-[#412D15]/50 bg-black shadow-glow sm:rounded-3xl"
    >
      <div className="routine-print-header flex flex-col gap-4 border-b border-white/[.07] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="routine-print-heading flex items-center gap-3">
            <span className="routine-print-icon grid h-11 w-11 place-items-center rounded-2xl bg-mint-400/10 text-mint-300">
              <CalendarRange size={21} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">SEU Weekly Routine</h2>
              <p className="text-sm text-slate-500">Seven days, one clear view.</p>
            </div>
          </div>

          <div className="no-print flex flex-wrap items-center gap-3 border-t border-white/[.07] pt-3 sm:border-t-0 sm:pt-0" data-html2canvas-ignore="true">
            <div className="flex items-center gap-1.5">
              <label htmlFor="course-name-select" className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Course:</label>
              <select
                id="course-name-select"
                value={showFullCourse ? "full" : "short"}
                onChange={(e) => setShowFullCourse(e.target.value === "full")}
                className="rounded-lg border border-[#412D15]/50 bg-[#1F150C]/40 hover:border-[#E1DCC9]/35 hover:bg-[#2E1E12]/50 transition-colors px-2 py-1 text-xs text-slate-300 focus:border-[#E1DCC9]/50 focus:outline-none cursor-pointer"
              >
                <option value="short">Short Name</option>
                <option value="full">Full Name</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <label htmlFor="teacher-name-select" className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Teacher:</label>
              <select
                id="teacher-name-select"
                value={showFullTeacher ? "full" : "initials"}
                onChange={(e) => setShowFullTeacher(e.target.value === "full")}
                className="rounded-lg border border-[#412D15]/50 bg-[#1F150C]/40 hover:border-[#E1DCC9]/35 hover:bg-[#2E1E12]/50 transition-colors px-2 py-1 text-xs text-slate-300 focus:border-[#E1DCC9]/50 focus:outline-none cursor-pointer"
              >
                <option value="initials">Initials</option>
                <option value="full">Full Name</option>
              </select>
            </div>
          </div>
        </div>
        <div className="routine-print-summary flex w-full divide-x divide-white/10 rounded-xl border border-white/[.07] bg-white/[.025] text-center sm:w-auto">
          <div className="flex-1 px-2 py-2 sm:px-4">
            <strong className="block text-sm text-slate-100">{selectedCourses.length}</strong>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Courses</span>
          </div>
          <div className="flex-1 px-2 py-2 sm:px-4">
            <strong className="block text-sm text-slate-100">{sessions}</strong>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Sessions</span>
          </div>
          <div className="flex-1 px-2 py-2 sm:px-4">
            <strong className="block text-sm text-slate-100">{(weeklyMinutes / 60).toFixed(1)}h</strong>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Weekly</span>
          </div>
        </div>
      </div>

      {/* Mobile-Only Single Day View (All 7 Days Visible on Mobile Screen) */}
      <div className="block sm:hidden no-print border-t border-[#412D15]/40 p-3 sm:p-4" data-html2canvas-ignore="true">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#E1DCC9]">
            {mobileSelectedDay} Schedule
          </span>
          <button
            type="button"
            onClick={() => setShowFullMobileTable((prev) => !prev)}
            className="text-[11px] font-semibold text-[#E1DCC9] underline underline-offset-2 hover:text-white cursor-pointer"
          >
            {showFullMobileTable ? "Single Day View" : "Full 7-Day Table"}
          </button>
        </div>

        {!showFullMobileTable && (
          <div>
            {/* 7-Day Grid Bar (All 7 Days Visible at Once) */}
            <div className="grid grid-cols-7 gap-1 w-full">
              {WEEK_DAYS.map((day) => {
                const isToday = day === bdToday;
                const isSelected = day === mobileSelectedDay;
                const dayEntries = routine.entries.filter((e) => e.day === day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setMobileSelectedDay(day)}
                    className={`relative flex flex-col items-center justify-center rounded-xl border py-2 text-center transition cursor-pointer ${
                      isSelected
                        ? "border-[#E1DCC9] bg-[#E1DCC9] text-black shadow-md"
                        : "border-[#412D15]/50 bg-[#1F150C]/40 text-[#C7BFD0] hover:border-[#E1DCC9]/40 hover:text-white"
                    }`}
                  >
                    <span className="text-[11px] font-extrabold leading-none">{day}</span>
                    {isToday ? (
                      <span className={`text-[8px] font-black uppercase leading-none mt-1 ${isSelected ? "text-black" : "text-[#E1DCC9]"}`}>
                        Today
                      </span>
                    ) : dayEntries.length > 0 ? (
                      <span className={`h-1 w-1 rounded-full mt-1.5 ${isSelected ? "bg-black" : "bg-[#E1DCC9]"}`} />
                    ) : (
                      <span className="h-1 w-1 mt-1.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Swipeable Class Cards Container */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="mt-3.5 space-y-3 min-h-[140px] touch-pan-y select-none"
            >
              {(() => {
                const dayEntries = routine.entries
                  .filter((entry) => entry.day === mobileSelectedDay)
                  .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

                if (dayEntries.length === 0) {
                  return (
                    <div className="rounded-2xl border border-dashed border-[#412D15]/60 bg-[#1F150C]/20 p-6 text-center text-xs text-[#C7BFD0]">
                      No classes scheduled for <strong className="text-[#E1DCC9]">{mobileSelectedDay}</strong> 🎉
                      <div className="mt-1.5 text-[10px] text-slate-400">Swipe left/right to view other days</div>
                    </div>
                  );
                }

                return dayEntries.map((entry) => (
                  <div key={entry.id} className="relative rounded-2xl border border-[#412D15]/50 bg-[#1F150C]/40 p-4 shadow-md">
                    <div className="flex items-center justify-between gap-2 border-b border-[#412D15]/40 pb-2.5">
                      <div className="font-mono text-sm font-extrabold text-[#E1DCC9]">
                        {formatTime12(entry.start)} – {formatTime12(entry.end)}
                      </div>
                      {routine.conflictIds.has(entry.id) && (
                        <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                          Conflict
                        </span>
                      )}
                    </div>
                    <div className="mt-2.5">
                      <div className="font-mono text-xs font-bold text-[#E1DCC9]">
                        {entry.course.courseCode}
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-white leading-snug">
                        {showFullCourse ? (entry.course.courseTitle || shortNames[entry.course.courseCode] || entry.course.shortTitle) : (shortNames[entry.course.courseCode] || entry.course.shortTitle || entry.course.courseTitle)}
                      </h4>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#C7BFD0]">
                        {entry.room && <span>Room: <strong className="text-white">{entry.room}</strong></span>}
                        {entry.course.faculty && <span>Teacher: <strong className="text-white">{showFullTeacher ? (entry.course.facultyName || entry.course.faculty) : entry.course.faculty}</strong></span>}
                      </div>
                      {entry.gap && (
                        <div className="mt-2 text-[11px] font-semibold text-amber-200/80">
                          Gap before this class: {formatGapDuration(entry.gap.minutes)}
                        </div>
                      )}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>

      <div className={`routine-scroll overflow-x-auto ${showFullMobileTable ? "block" : "hidden sm:block"}`}>
        <table className="routine-table w-full min-w-max border-collapse text-left">
          <thead>
            <tr className="bg-black/10">
              <th className="routine-day-heading sticky left-0 z-20 min-w-20 border-b border-r border-[#412D15]/40 bg-black px-3 py-4 text-[10px] font-semibold uppercase tracking-[.18em] text-[#C7BFD0] sm:min-w-24 sm:px-4">
                Day
              </th>
              {routine.slots.map((slot) => (
                <th key={slot.key} className="routine-slot-heading min-w-[150px] border-b border-r border-white/[.07] px-3 py-3 last:border-r-0 sm:min-w-[176px] sm:px-4">
                  <span className="block font-mono text-sm font-semibold text-slate-200">
                    {(slot.starts || [slot.start]).map(formatTime12).join(" / ")}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] font-normal text-slate-500">
                    to{" "}
                    {slot.ends.map((end, index) => (
                      <span key={end}>
                        <strong className="font-semibold text-white">{formatTime12(end)}</strong>
                        {index < slot.ends.length - 1 && <span> / </span>}
                      </span>
                    ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WEEK_DAYS.map((day) => (
              <tr key={day}>
                <th className="routine-day sticky left-0 z-10 border-b border-r border-[#412D15]/40 bg-black px-3 py-4 align-top text-xs font-bold tracking-[.14em] text-[#E1DCC9] sm:px-4 sm:py-5">
                  {day}
                </th>
                {routine.slots.map((slot) => {
                  const cellEntries = routine.entries.filter((entry) => entry.day === day && entry.slotKey === slot.key);
                  return (
                    <td key={`${day}-${slot.key}`} className="routine-cell h-24 border-b border-r border-white/[.07] p-1.5 align-top last:border-r-0 sm:h-28 sm:p-2">
                      <div className="space-y-2">
                        {cellEntries.map((entry) => (
                          <CourseCard
                            key={entry.id}
                            entry={entry}
                            selectedCourses={selectedCourses}
                            conflict={routine.conflictIds.has(entry.id)}
                            shortNames={shortNames}
                            showFullCourse={showFullCourse}
                            showFullTeacher={showFullTeacher}
                          />
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
});

export default RoutineTable;
