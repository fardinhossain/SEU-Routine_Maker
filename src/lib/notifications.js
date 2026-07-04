import { formatTime12, WEEK_DAYS } from "./routine";

const REMINDERS_ENABLED_KEY = "seu_reminders_enabled";
const NOTIFIED_TODAY_KEY = "seu_notified_today";
const REMINDER_MINUTES_KEY = "seu_reminder_minutes_before";

export function isRemindersEnabled() {
  return localStorage.getItem(REMINDERS_ENABLED_KEY) === "true";
}

export function setRemindersEnabled(enabled) {
  localStorage.setItem(REMINDERS_ENABLED_KEY, enabled ? "true" : "false");
  if (!enabled) {
    localStorage.removeItem(NOTIFIED_TODAY_KEY);
  }
}

export function getReminderMinutes() {
  const val = parseInt(localStorage.getItem(REMINDER_MINUTES_KEY), 10);
  if ([5, 10, 15, 30].includes(val)) return val;
  return 10; // default
}

export function setReminderMinutes(minutes) {
  if ([5, 10, 15, 30].includes(minutes)) {
    localStorage.setItem(REMINDER_MINUTES_KEY, minutes);
  }
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return "denied";
  }
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function getNotifiedSet() {
  try {
    const data = localStorage.getItem(NOTIFIED_TODAY_KEY);
    if (!data) return new Set();
    const parsed = JSON.parse(data);
    if (parsed.date !== getTodayKey()) {
      localStorage.removeItem(NOTIFIED_TODAY_KEY);
      return new Set();
    }
    return new Set(parsed.keys);
  } catch {
    return new Set();
  }
}

function saveNotifiedSet(set) {
  localStorage.setItem(
    NOTIFIED_TODAY_KEY,
    JSON.stringify({
      date: getTodayKey(),
      keys: Array.from(set),
    })
  );
}

function getCurrentDayName() {
  // SEU uses SAT as first day
  const jsDay = new Date().getDay(); // 0=Sun ... 6=Sat
  const map = [6, 0, 1, 2, 3, 4, 5]; // JS Sun=0 → our SAT=6, etc.
  return WEEK_DAYS[map[jsDay]];
}

function minutesUntil(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  return Math.floor((target - now) / 60000);
}

export function checkAndNotify(entries, shortNames = {}, minutesBefore = 10) {
  if (Notification.permission !== "granted") return;

  const today = getCurrentDayName();
  const notified = getNotifiedSet();
  let changed = false;

  const todaysClasses = entries.filter((e) => e.day === today);

  for (const entry of todaysClasses) {
    const minutesLeft = minutesUntil(entry.start);
    const windowStart = Math.max(0, minutesBefore - 1);
    if (minutesLeft > minutesBefore || minutesLeft < windowStart) continue;

    const course = entry.course;
    const code = course.courseCode;
    const name = shortNames[code] || course.shortTitle || course.courseTitle || code;
    const room = entry.room || "TBA";

    const notifKey = `${today}-${entry.start}-${code}`;

    if (notified.has(notifKey)) continue;

    const title = `${name} • ${room}`;
    const options = {
      body: `Starts at ${formatTime12(entry.start)}`,
      icon: "/favicon.svg",
      tag: notifKey,
      requireInteraction: false,
    };

    // Prefer Service Worker for better mobile/PWA support
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_NOTIFICATION",
        title,
        options,
      });
    } else {
      try {
        new Notification(title, options);
      } catch (e) {
        console.warn("Notification failed", e);
      }
    }

    notified.add(notifKey);
    changed = true;
  }

  if (changed) {
    saveNotifiedSet(notified);
  }
}

// Call this periodically when reminders are enabled
export function startReminderChecker(entries, shortNames, minutesBefore = 10) {
  // Check immediately
  checkAndNotify(entries, shortNames, minutesBefore);

  // Then every minute
  const interval = setInterval(() => {
    checkAndNotify(entries, shortNames, minutesBefore);
  }, 60 * 1000);

  return () => clearInterval(interval);
}

export function generateICS(entries, shortNames = {}, minutesBefore = 10, endDate = null) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SEU Routine Maker//Class Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  const now = new Date();
  let maxDate = new Date(now.getTime() + (8 * 7 * 24 * 60 * 60 * 1000)); // default 8 weeks

  if (endDate) {
    const parsedEnd = new Date(endDate);
    if (!isNaN(parsedEnd.getTime()) && parsedEnd > now) {
      maxDate = parsedEnd;
    }
  }

  // Generate events until we pass the end date (max ~30 weeks for safety)
  let week = 0;
  let keepGoing = true;

  while (keepGoing && week < 30) {
    let weekHasEvents = false;

    for (const entry of entries) {
      const dayIndex = WEEK_DAYS.indexOf(entry.day);
      if (dayIndex === -1) continue;

      // Calculate date for this day in the upcoming weeks
      const baseDate = new Date(now);
      const currentJsDay = baseDate.getDay();
      const targetJsDay = (dayIndex + 6) % 7; // SAT=6 in our system → JS 6=Sat

      let diff = targetJsDay - currentJsDay;
      if (diff < 0) diff += 7;
      diff += week * 7;

      const classDate = new Date(baseDate);
      classDate.setDate(baseDate.getDate() + diff);

      if (classDate > maxDate) {
        continue;
      }

      weekHasEvents = true;

      const [sh, sm] = entry.start.split(":").map(Number);
      const [eh, em] = entry.end.split(":").map(Number);

      const startDT = new Date(classDate);
      startDT.setHours(sh, sm, 0);

      const endDT = new Date(classDate);
      endDT.setHours(eh, em, 0);

      const uid = `${entry.id || entry.course.courseCode}-${classDate.toISOString().slice(0,10)}@seu-routine`;
      const course = entry.course;
      const name = shortNames[course.courseCode] || course.shortTitle || course.courseTitle || course.courseCode;
      const room = entry.room || "";

      const summary = `${name} • ${room}`.trim();

      const formatDate = (d) =>
        d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${uid}`);
      lines.push(`DTSTAMP:${formatDate(now)}`);
      lines.push(`DTSTART:${formatDate(startDT)}`);
      lines.push(`DTEND:${formatDate(endDT)}`);
      lines.push(`SUMMARY:${summary}`);
      if (room) lines.push(`LOCATION:${room}`);

      // Add automatic reminder (VALARM)
      lines.push("BEGIN:VALARM");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:${summary} starts soon`);
      lines.push(`TRIGGER:-PT${minutesBefore}M`);
      lines.push("END:VALARM");

      lines.push("END:VEVENT");
    }

    if (!weekHasEvents) {
      keepGoing = false;
    }

    week++;
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICS(entries, shortNames = {}, minutesBefore = 10, endDate = null, filename = "seu-class-schedule.ics") {
  const content = generateICS(entries, shortNames, minutesBefore, endDate);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
