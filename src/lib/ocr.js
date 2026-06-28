function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractCourseCodesFromOcr(text = "", courses = []) {
  const source = text
    .toUpperCase()
    .replace(/[\u00a0\u200B-\u200D\uFEFF]/g, " ")
    .replace(/[‐‑‒–—]/g, "-");
  const found = [];
  const availableCodes = new Set(courses.map((course) => course.courseCode.toUpperCase()));

  let lineOffset = 0;
  source.split(/\r?\n/).forEach((line) => {
    const baseMatch = line.match(/\b([A-Z]{2,6})\s*(\d{2,4})\b/);
    const sectionMatch = line.match(/\bSEC(?:TION)?\s*[:#.-]?\s*(\d{1,3})\b/i);

    if (baseMatch && sectionMatch) {
      const code = `${baseMatch[1]}${baseMatch[2]}.${sectionMatch[1]}`;
      if (availableCodes.has(code)) found.push({ code, index: lineOffset + baseMatch.index });
    }
    lineOffset += line.length + 1;
  });

  const baseColumn = [...source.matchAll(/\b([A-Z]{2,6})\s*(\d{2,4})\s*:/g)];
  const sectionColumn = [...source.matchAll(/\bSEC(?:TION)?\s*[:#.-]?\s*(\d{1,3})\b/gi)];
  if (baseColumn.length > 0 && baseColumn.length === sectionColumn.length) {
    baseColumn.forEach((baseMatch, index) => {
      const code = `${baseMatch[1]}${baseMatch[2]}.${sectionColumn[index][1]}`;
      if (availableCodes.has(code)) found.push({ code, index: baseMatch.index });
    });
  }

  courses.forEach((course) => {
    const code = course.courseCode.toUpperCase();
    const match = code.match(/^([A-Z-]+)(\d{2,4})\.(\d+)$/);
    if (!match) return;

    const [, prefix, number, section] = match;
    const pattern = new RegExp(
      `\\b${escapeRegExp(prefix)}\\s*${escapeRegExp(number)}\\s*[.,:]\\s*${escapeRegExp(section)}\\b`,
      "i",
    );
    const result = pattern.exec(source);
    if (result) found.push({ code, index: result.index });
  });

  const earliestMatches = new Map();
  found.forEach((item) => {
    const current = earliestMatches.get(item.code);
    if (!current || item.index < current.index) earliestMatches.set(item.code, item);
  });

  return [...earliestMatches.values()]
    .sort((left, right) => left.index - right.index)
    .map((item) => item.code);
}
