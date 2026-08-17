/* ============================================
   POST-BUILD
   --------------------------------------------
   Runs after `vite build` and does three things:

   1. writes robots.txt
   2. writes sitemap.xml
   3. emits a static HTML file per route, with that
      page's own <title>, description, canonical and
      social tags already in the markup

   Step 3 matters because this is a client-rendered
   SPA. Google can run JavaScript, but WhatsApp and
   Facebook link previews cannot — they read the raw
   HTML. Without this every shared link would show
   the home page title.
   ============================================ */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DIST = path.join(__dirname, "..", "dist");

const SITE_URL = (
  process.env.VITE_SITE_URL || "https://munchhbox.com"
).replace(/\/+$/, "");

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/* Kept in step with src/seo/siteConfig.js */
const PAGES = [
  {
    path: "/",
    priority: "1.0",
    changefreq: "weekly",
    title: "Munch Box Okara | Zinger Burgers, Loaded Fries & Wings",
    description:
      "Munch Box serves fresh zinger burgers, loaded fries, wings and wraps in Okara. Dine in, takeaway or home delivery. Chungi No. 7, near PSO Petrol Pump.",
  },
  {
    path: "/burgers",
    priority: "0.9",
    changefreq: "weekly",
    title: "Burgers in Okara | Zinger & Jumbo | Munch Box",
    description:
      "Crispy zinger burgers, jumbo burgers and zinger shawarma, fried fresh to order at Munch Box Okara. Order now or call for home delivery.",
  },
  {
    path: "/fries",
    priority: "0.8",
    changefreq: "weekly",
    title: "Loaded Fries & Crispy Fries in Okara | Munch Box",
    description:
      "Golden crispy fries, large boxes, sharing buckets and cheese loaded fries at Munch Box Okara. Fresh from the fryer, delivered hot.",
  },
  {
    path: "/wraps",
    priority: "0.8",
    changefreq: "weekly",
    title: "Wraps, Wings, Nuggets & Broast | Munch Box Okara",
    description:
      "Chicken wraps, tender strips, nuggets, hot wings and chicken with chips at Munch Box Okara. Made fresh when you order.",
  },
  {
    path: "/dips",
    priority: "0.6",
    changefreq: "monthly",
    title: "Sauces & Dips | BBQ, Ranch, Garlic | Munch Box Okara",
    description:
      "BBQ, ranch, garlic, chilli and mayo dips to go with your burgers and fries at Munch Box Okara.",
  },
  {
    path: "/drinks",
    priority: "0.6",
    changefreq: "monthly",
    title: "Chilled Drinks | Coke, Sting, Next Cola | Munch Box",
    description:
      "Ice cold Coke, Next Cola and Sting, from regular bottles to family size, at Munch Box Okara.",
  },
];

/* Never indexed, but still need correct titles */
const PRIVATE_PAGES = [
  { path: "/cart", title: "Your Cart | Munch Box Okara", description: "Review your Munch Box order before checkout." },
  { path: "/order", title: "Checkout | Munch Box Okara", description: "Complete your Munch Box order for delivery in Okara." },
  { path: "/adminlogin", title: "Staff Login | Munch Box", description: "Munch Box staff area." },
  { path: "/admin", title: "Dashboard | Munch Box", description: "Munch Box staff area." },
];

const escape = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* ---------- 1. robots.txt ---------- */

const robots = `# Munch Box
User-agent: *
Allow: /

# Private areas
Disallow: /admin
Disallow: /adminlogin
Disallow: /cart
Disallow: /order

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(DIST, "robots.txt"), robots, "utf8");

/* ---------- 2. sitemap.xml ---------- */

const today = new Date().toISOString().split("T")[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
  (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
).join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap, "utf8");

/* ---------- 3. per-route HTML ---------- */

const templatePath = path.join(DIST, "index.html");
const template = fs.readFileSync(templatePath, "utf8");

const buildHtml = (page, noindex) => {
  const url = `${SITE_URL}${page.path}`;
  const title = escape(page.title);
  const description = escape(page.description);

  let html = template;

  /* <title> */
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${title}</title>`
  );

  /* description + canonical + robots */
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${description}" />`
  );

  html = html.replace(
    /<link rel="canonical"[^>]*\/>/,
    `<link rel="canonical" href="${url}" />`
  );

  html = html.replace(
    /<meta name="robots"[^>]*\/>/,
    `<meta name="robots" content="${
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
    }" />`
  );

  /* Open Graph */
  html = html.replace(
    /<meta property="og:url"[^>]*\/>/,
    `<meta property="og:url" content="${url}" />`
  );

  html = html.replace(
    /<meta\s+property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${title}" />`
  );

  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${description}" />`
  );

  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${OG_IMAGE}" />`
  );

  /* Twitter */
  html = html.replace(
    /<meta\s+name="twitter:title"[\s\S]*?\/>/,
    `<meta name="twitter:title" content="${title}" />`
  );

  html = html.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${description}" />`
  );

  return html;
};

const written = [];

for (const page of [...PAGES, ...PRIVATE_PAGES]) {
  if (page.path === "/") {
    fs.writeFileSync(templatePath, buildHtml(page, false), "utf8");
    written.push("/");
    continue;
  }

  const noindex = PRIVATE_PAGES.includes(page);
  const dir = path.join(DIST, page.path.replace(/^\//, ""));

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "index.html"),
    buildHtml(page, noindex),
    "utf8"
  );

  written.push(page.path);
}

console.log(`\n[postbuild] site: ${SITE_URL}`);
console.log(`[postbuild] robots.txt + sitemap.xml written (${PAGES.length} indexable urls)`);
console.log(`[postbuild] static html: ${written.join(", ")}\n`);
