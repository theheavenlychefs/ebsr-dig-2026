import { currentEdition } from "./edition";

type ExperienceMedia =
  | { kind: "image"; src: string; alt: string; position?: string }
  | { kind: "video"; src: string; poster: string; alt: string; aspectRatio: number }
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
    media: { kind: "video", src: currentEdition.assets.experienceWord, poster: currentEdition.assets.experienceWordPoster, alt: "Retreat participants contributing to a discussion around open Scriptures.", aspectRatio: 360 / 640 },
  },
  {
    name: "Fellowship",
    title: "Life beyond the sessions.",
    body: "Conversations, shared meals, friendships, and everyday moments together.",
    media: { kind: "video", src: currentEdition.assets.experienceFellowship, poster: currentEdition.assets.experienceFellowshipPoster, alt: "Retreat participants sharing greetings, smiles, and fist bumps.", aspectRatio: 540 / 948 },
  },
  {
    name: "Memories",
    title: "Moments worth keeping.",
    body: "Photographs, laughter, and experiences that remain long after the retreat.",
    media: { kind: "video", src: currentEdition.assets.experienceMemories, poster: currentEdition.assets.experienceMemoriesPoster, alt: "Participants joining a shared activity and reacting together at the retreat.", aspectRatio: 1 },
  },
];
