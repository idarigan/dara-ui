// ============================================================
// DARA UI - Main Entry Point
// ============================================================

// ----- Components -----
export { Button } from "./components/Button/Button";
export type { ButtonProps } from "./components/Button/Button";

// ----- Hooks -----
export { default as useDirection } from "./hooks/useDirection";
export type { Direction } from "./hooks/useDirection";

// ----- Metadata -----
export const version = "0.1.0";

// ----- Styles -----
import "./styles/index.css";
