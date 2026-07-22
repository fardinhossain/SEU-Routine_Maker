'use client';

import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  FileDown,
  MonitorSmartphone,
  Printer,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import Hero from "./components/Hero";
import AppHeader from "./components/AppHeader";
import ClassReminders from "./components/ClassReminders";
import ConflictAlert from "./components/ConflictAlert";
import CoursePicker from "./components/CoursePicker";
import DataPolicyModal from "./components/DataPolicyModal";
import ImportPanel from "./components/ImportPanel";
import LoadingScreen from "./components/LoadingScreen";
import RoutineTable from "./components/RoutineTable";
import ShortNameEditor from "./components/ShortNameEditor";
import { normalizeCourseMetadata, parseUmsHtml, parseUmsText } from "./lib/parser";
import { buildRoutine, courseIdentity, findDuplicateCourseSelections, formatTime12, parseCodeList, timeToMinutes, uniqueCourseSelections, WEEK_DAYS } from "./lib/routine";
import { clearRoutineStorage, readStoredValue, STORAGE_KEYS, writeStoredValue } from "./lib/storage";

const LOADING_SCREEN_SESSION_KEY = "seu-routine-loading-screen-shown";
let loadingScreenShown = false;

function loadInitialState() {
  const selectedCodes = readStoredValue(STORAGE_KEYS.selectedCodes, []);
  return {
    rawHtml: readStoredValue(STORAGE_KEYS.rawHtml, ""),
    courses: readStoredValue(STORAGE_KEYS.courses, []).map(normalizeCourseMetadata),
    selectedCodes,
    codeInput: selectedCodes.join("\n"),
    shortNames: readStoredValue(STORAGE_KEYS.shortNames, {}),
  };
}

function formatGapDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return [
    hours ? `${hours} hr` : "",
    minutes ? `${minutes} min` : "",
  ].filter(Boolean).join(" ");
}

const ModernRoutineExport = forwardRef(function ModernRoutineExport(
  { routine, shortNames },
  ref,
) {
  const daySections = WEEK_DAYS.map((day) => ({
    day,
    entries: routine.entries
      .filter((entry) => entry.day === day)
      .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)),
  })).filter((section) => section.entries.length > 0);

  const uniqueCourseCodes = new Set(routine.entries.map((entry) => entry.course.courseCode).filter(Boolean));
  const sessions = routine.entries.length;
  const weeklyMinutes = routine.entries.reduce(
    (total, entry) => total + timeToMinutes(entry.end) - timeToMinutes(entry.start),
    0,
  );
  const showSummary = uniqueCourseCodes.size > 0 || sessions > 0 || weeklyMinutes > 0;

  return (
    <section ref={ref} className="mobile-routine-export" aria-hidden="true">
      <header className="mobile-routine-header">
        <div>
          <h2>SEU Weekly Routine</h2>
        </div>
        {showSummary && (
          <div className="mobile-routine-summary">
            {uniqueCourseCodes.size > 0 && (
              <div>
                <strong>{uniqueCourseCodes.size}</strong>
                <span>Total Courses</span>
              </div>
            )}
            {sessions > 0 && (
              <div>
                <strong>{sessions}</strong>
                <span>Total Sessions</span>
              </div>
            )}
            {weeklyMinutes > 0 && (
              <div>
                <strong>{(weeklyMinutes / 60).toFixed(1)}h</strong>
                <span>Weekly Hours</span>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="mobile-routine-days">
        {daySections.map(({ day, entries }, dayIndex) => (
          <section className="mobile-routine-day-section" key={day} data-day-index={dayIndex}>
            <aside className="mobile-routine-day-label">
              <span>{day.slice(0, 3).toUpperCase()}</span>
            </aside>
            <div className="mobile-routine-card-list">
              {entries.map((entry) => {
                const courseCode = entry.course.courseCode;
                const courseName = shortNames[courseCode] || entry.course.shortTitle || entry.course.courseTitle;
                const teacher = entry.course.faculty || entry.course.teacherInitial || entry.course.facultyName || entry.course.teacherName;

                return (
                  <article className="mobile-routine-card" data-day-index={dayIndex % 6} key={entry.id}>
                    {(entry.start || entry.end) && (
                      <p className="mobile-routine-time">
                        {[entry.start && formatTime12(entry.start), entry.end && formatTime12(entry.end)].filter(Boolean).join(" to ")}
                      </p>
                    )}
                    {courseCode && <p className="mobile-routine-code">{courseCode}</p>}
                    {courseName && <h3>{courseName}</h3>}
                    {(entry.room || teacher || entry.gap) && (
                      <div className="mobile-routine-meta-row">
                        <div className="mobile-routine-details">
                          {entry.room && <span>Room: {entry.room}</span>}
                          {teacher && <span>Teacher: {teacher}</span>}
                        </div>
                        {entry.gap && (
                          <p className="mobile-routine-gap">Gap: {formatGapDuration(entry.gap.minutes)}</p>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
});

const FuturisticRoutineExport = forwardRef(function FuturisticRoutineExport(
  { routine, shortNames },
  ref,
) {
  const daySections = WEEK_DAYS.map((day) => ({
    day,
    entries: routine.entries
      .filter((entry) => entry.day === day)
      .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)),
  })).filter((section) => section.entries.length > 0);

  const uniqueCourseCodes = new Set(routine.entries.map((entry) => entry.course.courseCode).filter(Boolean));
  const sessions = routine.entries.length;
  const weeklyMinutes = routine.entries.reduce(
    (total, entry) => total + timeToMinutes(entry.end) - timeToMinutes(entry.start),
    0,
  );

  return (
    <section ref={ref} className="futuristic-routine-export" aria-hidden="true">
      <header className="futuristic-routine-header">
        <div>
          <h2>SEU Weekly Routine</h2>
          <p>Seven days, one clear view.</p>
        </div>
        <div className="futuristic-routine-summary">
          <div>
            <strong>{uniqueCourseCodes.size}</strong>
            <span>Courses</span>
          </div>
          <div>
            <strong>{sessions}</strong>
            <span>Sessions</span>
          </div>
          <div>
            <strong>{(weeklyMinutes / 60).toFixed(1)}h</strong>
            <span>Weekly</span>
          </div>
        </div>
      </header>

      <div className="futuristic-routine-days">
        {daySections.map(({ day, entries }, dayIndex) => (
          <section className="futuristic-routine-day-row" key={day} data-day-index={dayIndex}>
            <aside className="futuristic-routine-day-cell">{day.slice(0, 3).toUpperCase()}</aside>
            <div className="futuristic-routine-entry-grid">
              {entries.map((entry) => {
                const courseCode = entry.course.courseCode;
                const courseTitle = entry.course.courseTitle || shortNames[courseCode] || entry.course.shortTitle;
                const teacher = entry.course.facultyName || entry.course.teacherName || entry.course.faculty || entry.course.teacherInitial;

                return (
                  <article className="futuristic-routine-entry" data-day-index={dayIndex % 6} key={entry.id}>
                    <div className="futuristic-routine-time">
                      <strong>{entry.start ? formatTime12(entry.start) : ""}</strong>
                      <span>to</span>
                      <strong>{entry.end ? formatTime12(entry.end) : ""}</strong>
                    </div>
                    <div className="futuristic-routine-course-card">
                      <div className="futuristic-routine-card-top">
                        {courseCode && <p className="futuristic-routine-code">{courseCode}</p>}
                        {entry.gap && <p className="futuristic-routine-gap">Gap: {formatGapDuration(entry.gap.minutes)}</p>}
                      </div>
                      {courseTitle && <h3>{courseTitle}</h3>}
                      <div className="futuristic-routine-meta">
                        {entry.room && <span>{entry.room}</span>}
                        {teacher && <span>{teacher}</span>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
});

const MobileTableRoutineExport = forwardRef(function MobileTableRoutineExport(
  { routine, shortNames },
  ref,
) {
  const daySections = WEEK_DAYS.map((day) => ({
    day,
    entries: routine.entries.filter((entry) => entry.day === day),
  }));

  const uniqueCourseCodes = Array.from(new Set(routine.entries.map((entry) => entry.course.courseCode).filter(Boolean)));
  const courseColorLookup = new Map(uniqueCourseCodes.map((code, index) => [code, index % 6]));
  const weeklyMinutes = routine.entries.reduce(
    (total, entry) => total + timeToMinutes(entry.end) - timeToMinutes(entry.start),
    0,
  );

  return (
    <section ref={ref} className="mobile-table-routine-export" aria-hidden="true">
      <header className="mobile-table-routine-header">
        <div>
          <h2>SEU Weekly Routine</h2>
          <p>Seven days, one clear view.</p>
        </div>
        <div className="mobile-table-routine-summary">
          <div>
            <strong>{uniqueCourseCodes.length}</strong>
            <span>Courses</span>
          </div>
          <div>
            <strong>{routine.entries.length}</strong>
            <span>Sessions</span>
          </div>
          <div>
            <strong>{(weeklyMinutes / 60).toFixed(1)}h</strong>
            <span>Weekly</span>
          </div>
        </div>
      </header>

      <table className="mobile-table-routine-grid">
        <thead>
          <tr>
            <th>Day</th>
            {routine.slots.map((slot) => (
              <th key={slot.key}>
                <span>{(slot.starts || [slot.start]).map(formatTime12).join(" / ")}</span>
                <small>
                  to{" "}
                  {slot.ends.map((end, index) => (
                    <em key={end}>
                      {formatTime12(end)}
                      {index < slot.ends.length - 1 ? " / " : ""}
                    </em>
                  ))}
                </small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daySections.map(({ day }) => (
            <tr key={day}>
              <th>{day.slice(0, 3).toUpperCase()}</th>
              {routine.slots.map((slot) => {
                const cellEntries = routine.entries
                  .filter((entry) => entry.day === day && entry.slotKey === slot.key)
                  .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

                return (
                  <td key={`${day}-${slot.key}`}>
                    {cellEntries.map((entry) => {
                      const courseCode = entry.course.courseCode;
                      const courseTitle = shortNames[courseCode] || entry.course.shortTitle || entry.course.courseTitle;
                      const teacher = entry.course.faculty || entry.course.teacherInitial || entry.course.facultyName || entry.course.teacherName;

                      return (
                        <article
                          className="mobile-table-routine-card"
                          data-color-index={courseColorLookup.get(courseCode) ?? 0}
                          key={entry.id}
                        >
                          <div className="mobile-table-routine-card-top">
                            {courseCode && <p>{courseCode}</p>}
                          </div>
                          {entry.gap && (
                            <p className="mobile-table-routine-gap">Gap: {formatGapDuration(entry.gap.minutes)}</p>
                          )}
                          {courseTitle && <p className="mobile-table-routine-title">{courseTitle}</p>}
                          <div className="mobile-table-routine-card-meta">
                            {entry.room && <span>{entry.room}</span>}
                            {teacher && <span>{teacher}</span>}
                          </div>
                        </article>
                      );
                    })}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
});

export default function App() {
  const [rawHtml, setRawHtml] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [codeInput, setCodeInput] = useState("");
  const [shortNames, setShortNames] = useState({});
  const [message, setMessage] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [exporting, setExporting] = useState("");
  const [importSuccessMessage, setImportSuccessMessage] = useState("");
  const [storageHydrated, setStorageHydrated] = useState(false);
  const [imageResetKey, setImageResetKey] = useState(0);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingScreenLeaving, setLoadingScreenLeaving] = useState(false);
  const [showDataPolicy, setShowDataPolicy] = useState(false);
  const [pngMenuOpen, setPngMenuOpen] = useState(false);
  const routineRef = useRef(null);
  const modernRoutineRef = useRef(null);
  const futuristicRoutineRef = useRef(null);
  const mobileTableRoutineRef = useRef(null);
  const pendingRoutineScrollRef = useRef(false);
  const hasStoredRoutineRef = useRef(false);

  useEffect(() => {
    const stored = loadInitialState();
    setRawHtml(stored.rawHtml);
    setCourses(stored.courses);
    setSelectedCodes(stored.selectedCodes);
    setCodeInput(stored.codeInput);
    setShortNames(stored.shortNames);
    if (stored.rawHtml && stored.courses.length) {
      setImportSuccessMessage(`${stored.courses.length} course sections parsed and saved in this browser.`);
    }
    // Flag if the user already has a saved routine so we can auto-scroll after the
    // loading screen finishes (or immediately on revisits that skip the loading screen).
    if (stored.selectedCodes.length > 0) {
      hasStoredRoutineRef.current = true;
    }
    setStorageHydrated(true);
  }, []);

  const selectedCourses = useMemo(() => {
    const lookup = new Map(courses.map((course) => [course.courseCode.toUpperCase(), course]));
    return selectedCodes.map((code) => lookup.get(code)).filter(Boolean);
  }, [courses, selectedCodes]);
  const routine = useMemo(() => buildRoutine(selectedCourses), [selectedCourses]);
  const missingDraftCodes = useMemo(() => {
    const available = new Set(courses.map((course) => course.courseCode.toUpperCase()));
    return parseCodeList(codeInput).filter((code) => !available.has(code));
  }, [codeInput, courses]);
  const missingCodeSuggestions = useMemo(() => {
    const suggestions = {};
    const availableByCourse = new Map();

    courses.forEach((course) => {
      const identity = courseIdentity(course.courseCode);
      if (identity && !availableByCourse.has(identity)) {
        availableByCourse.set(identity, course.courseCode);
      }
    });

    missingDraftCodes.forEach((code) => {
      const suggestion = availableByCourse.get(courseIdentity(code));
      if (suggestion) suggestions[code] = suggestion;
    });

    return suggestions;
  }, [courses, missingDraftCodes]);
  const duplicateSelections = useMemo(
    () => findDuplicateCourseSelections(parseCodeList(codeInput)),
    [codeInput],
  );
  const draftConflicts = useMemo(() => {
    const draftCodes = new Set(uniqueCourseSelections(parseCodeList(codeInput)));
    const draftCourses = courses.filter((course) => draftCodes.has(course.courseCode.toUpperCase()));
    return buildRoutine(draftCourses).conflicts;
  }, [codeInput, courses]);

  useEffect(() => {
    if (!storageHydrated) return;
    writeStoredValue(STORAGE_KEYS.shortNames, shortNames);
  }, [shortNames, storageHydrated]);

  useLayoutEffect(() => {
    let alreadyShown = loadingScreenShown;

    try {
      alreadyShown ||= window.sessionStorage.getItem(LOADING_SCREEN_SESSION_KEY) === "true";
    } catch {
      // The in-memory guard still prevents duplicate mounts when storage is unavailable.
    }

    if (alreadyShown) return;

    loadingScreenShown = true;
    try {
      window.sessionStorage.setItem(LOADING_SCREEN_SESSION_KEY, "true");
    } catch {
      // Storage can be disabled without affecting the rest of the app.
    }
    setShowLoadingScreen(true);
  }, []);

  useEffect(() => {
    if (!showLoadingScreen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const fadeTimer = window.setTimeout(() => setLoadingScreenLeaving(true), 2500);
    const removeTimer = window.setTimeout(() => {
      setShowLoadingScreen(false);
      document.body.style.overflow = previousOverflow;
    }, 3000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [showLoadingScreen]);

  // Auto-scroll to the routine section after the loading screen finishes
  // if the user already has a saved routine from a previous visit.
  useEffect(() => {
    if (showLoadingScreen) return undefined;
    if (!hasStoredRoutineRef.current) return undefined;
    // Reset the flag so subsequent state changes don't re-trigger scrolling.
    hasStoredRoutineRef.current = false;
    const scrollTimer = window.setTimeout(() => {
      routineRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
    return () => window.clearTimeout(scrollTimer);
  }, [showLoadingScreen]);

  useEffect(() => {
    if (!storageHydrated) return;
    const available = new Set(courses.map((course) => course.courseCode.toUpperCase()));
    const validCodes = uniqueCourseSelections(parseCodeList(codeInput).filter((code) => available.has(code)));
    setSelectedCodes(validCodes);
    writeStoredValue(STORAGE_KEYS.selectedCodes, validCodes);
  }, [codeInput, courses, storageHydrated]);

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (showLoadingScreen || hash !== "#routine") return undefined;

    const scrollTimer = window.setTimeout(() => {
      routineRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    return () => window.clearTimeout(scrollTimer);
  }, [showLoadingScreen]);

  useEffect(() => {
    if (!pendingRoutineScrollRef.current || !selectedCourses.length) return undefined;

    pendingRoutineScrollRef.current = false;
    const scrollTimer = window.setTimeout(() => {
      routineRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);

    return () => window.clearTimeout(scrollTimer);
  }, [selectedCourses.length]);

  function showMessage(type, text) {
    setMessage({ type, text });
    window.setTimeout(() => setMessage((current) => current?.text === text ? null : current), 6000);
  }

  function handleParse(htmlOverride, importOptions = {}) {
    const htmlToParse = typeof htmlOverride === "string" ? htmlOverride : rawHtml;
    setImportSuccessMessage("");
    setParsing(true);
    window.setTimeout(() => {
      try {
        const parsed = ["pdf-text", "image-text"].includes(importOptions.format)
          ? parseUmsText(htmlToParse)
          : parseUmsHtml(htmlToParse);
        const sourceType = parsed.parseDebug?.sourceType || parsed[0]?.sourceType || "offered-sections";
        const dashboardCodes = sourceType === "dashboard-registered-courses"
          ? uniqueCourseSelections(parsed.map((course) => course.courseCode.toUpperCase()))
          : [];
        setCourses(parsed);
        writeStoredValue(STORAGE_KEYS.rawHtml, htmlToParse);
        writeStoredValue(STORAGE_KEYS.courses, parsed);
        if (sourceType === "dashboard-registered-courses") {
          setCodeInput(dashboardCodes.join("\n"));
          setSelectedCodes(dashboardCodes);
          writeStoredValue(STORAGE_KEYS.selectedCodes, dashboardCodes);
          setImageResetKey((current) => current + 1);
          pendingRoutineScrollRef.current = true;
          const skippedCodes = parsed.parseDebug?.skippedUnscheduledCodes || [];
          const skippedText = skippedCodes.length
            ? ` ${skippedCodes.join(", ")} skipped because no schedule was found.`
            : "";
          setImportSuccessMessage(`${parsed.length} registered courses with schedules parsed. Routine generated automatically.${skippedText}`);
          showMessage(
            skippedCodes.length ? "warning" : "success",
            skippedCodes.length
              ? `Routine generated. Skipped no-schedule course${skippedCodes.length > 1 ? "s" : ""}: ${skippedCodes.join(", ")}.`
              : "Dashboard Registered Courses page detected. Routine generated from registered courses.",
          );
        } else {
          setImportSuccessMessage(`${parsed.length} course sections parsed and saved in this browser.`);
        }
      } catch (error) {
        showMessage("error", error.message || "The UMS file could not be parsed.");
      } finally {
        setParsing(false);
      }
    }, 40);
  }

  function handleClear() {
    setSelectedCodes([]);
    setCodeInput("");
    setImageResetKey((current) => current + 1);
    writeStoredValue(STORAGE_KEYS.selectedCodes, []);
    showMessage("success", "Routine cleared. Your parsed course data is still saved.");
  }

  function handleClearHtml() {
    clearRoutineStorage();
    setRawHtml("");
    setCourses([]);
    setSelectedCodes([]);
    setCodeInput("");
    setShortNames({});
    setImportSuccessMessage("");
    setImageResetKey((current) => current + 1);
    showMessage("success", "Imported data, parsed sections, and routine data were cleared.");
  }

  function handleReset() {
    if (!window.confirm("Reset the imported UMS data, parsed courses, routine, and custom short names?")) return;
    clearRoutineStorage();
    setRawHtml("");
    setCourses([]);
    setSelectedCodes([]);
    setCodeInput("");
    setShortNames({});
    setImportSuccessMessage("");
    setImageResetKey((current) => current + 1);
    showMessage("success", "All saved routine data has been reset.");
  }

  function changeShortName(code, value) {
    setShortNames((current) => ({ ...current, [code]: value }));
  }

  async function captureRoutine() {
    if (!routineRef.current) return null;
    const { default: html2canvas } = await import("html2canvas");
    const target = routineRef.current;
    const table = target.querySelector("table");
    const desktopTableWidth = 96 + routine.slots.length * 176;
    const exportWidth = Math.max(table?.scrollWidth || 0, desktopTableWidth, 960);
    const exportHeight = Math.max(target.scrollHeight, 1024);

    return html2canvas(target, {
      backgroundColor: "#000000",
      scale: 2,
      useCORS: true,
      logging: false,
      width: exportWidth,
      height: exportHeight,
      windowWidth: Math.max(exportWidth, 1280),
      windowHeight: exportHeight,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDocument) => {
        const clonedRoutine = clonedDocument.querySelector('[data-routine-capture="true"]');
        if (!clonedRoutine) return;

        clonedRoutine.style.width = `${exportWidth}px`;
        clonedRoutine.style.maxWidth = "none";
        clonedRoutine.style.overflow = "visible";

        const clonedScrollArea = clonedRoutine.querySelector(".routine-scroll");
        if (clonedScrollArea) {
          clonedScrollArea.style.width = "100%";
          clonedScrollArea.style.overflow = "visible";
        }

        clonedRoutine.querySelectorAll(".sticky").forEach((element) => {
          element.style.position = "static";
        });
      },
    });
  }

  async function captureModernRoutine() {
    if (!modernRoutineRef.current) return null;
    const { default: html2canvas } = await import("html2canvas");
    await document.fonts?.ready;
    const target = modernRoutineRef.current;
    const exportHeight = Math.ceil(target.scrollHeight);

    return html2canvas(target, {
      backgroundColor: "#000000",
      scale: 2,
      useCORS: true,
      logging: false,
      width: 1080,
      height: exportHeight,
      windowWidth: 1080,
      windowHeight: exportHeight,
      scrollX: 0,
      scrollY: 0,
    });
  }

  async function captureFuturisticRoutine() {
    if (!futuristicRoutineRef.current) return null;
    const { default: html2canvas } = await import("html2canvas");
    await document.fonts?.ready;
    const target = futuristicRoutineRef.current;
    const exportHeight = Math.ceil(target.scrollHeight);
    const exportWidth = Math.ceil(target.scrollWidth);

    return html2canvas(target, {
      backgroundColor: "#000000",
      scale: 2,
      useCORS: true,
      logging: false,
      width: exportWidth,
      height: exportHeight,
      windowWidth: exportWidth,
      windowHeight: exportHeight,
      scrollX: 0,
      scrollY: 0,
    });
  }

  async function captureMobileTableRoutine() {
    if (!mobileTableRoutineRef.current) return null;
    const { default: html2canvas } = await import("html2canvas");
    await document.fonts?.ready;
    const target = mobileTableRoutineRef.current;
    const exportHeight = Math.ceil(target.scrollHeight);
    const exportWidth = Math.ceil(target.scrollWidth);

    return html2canvas(target, {
      backgroundColor: "#000000",
      scale: 3,
      useCORS: true,
      logging: false,
      width: exportWidth,
      height: exportHeight,
      windowWidth: exportWidth,
      windowHeight: exportHeight,
      scrollX: 0,
      scrollY: 0,
    });
  }

  async function exportPng() {
    try {
      setExporting("png");
      const canvas = await captureRoutine();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "seu-weekly-routine.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      showMessage("error", "The PNG could not be created. Try the print option instead.");
    } finally {
      setExporting("");
    }
  }

  async function exportPcPng() {
    try {
      setPngMenuOpen(false);
      setExporting("pc-png");
      const canvas = await captureRoutine();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "seu-weekly-routine-pc.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      showMessage("error", "The PC PNG could not be created. Try the print option instead.");
    } finally {
      setExporting("");
    }
  }

  async function exportModernPng() {
    try {
      setPngMenuOpen(false);
      setExporting("modern-png");
      const canvas = await captureModernRoutine();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "seu-weekly-routine-modern.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      showMessage("error", "The modern PNG could not be created. Try the regular PNG instead.");
    } finally {
      setExporting("");
    }
  }

  async function exportFuturisticPng() {
    try {
      setPngMenuOpen(false);
      setExporting("futuristic-png");
      const canvas = await captureFuturisticRoutine();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "seu-weekly-routine-futuristic.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      showMessage("error", "The futuristic PNG could not be created. Try the regular PNG instead.");
    } finally {
      setExporting("");
    }
  }

  async function exportMobilePng() {
    try {
      setPngMenuOpen(false);
      setExporting("mobile-png");
      const canvas = await captureMobileTableRoutine();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "seu-routine-mobile.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      showMessage("error", "The mobile PNG could not be created. Try the regular PNG instead.");
    } finally {
      setExporting("");
    }
  }

  async function exportPdf() {
    try {
      setExporting("pdf");
      const [{ jsPDF }, canvas] = await Promise.all([import("jspdf"), captureRoutine()]);
      if (!canvas) return;
      const pdf = new jsPDF({
        orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
        hotfixes: ["px_scaling"],
      });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
      pdf.save("seu-weekly-routine.pdf");
    } catch {
      showMessage("error", "The PDF could not be created. Try downloading a PNG instead.");
    } finally {
      setExporting("");
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink-950 text-slate-200">
      {showLoadingScreen && <LoadingScreen leaving={loadingScreenLeaving} />}
      <AppHeader
        onNavClick={(target) => {
          if (target === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenDataPolicy={() => setShowDataPolicy(true)}
      />

      <main className="mx-auto w-full min-w-0 max-w-[1500px] px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-8 lg:pt-10">
        <Hero
          onGetStarted={() => {
            const tools = document.getElementById("tools");
            if (tools) {
              tools.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          onGoToImport={() => {
            const tools = document.getElementById("tools");
            if (tools) {
              tools.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          onGoToRoutine={() => {
            const routineView = document.getElementById("routine-view");
            if (routineView) {
              routineView.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          onOpenOrganizer={() => {
            if (!courses.length) {
              window.alert("Please upload your UMS file first.");
              return;
            }
            window.location.assign("/organizer");
          }}
        />

        {message && (
          <div className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            message.type === "error"
              ? "border-rose-400/25 bg-rose-400/[.08] text-rose-200"
              : message.type === "warning"
                ? "border-amber-400/25 bg-amber-400/[.08] text-amber-200"
                : "border-mint-400/20 bg-mint-400/[.07] text-mint-300"
          }`} role="status">
            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <div id="tools" className="grid min-w-0 gap-4 sm:gap-5 xl:grid-cols-2">
          <ImportPanel
            rawHtml={rawHtml}
            setRawHtml={setRawHtml}
            onParse={handleParse}
            onClearHtml={handleClearHtml}
            courseCount={courses.length}
            parsing={parsing}
            successMessage={importSuccessMessage}
            onImportError={(text) => showMessage("error", text)}
          />
          <CoursePicker
            courses={courses}
            codeInput={codeInput}
            setCodeInput={setCodeInput}
            conflicts={draftConflicts}
            duplicateSelections={duplicateSelections}
            missingCodes={courses.length ? missingDraftCodes : []}
            missingSuggestions={missingCodeSuggestions}
            imageResetKey={imageResetKey}
            onClear={handleClear}
            onReset={handleReset}
          />
        </div>

        {selectedCourses.length > 0 && (
          <div id="routine" className="mt-8 space-y-5 scroll-mt-5">
            <ShortNameEditor courses={selectedCourses} shortNames={shortNames} onChange={changeShortName} />

            <ClassReminders
              selectedCourses={selectedCourses}
              routine={routine}
              shortNames={shortNames}
            />

            <ConflictAlert conflicts={routine.conflicts} />

            <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-mint-400">Your result</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">Weekly class routine</h2>
              </div>
              <div className="no-print grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                <button type="button" className="secondary-button px-2 sm:px-4" onClick={() => window.print()} disabled={routine.conflicts.length > 0 || duplicateSelections.length > 0} title={routine.conflicts.length || duplicateSelections.length ? "Resolve section conflicts first" : "Print routine"}>
                  <Printer size={16} /> Print
                </button>
                <div className="relative">
                  <button
                    type="button"
                    className="secondary-button w-full px-2 sm:w-auto sm:px-4"
                    onClick={() => setPngMenuOpen((current) => !current)}
                    disabled={Boolean(exporting) || routine.conflicts.length > 0 || duplicateSelections.length > 0}
                    title={routine.conflicts.length || duplicateSelections.length ? "Resolve section conflicts first" : "Download routine as PNG"}
                    aria-haspopup="menu"
                    aria-expanded={pngMenuOpen}
                  >
                    <Download size={16} /> {exporting === "png" || exporting === "pc-png" || exporting === "modern-png" || exporting === "futuristic-png" || exporting === "mobile-png" ? "Creating..." : "PNG"}
                    <ChevronDown size={15} className={`transition-transform ${pngMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {pngMenuOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#412D15] bg-[#170F08] p-1.5 shadow-2xl shadow-black/90 backdrop-blur-xl" role="menu">
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/[.06] hover:text-white"
                        onClick={exportPcPng}
                      >
                        <Download size={15} /> Download PC PNG
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/[.06] hover:text-white"
                        onClick={exportModernPng}
                      >
                        <WandSparkles size={15} /> Download Modern PNG
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/[.06] hover:text-white"
                        onClick={exportFuturisticPng}
                      >
                        <Sparkles size={15} /> Download Futuristic PNG
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/[.06] hover:text-white"
                        onClick={exportMobilePng}
                      >
                        <MonitorSmartphone size={15} /> Download Mobile PNG
                      </button>
                    </div>
                  )}
                </div>
                <button type="button" className="secondary-button px-2 sm:px-4" onClick={exportPdf} disabled={Boolean(exporting) || routine.conflicts.length > 0 || duplicateSelections.length > 0} title={routine.conflicts.length || duplicateSelections.length ? "Resolve section conflicts first" : "Download routine as PDF"}>
                  <FileDown size={16} /> {exporting === "pdf" ? "Creating…" : "PDF"}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-cream-400/20 bg-cream-400/[.07] px-3.5 py-3 text-xs leading-5 text-cream-200 sm:hidden">
              <MonitorSmartphone className="mt-0.5 shrink-0" size={17} />
              <p><strong className="text-cream-100">Use Desktop Mode for a better view.</strong></p>
            </div>

            <div id="routine-view" className="scroll-mt-6">
              <RoutineTable ref={routineRef} selectedCourses={selectedCourses} routine={routine} shortNames={shortNames} />
            </div>
            <div className="mobile-routine-export-host" aria-hidden="true">
              <ModernRoutineExport ref={modernRoutineRef} routine={routine} shortNames={shortNames} />
              <FuturisticRoutineExport ref={futuristicRoutineRef} routine={routine} shortNames={shortNames} />
              <MobileTableRoutineExport ref={mobileTableRoutineRef} routine={routine} shortNames={shortNames} />
            </div>
          </div>
        )}

        {!selectedCourses.length && (
          <section className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/[.015] px-6 py-14 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[.04] text-slate-500">
              <Sparkles size={20} />
            </span>
            <h2 className="mt-4 font-semibold text-slate-300">Your routine will appear here</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">Import course data and add section codes—the routine will update automatically.</p>
          </section>
        )}

      </main>

      <footer className="border-t border-[#412D15]/50 bg-black px-4 py-6 text-center">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-2 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="text-base font-extrabold text-white">
              SEU <span className="text-[#E1DCC9]">Routine Maker</span>
            </span>
            <span className="text-xs text-[#C7BFD0]">
              <span className="hidden sm:inline">• </span>Made with ❤️ for SEU students
            </span>
          </div>

          <div className="text-xs text-[#C7BFD0]">
            Developed by{" "}
            <a
              href="https://mdfardin.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#E1DCC9] transition hover:underline"
            >
              @Fardin_Hossain
            </a>
          </div>
        </div>
      </footer>

      {showDataPolicy && <DataPolicyModal onClose={() => setShowDataPolicy(false)} />}
    </div>
  );
}
