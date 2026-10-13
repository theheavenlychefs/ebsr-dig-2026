import { currentEdition } from "@/lib/edition";

export function RetreatSection() {
  return (
    <section id="retreat" className="retreat-section" aria-labelledby="retreat-heading">
      <div className="retreat-inner">
        <p className="retreat-eyebrow">02 / THE RETREAT</p>
        <div className="retreat-editorial">
          <div className="retreat-story">
            <h2 id="retreat-heading" className="retreat-heading">
              <span>Not just an audience.</span>
              <span>A gathering around the Word.</span>
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
          </div>

          <figure className="retreat-photography">
            <video
              className="retreat-film"
              width={464}
              height={832}
              controls
              playsInline
              preload="none"
              poster={currentEdition.assets.retreatFilmPoster}
              src={currentEdition.assets.retreatFilm}
              aria-label="Elohim's Bible Study Retreat film, fellowship and Bible study"
            >
              <a href={currentEdition.assets.retreatFilm}>Watch the retreat film</a>
            </video>
            <figcaption>Elohim&apos;s Bible Study Retreat</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
