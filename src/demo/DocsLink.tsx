import React, { useEffect, useState } from "react";
import { Button, DocsIcon, useI18n } from "../index";

// ============================================
// DOCS LINK
// ============================================

interface DocsLinkProps {
  href: string;
  className?: string;
}

export const DocsLink: React.FC<DocsLinkProps> = ({ href, className = "" }) => {
  const { t, dir } = useI18n();
  const side = dir === "rtl" ? "right" : "left";
  const [visible, setVisible] = useState(true);

  // Fade out near the page bottom
  useEffect(() => {
    const update = () => {
      const distance =
        document.documentElement.scrollHeight -
        (window.innerHeight + window.scrollY);
      setVisible(distance > 160);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className={`
        fixed z-[45]
        transition-all duration-300 ease-[var(--ease-in-out)]
        ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}
        ${className}
      `}
      style={{
        bottom: "max(24px, env(safe-area-inset-bottom))",
        [side]: 24,
      }}
      inert={!visible}
    >
      <Button
        as="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        variant="glass"
        size="sm"
        glow="primary"
        leftIcon={<DocsIcon className="h-4 w-4" />}
      >
        {t("demoControls.docs")}
      </Button>
    </div>
  );
};

DocsLink.displayName = "DocsLink";
export default DocsLink;
