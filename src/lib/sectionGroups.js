import { timeToMinutes, WEEK_DAYS } from "./routine.js";

const dayOrder = new Map(WEEK_DAYS.map((day, index) => [day, index]));

function isLabCourse(course) {
  return /\blab(?:oratory)?\b/i.test(course.courseTitle || "");
}

function normalizedMeetings(course) {
  return course.meetings
    .map(({ day, start, end }) => ({ day, start, end }))
    .sort((left, right) =>
      (dayOrder.get(left.day) ?? 99) - (dayOrder.get(right.day) ?? 99)
      || timeToMinutes(left.start) - timeToMinutes(right.start)
      || timeToMinutes(left.end) - timeToMinutes(right.end),
    );
}

export function scheduleGroupKey(course) {
  return normalizedMeetings(course)
    .map((meeting) => `${meeting.day}:${meeting.start}-${meeting.end}`)
    .join("|");
}

export function groupSectionsBySchedule(courses = []) {
  const groups = new Map();

  courses.forEach((course) => {
    const key = scheduleGroupKey(course);
    if (!key) return;

    const current = groups.get(key) || {
      key,
      meetings: normalizedMeetings(course),
      courses: [],
    };
    current.courses.push(course);
    groups.set(key, current);
  });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      courses: group.courses.sort((left, right) =>
        Number(isLabCourse(left)) - Number(isLabCourse(right))
        || left.courseCode.localeCompare(right.courseCode, undefined, { numeric: true }),
      ),
    }))
    .sort((left, right) => {
      const leftStart = Math.min(...left.meetings.map((meeting) => timeToMinutes(meeting.start)));
      const rightStart = Math.min(...right.meetings.map((meeting) => timeToMinutes(meeting.start)));
      const leftIsLabOnly = left.courses.every(isLabCourse);
      const rightIsLabOnly = right.courses.every(isLabCourse);
      const leftDay = Math.min(...left.meetings.map((meeting) => dayOrder.get(meeting.day) ?? 99));
      const rightDay = Math.min(...right.meetings.map((meeting) => dayOrder.get(meeting.day) ?? 99));
      return leftStart - rightStart
        || Number(leftIsLabOnly) - Number(rightIsLabOnly)
        || leftDay - rightDay
        || left.key.localeCompare(right.key);
    });
}
