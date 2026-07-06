import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import {
  extractHtmlPayload,
  makeShortTitle,
  normalizeCourseMetadata,
  parseUmsHtml,
  parseUmsText,
} from "../src/lib/parser.js";
import {
  chooseBestPdfText,
  hasPdfSignature,
  mergePdfTextCandidates,
  normalizePdfText,
  pdfTextItemsInContentOrder,
  pdfTextItemsToText,
} from "../src/lib/pdfImport.js";
import { hasImageSignature } from "../src/lib/imageImport.js";
import { extractCourseCodesFromOcr } from "../src/lib/ocr.js";
import {
  dayPatternKey,
  getDayPatternOptions,
  getTimeSlotOptions,
  groupSectionsBySchedule,
  matchesScheduleFilters,
} from "../src/lib/sectionGroups.js";
import {
  buildRoutine,
  findDuplicateCourseSelections,
  formatTime12,
  parseCodeList,
  uniqueCourseSelections,
} from "../src/lib/routine.js";

global.DOMParser = new JSDOM("").window.DOMParser;

assert.equal(hasPdfSignature(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31])), true);
assert.equal(hasPdfSignature(new Uint8Array([0x3c, 0x68, 0x74, 0x6d, 0x6c])), false);
assert.equal(hasImageSignature(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a])), true);
assert.equal(hasImageSignature(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), true);
assert.equal(hasImageSignature(new TextEncoder().encode("RIFF1234WEBP")), true);
assert.equal(hasImageSignature(new Uint8Array([0x25, 0x50, 0x44, 0x46])), false);
assert.equal(
  normalizePdfText("CSE 361 . 6  SUN # 13 : 30 – 14 : 50 @ SEU516"),
  "CSE361.6 SUN # 13:30 ~ 14:50 @ SEU516",
);
assert.equal(
  normalizePdfText("CSE\uE06E\uE06E\uE06D.\uE06D MON # \uE06C\uE06D:\uE06D0 ~ \uE06C\uE06E:50 @ SEU2\uE06C\uE06DB"),
  "CSE443.3 MON # 13:30 ~ 14:50 @ SEU213B",
);
assert.equal(normalizePdfText("CSE4433 CSE3616 CSE3811"), "CSE443.3 CSE361.6 CSE381.1");
assert.equal(normalizePdfText("CSE38I.I CSE44A:3 CSE362 2"), "CSE381.1 CSE444.3 CSE362.2");
assert.equal(
  normalizePdfText("C S E 4 4 3 . 3\nMON # 1 3 : 3 0 ~ 1 4:50 @\nS E U 2 1 3 B"),
  "CSE443.3\nMON # 13:30 ~ 14:50 @\nSEU213B",
);
assert.equal(
  normalizePdfText("R E G I S T E R E D  C O U R S E S\nCSE381.1 M0N # 11;30 - 12.50 © SEUS16"),
  "Registered Courses\nCSE381.1 MON # 11:30 ~ 12:50 @ SEU516",
);
assert.equal(
  pdfTextItemsToText([
    { str: "SUN # 13:30 ~ 14:50 @ SEU516", transform: [1, 0, 0, 1, 300, 700], height: 12 },
    { str: "CSE361.6", transform: [1, 0, 0, 1, 20, 700], height: 12 },
    { str: "Operating Systems", transform: [1, 0, 0, 1, 20, 680], height: 12 },
  ]),
  "CSE361.6 SUN # 13:30 ~ 14:50 @ SEU516\nOperating Systems",
);

const pdfGridItems = [
  { str: "CSE361.6", transform: [1, 0, 0, 1, 20, 700], height: 12, hasEOL: true },
  { str: "Operating Systems", transform: [1, 0, 0, 1, 20, 680], height: 12, hasEOL: true },
  { str: "[MRRR] Mst Rubaiya Raktin Raha", transform: [1, 0, 0, 1, 260, 700], height: 12, hasEOL: true },
  { str: "rubaiya.raktinraha@seu.edu.bd", transform: [1, 0, 0, 1, 260, 680], height: 12, hasEOL: true },
  { str: "SUN # 13:30 ~ 14:50 @ SEU516", transform: [1, 0, 0, 1, 520, 700], height: 12, hasEOL: true },
  { str: "TUE # 13:30 ~ 14:50 @ SEU516", transform: [1, 0, 0, 1, 520, 680], height: 12, hasEOL: true },
  { str: "CSE382.17", transform: [1, 0, 0, 1, 20, 620], height: 12, hasEOL: true },
  { str: "Introduction to Embedded Systems Lab", transform: [1, 0, 0, 1, 20, 600], height: 12, hasEOL: true },
  { str: "[SRAB] Sheikh Fazle Rabbi", transform: [1, 0, 0, 1, 260, 620], height: 12, hasEOL: true },
  { str: "SUN # 16:30 ~ 18:30 @ SEU610", transform: [1, 0, 0, 1, 520, 620], height: 12, hasEOL: true },
];
const contentOrderPdfText = pdfTextItemsInContentOrder(pdfGridItems);
assert.match(contentOrderPdfText, /CSE361\.6\nOperating Systems\n\[MRRR\]/);
assert.match(contentOrderPdfText, /CSE382\.17\nIntroduction to Embedded Systems Lab\n\[SRAB\]/);
assert.equal(
  chooseBestPdfText([
    "CSE361.6\nSUN # 13:30 ~ 14:50 @ SEU516\nSUN # 16:30 ~ 18:30 @ SEU610",
    contentOrderPdfText,
  ]),
  contentOrderPdfText,
);

const mergedPartialPdfText = mergePdfTextCandidates([
  [
    "Registered Courses",
    "CSE381.1",
    "Introduction to Embedded Systems",
    "[FUZ] Farhad Uz Zaman",
    "MON # 11:30 ~ 12:50 @ SEU331",
    "WED # 11:30 ~ 12:50 @ SEU331",
    "CSE382.17",
    "Introduction to Embedded Systems Lab",
    "[SRAB] Sheikh Fazle Rabbi",
    "SUN # 16:30 ~ 18:30 @ SEU610",
  ].join("\n"),
  [
    "Registered Courses",
    "CSE381.1 Course [FUZ] Farhad Uz Zaman",
    "MON # 11:30 ~ 12:50 @ SEU331",
    "WED # 11:30 ~ 12:50 @ SEU331",
    "SUN # 16:30 ~ 18:30 @ SEU610",
    "CSE443.3 Computer Graphics & Animation [MHSU] Mahjabin Sultana",
    "MON # 13:30 ~ 14:50 @ SEU213B",
    "WED # 13:30 ~ 14:50 @ SEU213B",
  ].join("\n"),
]);
assert.deepEqual(
  parseUmsText(mergedPartialPdfText).map(({ courseCode, shortTitle, meetings }) => ({
    courseCode,
    shortTitle,
    meetingCount: meetings.length,
  })),
  [
    { courseCode: "CSE381.1", shortTitle: "ES", meetingCount: 2 },
    { courseCode: "CSE382.17", shortTitle: "ES Lab", meetingCount: 1 },
    { courseCode: "CSE443.3", shortTitle: "CGA", meetingCount: 2 },
  ],
);

const html = `
  <div class="ums-grid-offered-section">
    <div>CSE361.3</div>
    <div>Operating Systems</div>
    <div>3</div>
    <div><span>[MMIS] Md. Ismail</span></div>
    <div>37</div>
    <div><p>SUN # 16:30 ~ 17:50 @ SEU319</p><p>TUE # 16:30 ~ 17:50 @ SEU319</p></div>
    <div>REGULAR</div><div>Preregistered Course.</div>
  </div>`;

const courses = parseUmsHtml(html);
assert.equal(courses.length, 1);
assert.equal(courses[0].courseCode, "CSE361.3");
assert.equal(courses[0].courseTitle, "Operating Systems");
assert.equal(courses[0].shortTitle, "OS");
assert.equal(courses[0].faculty, "MMIS");
assert.equal(courses[0].facultyName, "Md. Ismail");
assert.deepEqual(courses[0].meetings, [
  { day: "SUN", start: "16:30", end: "17:50", room: "SEU319" },
  { day: "TUE", start: "16:30", end: "17:50", room: "SEU319" },
]);
assert.equal(makeShortTitle("Operating Systems Lab"), "OS Lab");
assert.equal(makeShortTitle("Introduction to Embedded Systems"), "ES");
assert.equal(makeShortTitle("Computer Graphics & Animation Lab"), "CGA Lab");
assert.deepEqual(
  normalizeCourseMetadata({ courseCode: "CSE381.1", courseTitle: "Course", shortTitle: "COURS" }),
  {
    courseCode: "CSE381.1",
    courseTitle: "Introduction to Embedded Systems",
    shortTitle: "ES",
    shortName: "ES",
  },
);

const mhtmlBoundary = "----=_SEU_ROUTINE_TEST";
const quotedPrintableHtml = html.replace(/=/g, "=3D");
const mhtml = [
  "From: <Saved by Chrome>",
  "MIME-Version: 1.0",
  `Content-Type: multipart/related; boundary=\"${mhtmlBoundary}\"`,
  "",
  `--${mhtmlBoundary}`,
  "Content-Type: text/html; charset=utf-8",
  "Content-Transfer-Encoding: quoted-printable",
  "",
  quotedPrintableHtml,
  `--${mhtmlBoundary}--`,
].join("\r\n");
assert.match(extractHtmlPayload(mhtml), /ums-grid-offered-section/);
assert.deepEqual(parseUmsHtml(mhtml), courses);

const dashboardHtml = `
  <main>
    <section>
      <h2>Registered Courses</h2>
      <div class="student-count grid items-center">
        <div>
          <div>CSE443.3</div>
          <div>Computer Graphics &amp; Animation</div>
        </div>
        <div><div>[MHSU] Mahjabin Sultana</div></div>
        <div>
          <div>MON # 13:30 ~ 14:50 @ SEU213B</div>
          <div>WED # 13:30 ~ 14:50 @ SEU213B</div>
        </div>
      </div>
      <div class="student-count grid items-center">
        <div>
          <div>CSE361.6</div>
          <div>Operating Systems</div>
        </div>
        <div><div>[MRRR] Mst Rubaiya Raktin Raha</div></div>
        <div>
          <div>SUN # 13:30 ~ 14:50 @ SEU516</div>
          <div>TUE # 13:30 ~ 14:50 @ SEU516</div>
        </div>
      </div>
    </section>
  </main>`;

const dashboardCourses = parseUmsHtml(dashboardHtml);
assert.equal(dashboardCourses.parseDebug.sourceType, "dashboard-registered-courses");
assert.equal(dashboardCourses.parseDebug.courseSectionCodesFound, 2);
assert.equal(dashboardCourses.parseDebug.scheduleLinesFound, 4);
assert.deepEqual(dashboardCourses.map((course) => course.courseCode), ["CSE361.6", "CSE443.3"]);

const dashboardOs = dashboardCourses.find((course) => course.courseCode === "CSE361.6");
assert.equal(dashboardOs.sectionCode, "CSE361.6");
assert.equal(dashboardOs.baseCourseCode, "CSE361");
assert.equal(dashboardOs.section, "6");
assert.equal(dashboardOs.courseTitle, "Operating Systems");
assert.equal(dashboardOs.shortName, "OS");
assert.equal(dashboardOs.teacherInitial, "MRRR");
assert.equal(dashboardOs.teacherName, "Mst Rubaiya Raktin Raha");
assert.deepEqual(dashboardOs.schedules, [
  { day: "SUN", start: "13:30", end: "14:50", room: "SEU516" },
  { day: "TUE", start: "13:30", end: "14:50", room: "SEU516" },
]);
assert.equal(dashboardOs.sourceType, "dashboard-registered-courses");

const registeredPdfTextCourses = parseUmsText([
  "Registered Courses",
  "CSE361.6 [MRRR] Mst Rubaiya Raktin Raha SUN # 13:30 ~ 14:50 @ SEU516",
  "Operating Systems rubaiya.raktinraha@seu.edu.bd TUE # 13:30 ~ 14:50 @ SEU516",
].join("\n"));
assert.equal(registeredPdfTextCourses.parseDebug.sourceType, "dashboard-registered-courses");
assert.deepEqual(registeredPdfTextCourses.map((course) => course.courseCode), ["CSE361.6"]);
assert.equal(registeredPdfTextCourses[0].courseTitle, "Operating Systems");

const malformedTitlePdfCourses = parseUmsText([
  "Registered Courses",
  "CSE362.2",
  "Course",
  "[MMIS] Md. Ismail",
  "TUE # 11:30 ~ 13:30 @ SEU213A",
  "CSE443.3",
  "SEU213B",
  "[MHSU] Mahjabin Sultana",
  "MON # 13:30 ~ 14:50 @ SEU213B",
].join("\n"));
assert.deepEqual(
  malformedTitlePdfCourses.map(({ courseCode, courseTitle, shortTitle }) => ({ courseCode, courseTitle, shortTitle })),
  [
    { courseCode: "CSE362.2", courseTitle: "Operating Systems Lab", shortTitle: "OS Lab" },
    { courseCode: "CSE443.3", courseTitle: "Computer Graphics & Animation", shortTitle: "CGA" },
  ],
);

const pdfWithImpossibleSchedule = parseUmsText([
  "Registered Courses",
  "CSE361.6 Operating Systems [MRRR] Mst Rubaiya Raktin Raha",
  "SUN # 29:90 ~ 14:50 @ SEU516",
  "TUE # 13:30 ~ 14:50 @ SEU516",
].join("\n"));
assert.deepEqual(pdfWithImpossibleSchedule[0].meetings, [
  { day: "TUE", start: "13:30", end: "14:50", room: "SEU516" },
]);

const registeredGridPdfCourses = parseUmsText(`Registered Courses\n${contentOrderPdfText}`);
assert.deepEqual(
  registeredGridPdfCourses.map((course) => course.courseCode),
  ["CSE361.6", "CSE382.17"],
);
assert.equal(
  registeredGridPdfCourses.find((course) => course.courseCode === "CSE382.17").courseTitle,
  "Introduction to Embedded Systems Lab",
);
assert.deepEqual(
  registeredGridPdfCourses.find((course) => course.courseCode === "CSE382.17").meetings,
  [{ day: "SUN", start: "16:30", end: "18:30", room: "SEU610" }],
);

const offeredPdfTextCourses = parseUmsText([
  "Offered Sections",
  "CSE361.6",
  "Operating Systems",
  "[MRRR] Mst Rubaiya Raktin Raha",
  "SUN # 13:30 ~ 14:50 @ SEU516",
  "TUE # 13:30 ~ 14:50 @ SEU516",
].join("\n"));
assert.equal(offeredPdfTextCourses.parseDebug.sourceType, "offered-sections");
assert.equal(offeredPdfTextCourses[0].sourceType, "offered-sections");

assert.throws(
  () => parseUmsHtml("<div>Registered Courses CSE361.6 Operating Systems [MRRR] Mst Rubaiya Raktin Raha</div>"),
  /Course sections found, but no timetable schedule found\./,
);

const rawPayloadDashboard = `
  <main>
    <!-- Registered Courses
      CSE361.6
      Operating Systems
      [MRRR] Mst Rubaiya Raktin Raha
      SUN # 13:30 ~ 14:50 @ SEU516
      TUE # 13:30 ~ 14:50 @ SEU516
    -->
    <div
      data-row="CSE443.3 Computer Graphics &amp; Animation [MHSU] Mahjabin Sultana MON # 13:30 ~ 14:50 @ SEU213B WED # 13:30 ~ 14:50 @ SEU213B">
    </div>
  </main>`;
const rawPayloadCourses = parseUmsHtml(rawPayloadDashboard);
assert.equal(rawPayloadCourses.parseDebug.sourceType, "dashboard-registered-courses");
assert.deepEqual(rawPayloadCourses.map((course) => course.courseCode), ["CSE361.6", "CSE443.3"]);
assert.equal(rawPayloadCourses.find((course) => course.courseCode === "CSE443.3").courseTitle, "Computer Graphics & Animation");
assert.deepEqual(rawPayloadCourses.find((course) => course.courseCode === "CSE443.3").meetings, [
  { day: "MON", start: "13:30", end: "14:50", room: "SEU213B" },
  { day: "WED", start: "13:30", end: "14:50", room: "SEU213B" },
]);

const dashboardWithUnscheduledFydp = `
  <main>
    <section>
      <h2>Registered Courses</h2>
      <div class="student-count grid items-center">
        <div><div>CSE361.6</div><div>Operating Systems</div></div>
        <div><div>[MRRR] Mst Rubaiya Raktin Raha</div></div>
        <div>
          <div>SUN # 13:30 ~ 14:50 @ SEU516</div>
          <div>TUE # 13:30 ~ 14:50 @ SEU516</div>
        </div>
      </div>
      <div class="student-count grid items-center">
        <div><div>CSE443.3</div><div>Computer Graphics &amp; Animation</div></div>
        <div><div>[MHSU] Mahjabin Sultana</div></div>
        <div>
          <div>MON # 13:30 ~ 14:50 @ SEU213B</div>
          <div>WED # 13:30 ~ 14:50 @ SEU213B</div>
        </div>
      </div>
      <div class="student-count grid items-center">
        <div><div>CSE460.1</div><div>Final Year Design Project I</div></div>
        <div></div>
        <div></div>
      </div>
    </section>
  </main>`;

const coursesWithoutUnscheduledFydp = parseUmsHtml(dashboardWithUnscheduledFydp);
assert.deepEqual(
  coursesWithoutUnscheduledFydp.map((course) => course.courseCode),
  ["CSE361.6", "CSE443.3"],
);
assert.equal(
  coursesWithoutUnscheduledFydp.some((course) => course.courseCode === "CSE460.1"),
  false,
);
assert.equal(buildRoutine(coursesWithoutUnscheduledFydp).conflicts.length, 0);

const conflictRoutine = buildRoutine([
  {
    courseCode: "CSE361.3",
    courseTitle: "Operating Systems",
    meetings: [{ day: "SUN", start: "13:30", end: "14:50", room: "SEU319" }],
  },
  {
    courseCode: "CSE443.5",
    meetings: [{ day: "SUN", start: "14:00", end: "15:20", room: "SEU333" }],
  },
  {
    courseCode: "CSE444.1",
    meetings: [
      { day: "SUN", start: "15:20", end: "17:20", room: "SEU613" },
      { day: "TUE", start: "13:30", end: "14:50", room: "SEU613" },
    ],
  },
]);

assert.equal(conflictRoutine.conflicts.length, 1);
assert.deepEqual(conflictRoutine.conflicts[0], {
  first: "CSE361.3",
  second: "CSE443.5",
  day: "SUN",
  start: "14:00",
  end: "14:50",
});
assert.equal(conflictRoutine.conflictIds.size, 2);
assert.equal(formatTime12("08:00"), "8:00 AM");
assert.equal(formatTime12("13:30"), "1:30 PM");
assert.equal(formatTime12("00:15"), "12:15 AM");

const sharedStartRoutine = buildRoutine([
  {
    courseCode: "CSE381.1",
    meetings: [{ day: "MON", start: "11:30", end: "12:50", room: "SEU331" }],
  },
  {
    courseCode: "CSE362.2",
    meetings: [{ day: "TUE", start: "11:30", end: "13:30", room: "SEU213A" }],
  },
]);
assert.deepEqual(sharedStartRoutine.slots, [
  { key: "11:30", start: "11:30", ends: ["12:50", "13:30"] },
]);

const mergedMorningRoutine = buildRoutine([
  {
    courseCode: "CSE444.3",
    courseTitle: "Computer Graphics & Animation Lab",
    meetings: [{ day: "SAT", start: "08:00", end: "10:00", room: "SEU804" }],
  },
  {
    courseCode: "CSE381.6",
    courseTitle: "Introduction to Embedded Systems",
    meetings: [{ day: "SUN", start: "08:30", end: "09:50", room: "SEU406" }],
  },
]);
assert.deepEqual(mergedMorningRoutine.slots, [
  {
    key: "08:00/08:30",
    start: "08:00",
    starts: ["08:00", "08:30"],
    ends: ["10:00", "09:50"],
  },
]);
assert.deepEqual(
  mergedMorningRoutine.entries.map((entry) => entry.slotKey),
  ["08:00/08:30", "08:00/08:30"],
);

const separateMorningRoutine = buildRoutine([
  {
    courseCode: "CSE361.1",
    courseTitle: "Operating Systems",
    meetings: [{ day: "SAT", start: "08:00", end: "09:20", room: "SEU406" }],
  },
  {
    courseCode: "CSE381.6",
    courseTitle: "Introduction to Embedded Systems",
    meetings: [{ day: "SUN", start: "08:30", end: "09:50", room: "SEU406" }],
  },
]);
assert.deepEqual(separateMorningRoutine.slots, [
  { key: "08:00", start: "08:00", ends: ["09:20"] },
  { key: "08:30", start: "08:30", ends: ["09:50"] },
]);

const routineWithGap = buildRoutine([
  {
    courseCode: "CSE361.6",
    courseTitle: "Operating Systems",
    meetings: [{ day: "SUN", start: "13:30", end: "14:50", room: "SEU516" }],
  },
  {
    courseCode: "CSE381.6",
    courseTitle: "Introduction to Embedded Systems",
    meetings: [{ day: "SUN", start: "08:30", end: "09:50", room: "SEU406" }],
  },
]);
assert.equal(routineWithGap.entries[1].gap, undefined);
assert.deepEqual(routineWithGap.entries[0].gap, {
  start: "09:50",
  end: "13:30",
  minutes: 220,
});

const repeatedCourseCodes = parseCodeList("CSE361.6\nCSE443.4\nCSE362.4\nCSE362.3");
assert.deepEqual(uniqueCourseSelections(repeatedCourseCodes), ["CSE361.6", "CSE443.4", "CSE362.4"]);
assert.deepEqual(findDuplicateCourseSelections(repeatedCourseCodes), [
  { course: "CSE362", sections: ["CSE362.4", "CSE362.3"] },
]);
assert.deepEqual(parseCodeList("cse361.6 CSE361 . 6 CSE443,3"), ["CSE361.6", "CSE443.3"]);

assert.deepEqual(
  extractCourseCodesFromOcr("Selected: CSE 361.3, CSE443,4 and CSE 444:1", [
    { courseCode: "CSE361.3" },
    { courseCode: "CSE443.4" },
    { courseCode: "CSE444.1" },
  ]),
  ["CSE361.3", "CSE443.4", "CSE444.1"],
);

assert.deepEqual(
  extractCourseCodesFromOcr(
    [
      "CSE444: Computer Graphics & Animation Lab   Sec 1",
      "CSE361: Operating Systems (Theory)           Sec 6",
      "CSE381: Introduction to Embedded Systems     Sec 1",
      "CSE443: Computer Graphics & Animation        Sec 3",
      "CSE382: Introduction to Embedded Systems Lab Sec 2",
      "CSE362: Operating Systems Lab                 Sec 2",
      "CSE361: Operating Systems (Theory)           Sec 6",
    ].join("\n"),
    [
      { courseCode: "CSE444.1" },
      { courseCode: "CSE361.6" },
      { courseCode: "CSE381.1" },
      { courseCode: "CSE443.3" },
      { courseCode: "CSE382.2" },
      { courseCode: "CSE362.2" },
    ],
  ),
  ["CSE444.1", "CSE361.6", "CSE381.1", "CSE443.3", "CSE382.2", "CSE362.2"],
);

assert.deepEqual(
  extractCourseCodesFromOcr(
    [
      "CSE444: Computer Graphics & Animation Lab",
      "CSE361: Operating Systems",
      "CSE381: Embedded Systems",
      "Section",
      "Sec 1",
      "Sec 6",
      "Sec 1",
    ].join("\n"),
    [
      { courseCode: "CSE444.1" },
      { courseCode: "CSE361.6" },
      { courseCode: "CSE381.1" },
    ],
  ),
  ["CSE444.1", "CSE361.6", "CSE381.1"],
);

const dashboardOcrCourses = [
  { courseCode: "CSE443.3", courseTitle: "Computer Graphics & Animation" },
  { courseCode: "CSE444.3", courseTitle: "Computer Graphics & Animation Lab" },
  { courseCode: "CSE361.6", courseTitle: "Operating Systems" },
  { courseCode: "CSE362.2", courseTitle: "Operating Systems Lab" },
  { courseCode: "CSE381.1", courseTitle: "Introduction to Embedded Systems" },
  { courseCode: "CSE382.1", courseTitle: "Introduction to Embedded Systems Lab" },
];

assert.deepEqual(
  extractCourseCodesFromOcr(
    [
      "CSE44S 3 Computer Graphics & Animation",
      "CSE444.3 Computer Graphics & Animation Lab",
      "CSE36I G Operating Systems",
      "CSE362 2 Operating Systems Lab",
      "CSE38I I Introduction to Embedded Systems",
      "CSE382.1 Introduction to Embedded Systems Lab",
    ].join("\n"),
    dashboardOcrCourses,
  ),
  ["CSE443.3", "CSE444.3", "CSE361.6", "CSE362.2", "CSE381.1", "CSE382.1"],
);

assert.deepEqual(
  extractCourseCodesFromOcr(
    [
      "Computer Graphics & Animation",
      "Computer Graphics & Animation Lab",
      "Operating Systems",
      "Operating Systems Lab",
      "Embedded Systems",
      "Embedded Systems Lab",
    ].join("\n"),
    dashboardOcrCourses,
  ),
  ["CSE443.3", "CSE444.3", "CSE361.6", "CSE362.2", "CSE381.1", "CSE382.1"],
);

assert.deepEqual(
  extractCourseCodesFromOcr("Operating Systems Lab", dashboardOcrCourses),
  ["CSE362.2"],
);

// Additional normalize robustness (spaced codes / separators)
assert.equal(
  normalizePdfText("CSE 361 . 3 SUN # 13 : 30 ~ 14 : 50 @ SEU 516"),
  "CSE361.3 SUN # 13:30 ~ 14:50 @ SEU516",
);
assert.equal(
  normalizePdfText("CSE44O.3 MON # 13;30 - 14.50 @ SEU213B"),
  "CSE440.3 MON # 13:30 ~ 14:50 @ SEU213B",
);

const groupedSections = groupSectionsBySchedule([
  {
    courseCode: "CSE361.3",
    meetings: [
      { day: "SUN", start: "16:30", end: "17:50", room: "SEU319" },
      { day: "TUE", start: "16:30", end: "17:50", room: "SEU319" },
    ],
  },
  {
    courseCode: "CSE443.7",
    courseTitle: "Computer Graphics & Animation",
    meetings: [
      { day: "SUN", start: "16:30", end: "17:50", room: "SEU509" },
      { day: "TUE", start: "16:30", end: "17:50", room: "SEU509" },
    ],
  },
  {
    courseCode: "CSE362.2",
    courseTitle: "Operating Systems Lab",
    meetings: [{ day: "TUE", start: "11:30", end: "13:30", room: "SEU213A" }],
  },
]);
assert.equal(groupedSections.length, 2);
assert.equal(groupedSections[0].key, "TUE:11:30-13:30");
assert.deepEqual(groupedSections[1].courses.map((course) => course.courseCode), ["CSE361.3", "CSE443.7"]);

const mixedScheduleGroup = groupSectionsBySchedule([
  {
    courseCode: "CSE362.2",
    courseTitle: "Operating Systems Lab",
    meetings: [{ day: "TUE", start: "11:30", end: "13:30", room: "SEU213A" }],
  },
  {
    courseCode: "CSE381.1",
    courseTitle: "Introduction to Embedded Systems",
    meetings: [{ day: "TUE", start: "11:30", end: "13:30", room: "SEU331" }],
  },
]);
assert.deepEqual(mixedScheduleGroup[0].courses.map((course) => course.courseCode), ["CSE381.1", "CSE362.2"]);

const sameStartGroups = groupSectionsBySchedule([
  {
    courseCode: "CSE382.6",
    courseTitle: "Introduction to Embedded Systems Lab",
    meetings: [{ day: "SUN", start: "08:30", end: "10:30", room: "SEU610" }],
  },
  {
    courseCode: "CSE361.12",
    courseTitle: "Operating Systems",
    meetings: [
      { day: "MON", start: "08:30", end: "09:50", room: "SEU509" },
      { day: "WED", start: "08:30", end: "09:50", room: "SEU509" },
    ],
  },
]);
assert.deepEqual(sameStartGroups.map((group) => group.courses[0].courseCode), ["CSE361.12", "CSE382.6"]);

const filterCourses = [
  {
    courseCode: "CSE361.12",
    meetings: [
      { day: "MON", start: "08:30", end: "09:50", room: "SEU509" },
      { day: "WED", start: "08:30", end: "09:50", room: "SEU509" },
    ],
  },
  {
    courseCode: "CSE382.6",
    meetings: [{ day: "SAT", start: "8:00", end: "10:00", room: "SEU610" }],
  },
  {
    courseCode: "CSE443.7",
    meetings: [
      { day: "SUN", start: "13:30", end: "14:50", room: "SEU509" },
      { day: "TUE", start: "13:30", end: "14:50", room: "SEU509" },
    ],
  },
];
assert.equal(dayPatternKey(filterCourses[0].meetings), "MON|WED");
assert.deepEqual(getDayPatternOptions(filterCourses), [
  { value: "MON", label: "Monday" },
  { value: "TUE", label: "Tuesday" },
  { value: "WED", label: "Wednesday" },
  { value: "THU", label: "Thursday" },
  { value: "FRI", label: "Friday" },
  { value: "SAT", label: "Saturday" },
  { value: "SUN", label: "Sunday" },
  { value: "MON|WED", label: "Monday - Wednesday" },
  { value: "SAT|THU", label: "Saturday - Thursday" },
  { value: "SUN|TUE", label: "Sunday - Tuesday" },
]);
assert.deepEqual(getTimeSlotOptions(filterCourses), [
  { value: "08:00|10:00", label: "08:00 AM - 10:00 AM" },
  { value: "08:30|09:50", label: "08:30 AM - 09:50 AM" },
  { value: "13:30|14:50", label: "01:30 PM - 02:50 PM" },
]);
assert.equal(matchesScheduleFilters(filterCourses[0], "MON|WED", "08:30|09:50"), true);
assert.equal(matchesScheduleFilters(filterCourses[0], "MON", "08:30|09:50"), true);
assert.equal(matchesScheduleFilters(filterCourses[0], "THU", "08:30|09:50"), false);
assert.equal(matchesScheduleFilters(filterCourses[2], "SUN|TUE", "08:30|09:50"), false);

assert.deepEqual(
  extractCourseCodesFromOcr(
    [
      "Advised Sections",
      "# Code Credits Faculty",
      "1 CSE361.6 3 N/A",
      "2 CSE362 2 1 N/A",
      "3 CSE38I.I 3 N/A",
      "4 CSE382,1 1 N/A",
      "5 CSE443.3 3 N/A",
      "6 CSE44A.3 1 N/A",
    ].join("\n"),
    [
      { courseCode: "CSE361.6" },
      { courseCode: "CSE362.2" },
      { courseCode: "CSE381.1" },
      { courseCode: "CSE382.1" },
      { courseCode: "CSE443.3" },
      { courseCode: "CSE444.3" },
    ],
  ),
  ["CSE361.6", "CSE362.2", "CSE381.1", "CSE382.1", "CSE443.3", "CSE444.3"],
);

console.log("Parser and conflict checks passed.");
