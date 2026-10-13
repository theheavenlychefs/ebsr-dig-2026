import { BookOpen, HandHeart, Music2, UsersRound } from "lucide-react";

const pillars = [
  { title: "Scripture & Discussion", eyebrow: "01 / The Word", Icon: BookOpen, tone: "word" },
  { title: "Worship", eyebrow: "02 / Shared praise", Icon: Music2, tone: "worship" },
  { title: "Prayer", eyebrow: "03 / Seek together", Icon: HandHeart, tone: "prayer" },
  { title: "Fellowship", eyebrow: "04 / Shared life", Icon: UsersRound, tone: "fellowship" },
];

export function RetreatPillars() {
  return (
    <ul className="retreat-pillars" aria-label="What the retreat stands for">
      {pillars.map(({ title, eyebrow, Icon, tone }) => (
        <li key={title} className={`retreat-pillar retreat-pillar-${tone}`}>
          <span className="retreat-pillar-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.6} /></span>
          <div className="retreat-pillar-copy">
            <p className="retreat-pillar-eyebrow">{eyebrow}</p>
            <p className="retreat-pillar-title">{title}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
