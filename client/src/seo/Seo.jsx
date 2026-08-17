import { useEffect } from "react";

import {
  SITE_URL,
  OG_IMAGE,
  PAGE_SEO
} from "./siteConfig";

/* ============================================
   Seo
   --------------------------------------------
   Sets the title, description, canonical link
   and social tags for the page it is rendered on.

   The build step also bakes these same values
   into a static HTML file per route, so bots that
   do not run JavaScript still read them. This
   component keeps them correct while the user
   navigates around the SPA.
   ============================================ */

const setMeta = (selector, attr, value) => {
  if (!value) return;

  let el = document.head.querySelector(selector);

  if (!el) {
    el = document.createElement("meta");

    const [, kind, name] =
      selector.match(/\[(property|name)="([^"]+)"\]/) || [];

    if (kind && name) el.setAttribute(kind, name);

    document.head.appendChild(el);
  }

  el.setAttribute(attr, value);
};

const setLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`);

  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }

  el.setAttribute("href", href);
};

const Seo = ({ page, title, description }) => {

  const preset = PAGE_SEO[page] || {};

  const finalTitle = title || preset.title;
  const finalDescription = description || preset.description;
  const path = preset.path || "/";
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;
  const noindex = Boolean(preset.noindex);

  useEffect(() => {

    if (finalTitle) document.title = finalTitle;

    setMeta('meta[name="description"]', "content", finalDescription);

    /* Keep private pages out of search results */
    setMeta(
      'meta[name="robots"]',
      "content",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large"
    );

    setLink("canonical", canonical);

    /* Open Graph — WhatsApp, Facebook */
    setMeta('meta[property="og:title"]', "content", finalTitle);
    setMeta('meta[property="og:description"]', "content", finalDescription);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:image"]', "content", OG_IMAGE);
    setMeta('meta[property="og:type"]', "content", "website");

    /* Twitter / X */
    setMeta('meta[name="twitter:title"]', "content", finalTitle);
    setMeta('meta[name="twitter:description"]', "content", finalDescription);
    setMeta('meta[name="twitter:image"]', "content", OG_IMAGE);

  }, [finalTitle, finalDescription, canonical, noindex]);

  return null;

};

export default Seo;
