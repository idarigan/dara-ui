// ========================================
// DARA UI - Main Entry Point
// ========================================

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

export { Modal } from "./components/Modal/Modal";
export type { ModalProps } from "./components/Modal/Modal";

// ----- Toast -----
export {
  Toast,
  ToastContainer,
  ToastProvider,
  useToast,
} from "./components/Toast";
export type { ToastProps, ToastType, ToastOptions } from "./components/Toast";

// ----- Avatar -----
export { Avatar } from "./components/Avatar/Avatar";
export type { AvatarProps } from "./components/Avatar/Avatar";

// ----- Tooltip -----
export { Tooltip } from "./components/Tooltip/Tooltip";
export type {
  TooltipProps,
  TooltipPlacement,
} from "./components/Tooltip/Tooltip";

// ----- Progress -----
export { Progress } from "./components/Progress/Progress";
export type { ProgressProps } from "./components/Progress/Progress";

// ----- Theme & Language Changers -----
export { ThemeChanger } from "./components/ThemeChanger";
export type { ThemeChangerProps, ThemeOption } from "./components/ThemeChanger";

export {
  LanguageChanger,
  I18nProvider,
  useI18n,
} from "./components/LanguageChanger";
export type {
  LanguageChangerProps,
  LanguageOption,
} from "./components/LanguageChanger";

// ----- Hooks -----
export { default as useDirection } from "./hooks/useDirection";
export type { Direction } from "./hooks/useDirection";

// ----- Metadata -----
export const version = "0.1.0";

// ----- Styles -----
import "./styles/index.css";
