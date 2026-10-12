export const currentEdition = {
  ministryName: "Elohim's Bible Study Retreat",
  shortName: "EBSR",
  editionName: "DIG",
  themeName: "Death Is Gain",
  year: "2026",
  dates: "16–20 December 2026",
  location: "Lagos, Nigeria",
  scriptureAnchor: "Philippians 1:21",
  registrationHref: "/register",
  registrationNote: "Registration is free.",
  assets: {
    heroBackground: "/assets/hero-background.png",
    digLogo: "/assets/dig-logo.png",
    elohimsLogo: "/assets/elohims-logo.png",
    poster: null,
  },
  navItems: [
    { label: "The Retreat", href: "#retreat" },
    { label: "The Experience", href: "#experience" },
    { label: "The Theme", href: "#theme" },
    { label: "FAQs", href: "#faqs" },
  ],
  previousEdition: {
    name: "The NOW",
    year: "2025",
    theme: "Deliverance from Falsehood",
  },
} as const;

export type EditionConfig = typeof currentEdition;
