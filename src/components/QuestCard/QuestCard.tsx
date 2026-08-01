// src/components/QuestCard/QuestCard.tsx

import React, { useState, useRef } from "react";
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
 * - Completion modal with sparkle drop effect
 * - Theme-aware colors
 * - 3D tilt effect on hover
 * - Smooth animated glow transitions
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
  const [showSparkles, setShowSparkles] = useState(false);

  // 3D tilt state
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledDone !== undefined;
  const completed = isControlled ? controlledDone : isDone;

  // Handle 3D tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  // Format deadline with smart display
  const getDeadlineDisplay = (): string => {
    if (!deadline) return "";

    const now = new Date();
    const deadlineDate = new Date(deadline);

    const lowerDeadline = deadline.toLowerCase();
    if (lowerDeadline === "tomorrow") {
      return "⏰ Deadline: Tomorrow";
    }
    if (lowerDeadline === "tonight") {
      return "⏰ Deadline: Tonight";
    }

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

  const handleCardClick = () => {
    if (!completed) {
      setShowModal(true);
    }
  };

  const handleConfirmComplete = () => {
    setShowModal(false);
    if (!isControlled) {
      setIsDone(true);
    }
    onComplete?.();

    // Trigger sparkle drop effect
    setShowSparkles(true);
    setTimeout(() => {
      setShowSparkles(false);
    }, 1500);
  };

  const glowStyles = {
    purple: "glow-purple",
    cyan: "glow-cyan",
    pink: "glow-pink",
    none: "",
  };

  const glowClass = glowStyles[glow] || "";

  // Generate random sparkle drops
  const generateSparkles = () => {
    const sparkles = [];
    const colors = [
      "#ffd700",
      "#ff6b35",
      "#ff4d9d",
      "#7c5cff",
      "#00d9ff",
      "#00ff99",
      "#ffffff",
    ];
    const total = 20;

    for (let i = 0; i < total; i++) {
      const angle = Math.random() * 360;
      const distance = 40 + Math.random() * 120;
      const size = 3 + Math.random() * 5;
      const delay = Math.random() * 0.3;
      const duration = 0.6 + Math.random() * 0.6;
      const color = colors[Math.floor(Math.random() * colors.length)];

      sparkles.push(
        <div
          key={i}
          className="sparkle-drop"
          style={
            {
              left: `${30 + Math.random() * 40}%`,
              top: `${30 + Math.random() * 40}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              boxShadow: `0 0 ${size * 2}px ${color}`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              "--tx": `${Math.cos((angle * Math.PI) / 180) * distance}px`,
              "--ty": `${Math.sin((angle * Math.PI) / 180) * distance}px`,
            } as React.CSSProperties
          }
        />,
      );
    }
    return sparkles;
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`
          glass p-6 float-card cursor-pointer relative
          h-full flex flex-col
          ${glowClass}
          ${completed ? "opacity-60 pointer-events-none" : ""}
          transition-all duration-300
          ${className}
        `}
        style={{
          transform: isHovering
            ? `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`
            : "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
          transformStyle: "preserve-3d",
          transition: "transform 0.2s ease-out",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`Quest: ${title}`}
      >
        {/* Sparkle Drop Effect */}
        {showSparkles && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-10">
            {generateSparkles()}
          </div>
        )}

        {/* Mission Label */}
        <p
          className="font-mono text-xs text-[var(--color-cyan)] uppercase tracking-wider mb-3"
          style={{ transform: "translateZ(20px)" }}
        >
          🗡️ MISSION
        </p>

        {/* Title */}
        <h4
          className="font-heading text-xl font-bold mb-2 text-[var(--color-text-primary)]"
          style={{ transform: "translateZ(25px)" }}
        >
          {title}
        </h4>

        {/* Description */}
        <p
          className="text-[var(--color-text-secondary)] text-sm mb-3 flex-grow"
          style={{ transform: "translateZ(15px)" }}
        >
          {description}
        </p>

        {/* XP and Deadline */}
        <div
          className="flex items-center gap-4 flex-wrap"
          style={{ transform: "translateZ(10px)" }}
        >
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
          <div
            className="mt-3 pt-3 border-t border-[var(--color-border-secondary)]"
            style={{ transform: "translateZ(5px)" }}
          >
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
          <div
            className="absolute top-4 right-4"
            style={{ transform: "translateZ(30px)" }}
          >
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[var(--radius-standard)] backdrop-blur-sm z-20">
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

      {/* Sparkle drop styles */}
      <style>{`
        .sparkle-drop {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: sparkleDrop 0.8s ease-out forwards;
          z-index: 30;
        }

        @keyframes sparkleDrop {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

QuestCard.displayName = "QuestCard";
export default QuestCard;
