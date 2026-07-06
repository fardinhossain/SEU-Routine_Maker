const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://seuroutine.vercel.app").replace(/\/$/, "");
const host = new URL(siteUrl).host;
const indexNowKey = "7e4d2c0a9b8f4e6db1a3c5f0e2d9a718";
const urls = [
  "/",
  "/about",
  "/faq",
  "/organizer",
  "/sitemap.xml",
].map((path) => `${siteUrl}${path}`);

const response = await fetch("https://www.bing.com/indexnow", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify({
    host,
    key: indexNowKey,
    keyLocation: `${siteUrl}/${indexNowKey}.txt`,
    urlList: urls,
  }),
});

const body = await response.text();
console.log(`IndexNow status: ${response.status}`);
console.log(body || "Submitted URLs to Bing/IndexNow.");

if (!response.ok && response.status !== 202) {
  process.exitCode = 1;
}
