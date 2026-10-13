import Image from "next/image";
import { currentEdition } from "@/lib/edition";
import { RetreatFilm } from "./RetreatFilm";
import { RetreatWaves } from "./RetreatWaves";
import { RetreatReadMore } from "./RetreatReadMore";
import { retreatStudyContour } from "@/lib/retreat-shape";
import { RetreatSurface } from "./RetreatSurface";

export function RetreatSection() {
  return (
    <RetreatSurface>
      <div
        aria-hidden="true"
        className="retreat-watermark"
        style={{ backgroundImage: `url(${currentEdition.assets.elohimsLogo})` }}
      />
      <div className="retreat-inner">
        <div className="retreat-editorial">
          <div className="retreat-story">
            <p className="retreat-eyebrow">02 / THE RETREAT</p>
            <h2 id="retreat-heading" className="retreat-heading">
              <span>Not just an audience.</span>
              <span>A gathering around the <em>Word.</em></span>
            </h2>
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
            <RetreatReadMore />
          </div>

          <figure className="retreat-photography">
            <svg width="0" height="0" aria-hidden="true" focusable="false" className="retreat-shape-definition">
              <defs>
                <clipPath id="retreat-study-silhouette" clipPathUnits="objectBoundingBox">
                  <path d={retreatStudyContour} />
                </clipPath>
              </defs>
            </svg>
            <div className="retreat-photo-pair">
              <div className="retreat-study-shot">
                <RetreatWaves shape="study" />
                <div className="retreat-study-image">
                  <Image
                    src={currentEdition.assets.retreatStudy}
                    alt="Retreat participants seated together around tables with open Bibles."
                    fill
                    sizes="(min-width: 1024px) 340px, (min-width: 768px) 460px, calc(100vw - 48px)"
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
    </RetreatSurface>
  );
}
