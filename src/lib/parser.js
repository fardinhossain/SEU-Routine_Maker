const COURSE_CODE_PATTERN = /\b[A-Z]{2,}[A-Z0-9-]*\d{2,4}(?:\.\d+)+\b/i;
const MEETING_PATTERN = /\b(SAT|SUN|MON|TUE|WED|THU|FRI)\s*#\s*(\d{1,2}:\d{2})\s*(?:~|–|—|-)\s*(\d{1,2}:\d{2})\s*@\s*([^\s,;|<]+)/gi;

function cleanText(value = "") {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function textWithBreaks(element) {
  if (!element) return "";

  const lines = [...element.querySelectorAll("p, li")]
    .map((node) => cleanText(node.textContent))
    .filter(Boolean);

  if (lines.length) return lines.join("\n");

  const clone = element.cloneNode(true);
  clone.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
  return clone.textContent || "";
}

export function parseMeetings(element) {
  const source = textWithBreaks(element);
  const meetings = [];
  let match;

  MEETING_PATTERN.lastIndex = 0;
  while ((match = MEETING_PATTERN.exec(source)) !== null) {
    const meeting = {
      day: match[1].toUpperCase(),
      start: match[2].padStart(5, "0"),
      end: match[3].padStart(5, "0"),
      room: match[4].replace(/[.)]+$/, "").toUpperCase(),
    };

    const key = `${meeting.day}-${meeting.start}-${meeting.end}-${meeting.room}`;
    if (!meetings.some((item) => `${item.day}-${item.start}-${item.end}-${item.room}` === key)) {
      meetings.push(meeting);
    }
  }

  return meetings;
}

export function makeShortTitle(title = "") {
  const normalized = cleanText(title).toLowerCase();
  const knownTitles = {
    "operating systems": "OS",
    "operating systems lab": "OS Lab",
    "introduction to embedded systems": "ES",
    "introduction to embedded systems lab": "ES Lab",
    "computer graphics & animation": "CGA",
    "computer graphics and animation": "CGA",
    "computer graphics & animation lab": "CGA Lab",
    "computer graphics and animation lab": "CGA Lab",
  };

  if (knownTitles[normalized]) return knownTitles[normalized];

  const isLab = /\blab(?:oratory)?\b/i.test(title);
  const words = cleanText(title)
    .replace(/\blab(?:oratory)?\b/gi, "")
    .replace(/[^a-z0-9 ]/gi, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !["introduction", "intro", "to", "of", "the", "and", "for"].includes(word.toLowerCase()));

  const acronym = words.length > 1
    ? words.map((word) => word[0]).join("").toUpperCase().slice(0, 6)
    : (words[0] || "Course").slice(0, 5).toUpperCase();

  return `${acronym}${isLab ? " Lab" : ""}`;
}

function rowCells(row) {
  if (row.tagName === "TR") {
    return [...row.children].filter((cell) => ["TD", "TH"].includes(cell.tagName));
  }
  return [...row.children];
}

function parseRow(row) {
  const cells = rowCells(row);
  if (cells.length < 6) return null;

  const texts = cells.map((cell) => cleanText(cell.textContent));
  const codeMatch = texts[0]?.match(COURSE_CODE_PATTERN);
  if (!codeMatch) return null;

  const code = codeMatch[0].toUpperCase().replace(/\s/g, "");
  const scheduleOptions = cells
    .map((cell) => parseMeetings(cell))
    .sort((a, b) => b.length - a.length);
  const meetings = scheduleOptions[0] || [];
  if (!meetings.length) return null;

  const facultyText = texts[3] || texts.find((text) => /\[[A-Z0-9]+\]/i.test(text)) || "";
  const facultyMatch = facultyText.match(/\[([^\]]+)\]/);
  const title = texts[1] || "Untitled course";

  return {
    courseCode: code,
    courseTitle: title,
    shortTitle: makeShortTitle(title),
    credits: texts[2] || "",
    faculty: facultyMatch ? facultyMatch[1].trim().toUpperCase() : "TBA",
    facultyName: facultyText.replace(/^\s*\[[^\]]+\]\s*/, "").trim(),
    meetings,
  };
}

export function parseUmsHtml(rawHtml) {
  if (!rawHtml || !rawHtml.trim()) {
    throw new Error("Please upload or paste your UMS HTML first.");
  }

  const document = new DOMParser().parseFromString(rawHtml, "text/html");
  const rows = [
    ...document.querySelectorAll("table tr"),
    ...document.querySelectorAll(".ums-grid-offered-section"),
  ];

  const courses = new Map();
  rows.forEach((row) => {
    const parsed = parseRow(row);
    if (!parsed) return;

    const current = courses.get(parsed.courseCode);
    if (!current) {
      courses.set(parsed.courseCode, parsed);
      return;
    }

    const existing = new Set(current.meetings.map((item) => JSON.stringify(item)));
    parsed.meetings.forEach((meeting) => {
      if (!existing.has(JSON.stringify(meeting))) current.meetings.push(meeting);
    });
  });

  const result = [...courses.values()].sort((a, b) =>
    a.courseCode.localeCompare(b.courseCode, undefined, { numeric: true }),
  );

  if (!result.length) {
    throw new Error(
      "No valid course sections with timetable data were found. Make sure this is the saved UMS Offered Sections page.",
    );
  }

  return result;
}
