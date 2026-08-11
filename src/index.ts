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

// ----- Checkbox -----
export { Checkbox } from "./components/Checkbox/Checkbox";
export type { CheckboxProps } from "./components/Checkbox/Checkbox";

// ----- Switch -----
export { Switch } from "./components/Switch/Switch";
export type { SwitchProps } from "./components/Switch/Switch";

// ----- Radio -----
export { Radio } from "./components/Radio/Radio";
export type { RadioProps } from "./components/Radio/Radio";

// ----- Range -----
export { Range } from "./components/Range/Range";
export type { RangeProps } from "./components/Range/Range";

// ----- Layout Components -----
export { Navbar } from "./components/Navbar";
export type { NavbarProps, NavLink } from "./components/Navbar";

export { Sidebar } from "./components/Sidebar/Sidebar";
export type {
  SidebarProps,
  SidebarItem,
  SidebarGroup,
} from "./components/Sidebar/Sidebar";

export { SocialMedia } from "./components/SocialMedia/SocialMedia";
export type {
  SocialMediaProps,
  SocialLink,
} from "./components/SocialMedia/SocialMedia";

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

// ----- RPG/Specialty Components -----
export { CharacterCard } from "./components/CharacterCard/CharacterCard";
export type {
  CharacterCardProps,
  CharacterStat,
} from "./components/CharacterCard/CharacterCard";

export { QuestCard } from "./components/QuestCard/QuestCard";
export type { QuestCardProps } from "./components/QuestCard/QuestCard";

export { StatsWidget } from "./components/StatsWidget/StatsWidget";
export type {
  StatsWidgetProps,
  StatsWidgetData,
} from "./components/StatsWidget/StatsWidget";

export { XPBar } from "./components/XPBar/XPBar";
export type { XPBarProps, RankTier } from "./components/XPBar/XPBar";

// ----- Visual Effects -----
export { Particles } from "./components/Particles/Particles";
export type { ParticlesProps } from "./components/Particles/Particles";

export { AuroraBlobs } from "./components/AuroraBlobs/AuroraBlobs";
export type { AuroraBlobsProps } from "./components/AuroraBlobs/AuroraBlobs";

export { GradientRing } from "./components/GradientRing/GradientRing";
export type { GradientRingProps } from "./components/GradientRing/GradientRing";

export { NoiseOverlay } from "./components/NoiseOverlay/NoiseOverlay";
export type { NoiseOverlayProps } from "./components/NoiseOverlay/NoiseOverlay";

// ----- Hooks -----
export { default as useDirection } from "./hooks/useDirection";
export type { Direction } from "./hooks/useDirection";

// ----- Metadata -----
export const version = "0.1.0";

// ----- Styles -----
import "./styles/index.css";
