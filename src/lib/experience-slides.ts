import { currentEdition } from "./edition";

type ExperienceMedia =
  | { kind: "image"; src: string; alt: string; position?: string }
  | { kind: "video"; src: string; poster: string; alt: string }
  | { kind: "pending"; label: string };

export type ExperienceSlide = {
  name: string;
  title: string;
  body: string;
  media: ExperienceMedia;
};

export const experienceSlides: ExperienceSlide[] = [
  {
    name: "The Word",
    title: "Every voice has a place.",
    body: "We open the Scriptures, ask questions, share understanding, and search the Word together.",
    media: { kind: "image", src: currentEdition.assets.retreatStudy, alt: "EBSR participants seated around tables with open Bibles.", position: "center 30%" },
  },
  {
    name: "Worship",
    title: "More than a song.",
    body: "Voices joined in worship, not as spectators, but as one gathering.",
    media: { kind: "pending", label: "Worship image to follow" },
  },
  {
    name: "Prayer",
    title: "Hearts gathered in prayer.",
    body: "Intentional moments of seeking God together.",
    media: { kind: "pending", label: "Prayer image to follow" },
  },
  {
    name: "Fellowship",
    title: "Life beyond the sessions.",
    body: "Conversations, shared meals, friendships, and everyday moments together.",
    media: { kind: "video", src: currentEdition.assets.retreatFilm, poster: currentEdition.assets.retreatFilmPoster, alt: "Genuine moments of shared life from the EBSR retreat film." },
  },
  {
    name: "Memories",
    title: "Moments worth keeping.",
    body: "Photographs, laughter, and experiences that remain long after the retreat.",
    media: { kind: "image", src: currentEdition.assets.experienceMemories, alt: "Retreat participants gathered for a group photograph.", position: "center 42%" },
  },
];
