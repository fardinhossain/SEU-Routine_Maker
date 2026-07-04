'use client';

import { useEffect, useState } from "react";
import { Bell, BellOff, Calendar, Download } from "lucide-react";
import {
  isRemindersEnabled,
  setRemindersEnabled,
  requestNotificationPermission,
  startReminderChecker,
  downloadICS,
  getReminderMinutes,
  setReminderMinutes,
} from "../lib/notifications";

export default function ClassReminders({ selectedCourses, routine, shortNames }) {
  const [enabled, setEnabled] = useState(isRemindersEnabled());
  const [minutesBefore, setMinutesBefore] = useState(getReminderMinutes());
  const [permission, setPermission] = useState("default");
  const [status, setStatus] = useState("");

  // Default semester end date for calendar export
  const DEFAULT_SEMESTER_END = "2026-10-03";

  const [semesterEndDate, setSemesterEndDate] = useState(() => {
    const saved = localStorage.getItem("seu_semester_end_date");
    return saved || DEFAULT_SEMESTER_END;
  });

  const hasRoutine = selectedCourses.length > 0;

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
    if (enabled) {
      setStatus(`Reminders set for ${minutesBefore} minutes before each class.`);
    }
  }, []);

  // Persist semester end date
  useEffect(() => {
    localStorage.setItem("seu_semester_end_date", semesterEndDate);
  }, [semesterEndDate]);

  // Start/stop the checker when enabled, routine, or minutes change
  useEffect(() => {
    if (!enabled || !hasRoutine || !routine?.entries?.length) return;

    const stop = startReminderChecker(routine.entries, shortNames, minutesBefore);

    return stop;
  }, [enabled, hasRoutine, routine, shortNames, minutesBefore]);

  const toggleReminders = async () => {
    const newEnabled = !enabled;

    if (newEnabled) {
      const perm = await requestNotificationPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setStatus(perm === "denied" 
          ? "Notifications blocked. Please enable in browser settings." 
          : "Permission needed for reminders.");
        return;
      }
      setStatus(`Reminders enabled. You'll get notified ${minutesBefore} minutes before each class.`);
    } else {
      setStatus("");
    }

    setRemindersEnabled(newEnabled);
    setEnabled(newEnabled);
  };

  const handleExportCalendar = () => {
    if (!routine?.entries?.length) return;
    downloadICS(routine.entries, shortNames, minutesBefore, semesterEndDate, "seu-routine.ics");
    const endLabel = new Date(semesterEndDate).toLocaleDateString();
    setStatus(`Calendar exported until ${endLabel} with ${minutesBefore} min reminders.`);
    setTimeout(() => setStatus(""), 5000);
  };

  const handleSetMinutes = (mins) => {
    setReminderMinutes(mins);
    setMinutesBefore(mins);

    if (enabled) {
      setStatus(`Reminder time updated to ${mins} minutes before class.`);
      setTimeout(() => setStatus(""), 2500);
    }
  };

  if (!hasRoutine) return null;

  return (
    <div className="panel p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Bell size={18} className="text-mint-400" />
            Class Reminders
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Get notified before each class (shows course + room). Browser option works only while site is open.
          </p>
        </div>

        <button
          onClick={toggleReminders}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition ${
            enabled 
              ? "bg-mint-400/10 text-mint-300 hover:bg-mint-400/20" 
              : "bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          {enabled ? <BellOff size={15} /> : <Bell size={15} />}
          {enabled ? "Disable" : "Enable"}
        </button>
      </div>

      {/* Reminder time selector */}
      <div className="mt-4">
        <div className="text-xs font-medium text-slate-400 mb-2">Remind me</div>
        <div className="flex flex-wrap gap-2">
          {[5, 10, 15, 30].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSetMinutes(mins)}
              className={`px-3 py-1 text-xs rounded-lg border transition ${
                minutesBefore === mins
                  ? "bg-mint-400/10 border-mint-400/40 text-mint-300"
                  : "border-white/10 hover:border-white/20 text-slate-300"
              }`}
            >
              {mins} min before
            </button>
          ))}
        </div>
      </div>

      {permission === "denied" && (
        <div className="mt-3 rounded-lg bg-rose-400/10 px-3 py-2 text-xs text-rose-300">
          Notifications are blocked. Enable them in your browser settings for this site.
        </div>
      )}

      {status && (
        <div className="mt-3 rounded-lg bg-mint-400/10 px-3 py-2 text-xs text-mint-300">
          {status}
        </div>
      )}

      <div className="mt-4 border-t border-white/10 pt-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Semester ends on
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={semesterEndDate}
              onChange={(e) => setSemesterEndDate(e.target.value)}
              className="field w-full max-w-[220px] text-sm py-2"
            />
            <button
              type="button"
              onClick={() => setSemesterEndDate("2026-10-03")}
              className="secondary-button px-2 py-1 text-xs"
              title="Reset to default"
            >
              Reset
            </button>
          </div>
        </div>

        <button
          onClick={handleExportCalendar}
          className="secondary-button w-full sm:w-auto"
        >
          <Calendar size={16} />
          Export to Phone Calendar (.ics)
          <Download size={15} />
        </button>


      </div>

      <div className="mt-2 text-xs text-slate-400">
        Browser reminders only work while this site/PWA is open.
      </div>
      <div className="mt-1 text-sm font-semibold text-mint-300">
        Calendar export is the most reliable for daily phone notifications (even when closed).
      </div>
    </div>
  );
}
