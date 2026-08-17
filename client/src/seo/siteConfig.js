/* ============================================
   SITE CONFIG — one place for the domain
   --------------------------------------------
   Change the domain here (or set VITE_SITE_URL)
   and canonical tags, sitemap, structured data
   and social previews all follow.
   ============================================ */

const RAW_SITE =
  import.meta.env.VITE_SITE_URL || "https://munchhbox.com";

/* No trailing slash, so we never build a double // */
export const SITE_URL = RAW_SITE.replace(/\/+$/, "");

export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/* ============================================
   PER-PAGE SEO
   --------------------------------------------
   Keep titles under ~60 characters and
   descriptions between 120 and 160 so Google
   does not truncate them.
   ============================================ */

export const PAGE_SEO = {
  home: {
    path: "/",
    title: "Munch Box Okara | Zinger Burgers, Loaded Fries & Wings",
    description:
      "Munch Box serves fresh zinger burgers, loaded fries, wings and wraps in Okara. Dine in, takeaway or home delivery. Chungi No. 7, near PSO Petrol Pump.",
  },
  burgers: {
    path: "/burgers",
    title: "Burgers in Okara | Zinger & Jumbo | Munch Box",
    description:
      "Crispy zinger burgers, jumbo burgers and zinger shawarma, fried fresh to order at Munch Box Okara. Order now or call for home delivery.",
  },
  fries: {
    path: "/fries",
    title: "Loaded Fries & Crispy Fries in Okara | Munch Box",
    description:
      "Golden crispy fries, large boxes, sharing buckets and cheese loaded fries at Munch Box Okara. Fresh from the fryer, delivered hot.",
  },
  wraps: {
    path: "/wraps",
    title: "Wraps, Wings, Nuggets & Broast | Munch Box Okara",
    description:
      "Chicken wraps, tender strips, nuggets, hot wings and chicken with chips at Munch Box Okara. Made fresh when you order.",
  },
  dips: {
    path: "/dips",
    title: "Sauces & Dips | BBQ, Ranch, Garlic | Munch Box Okara",
    description:
      "BBQ, ranch, garlic, chilli and mayo dips to go with your burgers and fries at Munch Box Okara.",
  },
  drinks: {
    path: "/drinks",
    title: "Chilled Drinks | Coke, Sting, Next Cola | Munch Box",
    description:
      "Ice cold Coke, Next Cola and Sting, from regular bottles to family size, at Munch Box Okara.",
  },
  cart: {
    path: "/cart",
    title: "Your Cart | Munch Box Okara",
    description:
      "Review your Munch Box order before checkout.",
    noindex: true,
  },
  order: {
    path: "/order",
    title: "Checkout | Munch Box Okara",
    description:
      "Complete your Munch Box order for delivery in Okara.",
    noindex: true,
  },
  adminlogin: {
    path: "/adminlogin",
    title: "Staff Login | Munch Box",
    description: "Munch Box staff area.",
    noindex: true,
  },
  admin: {
    path: "/admin",
    title: "Dashboard | Munch Box",
    description: "Munch Box staff area.",
    noindex: true,
  },
};

/* Only the pages that should appear in search */
export const INDEXABLE_PAGES = Object.values(PAGE_SEO).filter(
  (page) => !page.noindex
);
