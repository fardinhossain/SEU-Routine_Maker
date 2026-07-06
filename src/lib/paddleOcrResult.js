export function extractMarkdownFromJsonl(rawJsonl = "") {
  const pages = [];
  String(rawJsonl).split(/\r?\n/).forEach((line) => {
    if (!line.trim()) return;
    const parsed = JSON.parse(line);
    const layoutResults = parsed?.result?.layoutParsingResults || [];
    layoutResults.forEach((result) => {
      const markdown = result?.markdown?.text;
      if (typeof markdown === "string" && markdown.trim()) pages.push(markdown.trim());
    });
  });
  return pages.join("\n\n");
}
