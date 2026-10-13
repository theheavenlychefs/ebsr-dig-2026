import Image from "next/image";
import { currentEdition } from "@/lib/edition";
import { RetreatFilm } from "./RetreatFilm";
import { RetreatWaves } from "./RetreatWaves";

export function RetreatSection() {
  return (
    <section id="retreat" className="retreat-section" aria-labelledby="retreat-heading">
      <div
        aria-hidden="true"
        className="retreat-watermark"
        style={{ backgroundImage: `url(${currentEdition.assets.elohimsLogo})` }}
      />
      <div className="retreat-inner">
        <p className="retreat-eyebrow">02 / THE RETREAT</p>
        <h2 id="retreat-heading" className="retreat-heading">
          <span>Not just an audience.</span>
          <span>A gathering around the <em>Word.</em></span>
        </h2>
        <div className="retreat-editorial">
          <div className="retreat-story">
            <div className="retreat-copy">
              <p>
                Elohim&apos;s Bible Study Retreat was born from a burden to create
                something beyond the familiar gathering where one person speaks
                and everyone else listens.
              </p>
              <p>
                A space where the Scriptures are opened, questions are welcomed,
                perspectives are examined, and <strong>everyone has room to contribute.</strong>
              </p>
              <p>
                Through moderated discussions, worship, prayer, and shared
                fellowship, we gather not merely to listen, but to <em>search the Word together.</em>
              </p>
            </div>
          </div>

          <figure className="retreat-photography">
            <svg width="0" height="0" aria-hidden="true" focusable="false" className="retreat-shape-definition">
              <defs>
                <clipPath id="retreat-study-silhouette" clipPathUnits="objectBoundingBox">
                  <path d="M .018 .52 C .042 .23 .27 .015 .56 .012 C .81 .008 .98 .16 .986 .39 C 1 .66 .86 .89 .63 .955 C .44 1 .27 .93 .254 .76 C .247 .681 .21 .651 .12 .648 C .035 .645 .004 .611 .018 .52 Z" />
                </clipPath>
              </defs>
            </svg>
            <div className="retreat-photo-pair">
              <div className="retreat-study-shot">
                <RetreatWaves />
                <div className="retreat-study-image">
                  <Image
                    src={currentEdition.assets.retreatStudy}
                    alt="Retreat participants seated together around tables with open Bibles."
                    fill
                    sizes="(min-width: 768px) 460px, calc(100vw - 48px)"
                    className="object-cover object-center"
                  />
                </div>
              </div>
              <RetreatFilm />
            </div>
            <figcaption>
              <span>Elohim&apos;s Bible Study Retreat</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
