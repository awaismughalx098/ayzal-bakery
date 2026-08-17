/* ============================================
   MUNCH BOX — MENU DATA
   Single source of truth for the whole site.
   Add items or change prices here only.
   ============================================ */

/* BRAND */

export const BRAND = {
  name: "MUNCH BOX",
  nameTop: "MUNCH",
  nameBottom: "BOX",
  tagline: "Bite • Enjoy • Repeat",
  phone: "+92 307 8950521",
  phoneDial: "+923078950521",
  whatsapp: "923078950521",
  address: "Chungi No. 7, Near PSO Petrol Pump, Okara",
  addressShort: "Chungi No. 7, Okara",
  timing: "Daily  12:00 PM – 02:00 AM",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
};

/* CATEGORIES */

export const CATEGORIES = [
  {
    slug: "burgers",
    path: "/burgers",
    name: "Burgers",
    label: "Signature Burgers",
    blurb: "Crispy zinger fillets stacked the way you like",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "fries",
    path: "/fries",
    name: "Fries",
    label: "Fries & Loaded Fries",
    blurb: "Regular, large, bucket — or loaded with sauce",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "wraps",
    path: "/wraps",
    name: "Wraps & More",
    label: "Wraps, Wings & Chicken",
    blurb: "Wraps, strips, nuggets, wings and chicken chips",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "dips",
    path: "/dips",
    name: "Dips",
    label: "Sauces & Dips",
    blurb: "Five sauces, flat Rs 50 each",
    /* Small add-on items: shown as a compact price
       list instead of photo cards, so no image is
       needed for each sauce. */
    compact: true,
    image:
      "https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "drinks",
    path: "/drinks",
    name: "Drinks",
    label: "Chilled Drinks",
    blurb: "Coke, Next Cola and Sting — bottles to family size",
    compact: true,
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=1200&auto=format&fit=crop",
  },
];

/* HELPERS */

export const getCategory = (slug) =>
  CATEGORIES.find((c) => c.slug === slug);

/* Used by the admin category dropdown */
export const CATEGORY_OPTIONS = CATEGORIES.map(({ slug, name }) => ({
  value: slug,
  label: name,
}));
