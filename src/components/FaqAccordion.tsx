"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Are there registration fees?",
    answer:
      "Registration is free. The retreat is planned as a shared gathering around Scripture, not a paid conference experience.",
  },
  {
    question: "Where will DIG 2026 hold?",
    answer:
      "DIG 2026 will hold in Lagos, Nigeria. Venue details will be shared through the official registration and confirmation process.",
  },
  {
    question: "What happens at the retreat?",
    answer:
      "The retreat centers on Bible study discussions, worship, prayer, fellowship, and shared moments across the five days.",
  },
  {
    question: "How will registration be confirmed?",
    answer:
      "Confirmation details will be provided after the registration page opens and the retreat team begins processing responses.",
  },
  {
    question: "Can I make a voluntary contribution?",
    answer:
      "Voluntary contributions may be received when official channels are announced. No payment is required for registration.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-[#c89a2c]/20 border-y border-[#c89a2c]/20">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ad4e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080604]"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span className="font-serif text-2xl text-[#fff3dd]">
                {faq.question}
              </span>
              <span className="grid size-9 shrink-0 place-items-center border border-[#c89a2c]/35 text-xl text-[#d6ad4e]">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              id={`faq-panel-${index}`}
              className={isOpen ? "block pb-6" : "hidden"}
            >
              <p className="max-w-3xl text-base leading-8 text-[#d8ccb7]">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
