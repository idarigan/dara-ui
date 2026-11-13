import type { CSSProperties } from "react";

// ============================================
// BACKGROUND LAYER
// ============================================

export const backgroundLayerStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  overflow: "hidden",
  contain: "size layout paint",
  pointerEvents: "none",
};

export const backgroundCanvasStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "block",
};
