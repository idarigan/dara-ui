import React from "react";
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

  return (
    <div
      className={`fixed z-[45] ${className}`}
      style={{
        bottom: "max(24px, env(safe-area-inset-bottom))",
        [side]: 24,
      }}
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
