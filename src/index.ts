// ============================================================
// DARA UI - Main Entry Point
// ============================================================

// ----- Components -----
export { Button } from "./components/Button/Button";
export type { ButtonProps } from "./components/Button/Button";

export { Badge } from "./components/Badge/Badge";
export type { BadgeProps } from "./components/Badge/Badge";

export { Input } from "./components/Input/Input";
export type { InputProps } from "./components/Input/Input";

export { Card } from "./components/Card/Card";
export type { CardProps } from "./components/Card/Card";

export { Tabs } from "./components/Tabs/Tabs";
export type { TabsProps, TabItem } from "./components/Tabs/Tabs";

export { Accordion } from "./components/Accordion/Accordion";
export type {
  AccordionProps,
  AccordionItem,
} from "./components/Accordion/Accordion";

export { Dropdown } from "./components/Dropdown/Dropdown";
export type {
  DropdownProps,
  DropdownOption,
} from "./components/Dropdown/Dropdown";

// ----- Hooks -----
export { default as useDirection } from "./hooks/useDirection";
export type { Direction } from "./hooks/useDirection";

// ----- Metadata -----
export const version = "0.1.0";

// ----- Styles -----
import "./styles/index.css";
