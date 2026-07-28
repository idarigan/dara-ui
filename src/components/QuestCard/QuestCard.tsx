import React, { useState } from "react";
import { Modal } from "../Modal/Modal";

export interface QuestCardProps {
  /**
   * Quest title
   */
  title: string;
  /**
   * Quest description
   */
  description: string;
  /**
   * XP reward value
   * @default 0
   */
  xp?: number;
  /**
   * Custom label for XP (e.g., "EXP", "Points", "Score")
   * @default "XP"
   */
  xpLabel?: string;
  /**
   * Deadline date string (e.g., "2024-12-25", "tomorrow", "tonight")
   */
  deadline?: string;
  /**
   * Rank label (e.g., "S", "A", "B")
   */
  rank?: string;
  /**
   * Array of requirement strings
   */
  requirements?: string[];
  /**
   * Glow variant color
   * @default "none"
   */
  glow?: "purple" | "cyan" | "pink" | "none";
  /**
   * Optional done state (controlled)
   */
  done?: boolean;
  /**
   * Callback when quest is completed
   */
  onComplete?: () => void;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI QuestCard - RPG-style mission/quest card
 *
 * Features:
 * - Title, description, XP reward, deadline, rank
 * - Glow variants (purple, cyan, pink)
 * - Smart deadline display (tomorrow, tonight, X days)
 * - Requirements list
 * - Completion modal with dust animation effect
 * - Theme-aware colors
 */
export const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  xp = 0,
  xpLabel = "XP",
  deadline,
  rank,
  requirements = [],
  glow = "none",
  done: controlledDone,
  onComplete,
  className = "",
}) => {
  const [isDone, setIsDone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDusting, setIsDusting] = useState(false);

  const isControlled = controlledDone !== undefined;
  const completed = isControlled ? controlledDone : isDone;

  // Format deadline with smart display
  const getDeadlineDisplay = (): string => {
    if (!deadline) return "";

    const now = new Date();
    const deadlineDate = new Date(deadline);

    // Check if it's a special keyword
    const lowerDeadline = deadline.toLowerCase();
    if (lowerDeadline === "tomorrow") {
      return "⏰ Deadline: Tomorrow";
    }
    if (lowerDeadline === "tonight") {
      return "⏰ Deadline: Tonight";
    }

    // Check if it's a valid date
    if (isNaN(deadlineDate.getTime())) {
      return `⏰ ${deadline}`;
    }

    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "⏰ Deadline: Today";
    if (diffDays === 1) return "⏰ Deadline: Tomorrow";
    if (diffDays === -1) return "⏰ Deadline: Yesterday";
    if (diffDays < 0) return `⏰ ${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `⏰ Deadline: ${diffDays} days`;
    if (diffDays < 14) return "⏰ Deadline: 1 week";
    if (diffDays < 30) return `⏰ Deadline: ${Math.floor(diffDays / 7)} weeks`;
    if (diffDays < 60) return "⏰ Deadline: 1 month";
    if (diffDays < 365)
      return `⏰ Deadline: ${Math.floor(diffDays / 30)} months`;
    return `⏰ Deadline: ${Math.floor(diffDays / 365)} years`;
  };

  // Get rank color
  const getRankColor = (): string => {
    if (!rank) return "";
    const upperRank = rank.toUpperCase();
    if (upperRank === "S" || upperRank === "S+")
      return "text-[var(--color-cyan)]";
    if (upperRank === "A" || upperRank === "A+")
      return "text-[var(--color-primary)]";
    if (upperRank === "B" || upperRank === "B+")
      return "text-[var(--color-accent)]";
    if (upperRank === "C" || upperRank === "C+")
      return "text-[var(--color-warning)]";
    return "text-[var(--color-text-secondary)]";
  };

  // Handle card click to start completion flow
  const handleCardClick = () => {
    if (!completed) {
      setShowModal(true);
    }
  };

  // Handle confirm completion
  const handleConfirmComplete = () => {
    setShowModal(false);
    if (!isControlled) {
      setIsDone(true);
    }
    onComplete?.();

    // Start dust animation
    setIsDusting(true);
    setTimeout(() => {
      setIsDusting(false);
    }, 1000);
  };

  // Glow styles
  const glowStyles = {
    purple: "glow-purple",
    cyan: "glow-cyan",
    pink: "glow-pink",
    none: "",
  };

  const glowClass = glowStyles[glow] || "";

  return (
    <>
      <div
        className={`
          glass p-6 float-card cursor-pointer
          ${glowClass}
          ${completed ? "opacity-60 pointer-events-none" : ""}
          ${isDusting ? "animate-dust" : ""}
          transition-all duration-500
          ${className}
        `}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`Quest: ${title}`}
      >
        {/* Mission Label */}
        <p className="font-mono text-xs text-[var(--color-cyan)] uppercase tracking-wider mb-3">
          🗡️ MISSION
        </p>

        {/* Title */}
        <h4 className="font-heading text-xl font-bold mb-2 text-[var(--color-text-primary)]">
          {title}
        </h4>

        {/* Description */}
        <p className="text-[var(--color-text-secondary)] text-sm mb-3">
          {description}
        </p>

        {/* XP and Deadline */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-accent text-sm text-[var(--color-success)]">
            +{xp} {xpLabel}
          </span>
          {deadline && (
            <span className="font-mono text-xs text-[var(--color-danger)]">
              {getDeadlineDisplay()}
            </span>
          )}
        </div>

        {/* Requirements */}
        {requirements.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--color-border-secondary)]">
            <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-1.5">
              Requirements:
            </p>
            <ul className="space-y-1">
              {requirements.map((req, index) => (
                <li
                  key={index}
                  className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5"
                >
                  <span className="text-[var(--color-primary)]">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rank Badge */}
        {rank && (
          <div className="absolute top-4 right-4">
            <span
              className={`
                font-accent text-xs font-bold tracking-wider
                px-2.5 py-1 rounded-full
                bg-[var(--color-bg-tertiary)]/50
                border border-[var(--color-border-primary)]
                ${getRankColor()}
              `}
            >
              {rank.toUpperCase()}
            </span>
          </div>
        )}

        {/* Done overlay */}
        {completed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[var(--radius-standard)] backdrop-blur-sm">
            <span className="font-heading text-2xl font-bold text-[var(--color-success)]">
              ✓ COMPLETE
            </span>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="🗡️ Complete Mission"
        confirmText="✔️ Complete"
        cancelText="Cancel"
        onConfirm={handleConfirmComplete}
      >
        <p className="text-[var(--color-text-secondary)] mb-2">
          Are you sure you want to complete the mission:
        </p>
        <p className="font-heading font-bold text-lg text-[var(--color-text-primary)] mb-3">
          "{title}"
        </p>
        <p className="text-[var(--color-text-secondary)] text-sm">
          You will earn{" "}
          <span className="text-[var(--color-success)] font-bold">
            +{xp} {xpLabel}
          </span>{" "}
          upon completion.
        </p>
        {requirements.length > 0 && (
          <div className="mt-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)]">
            <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-1">
              Requirements:
            </p>
            <ul className="space-y-1">
              {requirements.map((req, index) => (
                <li
                  key={index}
                  className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5"
                >
                  <span className="text-[var(--color-success)]">✓</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      {/* Dust animation styles */}
      <style>{`
        @keyframes dustOut {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          30% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          60% {
            transform: scale(0.8) rotate(-2deg);
            opacity: 0.6;
          }
          100% {
            transform: scale(0.3) rotate(5deg) translateY(-20px);
            opacity: 0;
          }
        }

        .animate-dust {
          animation: dustOut 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
};

QuestCard.displayName = "QuestCard";
export default QuestCard;
