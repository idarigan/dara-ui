import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";

export interface SidebarItem {
  /**
   * Unique identifier for the item
   */
  id: string;
  /**
   * Display label
   */
  label: string;
  /**
   * Icon element
   */
  icon?: React.ReactNode;
  /**
   * Whether the item is active
   */
  active?: boolean;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Sub-items for nested navigation
   */
  subItems?: SidebarItem[];
  /**
   * Optional badge text or number
   */
  badge?: string | number;
  /**
   * Optional href for link mode
   */
  href?: string;
  /**
   * Content to render when this item is selected
   */
  content?: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
}

export interface SidebarGroup {
  /**
   * Group label
   */
  label: string;
  /**
   * Group icon
   */
  icon?: React.ReactNode;
  /**
   * Items in this group
   */
  items: SidebarItem[];
  /**
   * Whether the group is expanded
   */
  defaultExpanded?: boolean;
}

export interface SidebarProps {
  /**
   * Sidebar brand/logo
   */
  brand?: React.ReactNode;
  /**
   * Groups of sidebar items
   */
  groups: SidebarGroup[];
  /**
   * Whether the sidebar is collapsible (desktop only)
   * @default true
   */
  collapsible?: boolean;
  /**
   * Initially collapsed state (desktop only)
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Controlled collapsed state (desktop only)
   */
  collapsed?: boolean;
  /**
   * Callback when collapse state changes (desktop only)
   */
  onCollapseChange?: (collapsed: boolean) => void;
  /**
   * Icon-only mode (desktop only)
   * @default false
   */
  iconOnly?: boolean;
  /**
   * Whether to show group labels
   * @default true
   */
  showGroupLabels?: boolean;
  /**
   * Active item ID (controlled)
   */
  activeItemId?: string;
  /**
   * Default active item ID (uncontrolled)
   */
  defaultActiveItemId?: string;
  /**
   * Callback when an item is clicked
   */
  onItemClick?: (itemId: string) => void;
  /**
   * Width when expanded (desktop only)
   * @default "260px"
   */
  expandedWidth?: string;
  /**
   * Width when collapsed (desktop only)
   * @default "64px"
   */
  collapsedWidth?: string;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Footer content (desktop only)
   */
  footer?: React.ReactNode;
  /**
   * Whether the sidebar is fixed to the viewport
   * @default false
   */
  fixed?: boolean;
  /**
   * Height of the sidebar container (desktop only)
   * @default "100%"
   */
  height?: string;
  /**
   * Breakpoint (px) below which the sidebar renders as a horizontal
   * scrollable tab strip instead of the vertical column
   * @default 768
   */
  mobileBreakpoint?: number;
  /**
   * Force mobile layout regardless of viewport
   * @default false
   */
  forceMobile?: boolean;
}

/**
 * Dara UI Sidebar - Responsive vertical sidebar with mobile horizontal tabs
 *
 * Features:
 * - Desktop (>= 768px): classic vertical column — collapse/expand, Ctrl+B,
 *   group labels, nested sub-menus, icon-only mode, footer
 * - Mobile (< 768px): auto-switches to a horizontal scrollable tab strip
 *   with edge scroll arrows and a second row for sub-items
 * - Full RTL support (items, chevrons, active bar, scroll direction, borders)
 */
export const Sidebar: React.FC<SidebarProps> = ({
  brand,
  groups = [],
  collapsible = true,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapseChange,
  iconOnly = false,
  showGroupLabels = true,
  activeItemId: controlledActiveId,
  defaultActiveItemId,
  onItemClick,
  expandedWidth = "260px",
  collapsedWidth = "64px",
  className = "",
  footer,
  fixed = false,
  height = "100%",
  mobileBreakpoint = 768,
  forceMobile = false,
}) => {
  // ============================================
  // ALL HOOKS — must run on every render
  // ============================================

  // ----- Responsive detection -----
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (forceMobile) {
      setIsMobile(true);
      return;
    }
    const check = () => setIsMobile(window.innerWidth < mobileBreakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [mobileBreakpoint, forceMobile]);

  // ----- Collapse state (desktop) -----
  const isControlledCollapse = controlledCollapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = isControlledCollapse
    ? controlledCollapsed
    : internalCollapsed;
  const isIconOnly = iconOnly || isCollapsed;

  // ----- Active item state -----
  const isControlledActive = controlledActiveId !== undefined;
  const [internalActiveId, setInternalActiveId] = useState<string | undefined>(
    defaultActiveItemId || groups[0]?.items[0]?.id,
  );
  const activeId = isControlledActive ? controlledActiveId : internalActiveId;

  // ----- RTL detection -----
  const [isRTL, setIsRTL] = useState(false);
  useEffect(() => {
    const updateDir = () => setIsRTL(document.documentElement.dir === "rtl");
    updateDir();
    const observer = new MutationObserver(updateDir);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
    return () => observer.disconnect();
  }, []);

  // ----- Find active item + its parent -----
  const { activeItem, activeParent } = useMemo(() => {
    for (const group of groups) {
      for (const item of group.items) {
        if (item.id === activeId) {
          return { activeItem: item, activeParent: null };
        }
        if (item.subItems) {
          for (const sub of item.subItems) {
            if (sub.id === activeId) {
              return { activeItem: sub, activeParent: item };
            }
          }
        }
      }
    }
    return { activeItem: null, activeParent: null };
  }, [groups, activeId]);

  // ----- Desktop group/sub expansion state -----
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    groups.forEach((group, index) => {
      if (group.defaultExpanded !== false) {
        initial.add(`group-${index}`);
      }
    });
    return initial;
  });

  const [expandedSubItems, setExpandedSubItems] = useState<Set<string>>(
    new Set(),
  );

  // ----- Mobile scroll strip refs -----
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);

  // ----- Content fade state -----
  const activeContent = activeItem?.content ?? activeParent?.content ?? null;
  const [displayedContent, setDisplayedContent] =
    useState<React.ReactNode>(activeContent);
  const [contentVisible, setContentVisible] = useState(true);

  // ============================================
  // CALLBACKS
  // ============================================

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (isRTL) {
      setCanScrollStart(scrollLeft < -1);
      setCanScrollEnd(scrollLeft > -(scrollWidth - clientWidth) + 1);
    } else {
      setCanScrollStart(scrollLeft > 1);
      setCanScrollEnd(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, [isRTL]);

  const scrollBy = useCallback(
    (direction: "start" | "end") => {
      const el = scrollRef.current;
      if (!el) return;
      const amount = Math.max(el.clientWidth * 0.7, 200);
      const delta =
        direction === "start"
          ? isRTL
            ? amount
            : -amount
          : isRTL
            ? -amount
            : amount;
      el.scrollBy({ left: delta, behavior: "smooth" });
    },
    [isRTL],
  );

  const handleItemClick = useCallback(
    (itemId: string, onClick?: () => void) => {
      if (!isControlledActive) setInternalActiveId(itemId);
      onItemClick?.(itemId);
      onClick?.();
    },
    [isControlledActive, onItemClick],
  );

  const toggleCollapse = useCallback(() => {
    if (!collapsible) return;
    const newState = !isCollapsed;
    if (!isControlledCollapse) setInternalCollapsed(newState);
    onCollapseChange?.(newState);
  }, [collapsible, isCollapsed, isControlledCollapse, onCollapseChange]);

  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  }, []);

  const toggleSubItems = useCallback((key: string) => {
    setExpandedSubItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // ============================================
  // EFFECTS
  // ============================================

  // Update scroll indicators on mobile
  useEffect(() => {
    if (!isMobile) return;
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [isMobile, updateScrollState]);

  // Scroll active item into view (mobile)
  useEffect(() => {
    if (!isMobile) return;
    const el = scrollRef.current?.querySelector<HTMLElement>(
      `[data-sidebar-id="${activeId}"]`,
    );
    el?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId, isMobile]);

  // Content fade transition
  useEffect(() => {
    if (activeContent === displayedContent) return;
    setContentVisible(false);
    const timer = setTimeout(() => {
      setDisplayedContent(activeContent);
      requestAnimationFrame(() => setContentVisible(true));
    }, 160);
    return () => clearTimeout(timer);
  }, [activeContent, displayedContent]);

  // Ctrl+B shortcut (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        toggleCollapse();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, toggleCollapse]);

  // ============================================
  // DESKTOP RENDERERS
  // ============================================

  const renderItem = (
    item: SidebarItem,
    depth: number = 0,
    parentId?: string,
  ): React.ReactNode => {
    const isActive = activeId === item.id;
    const hasSubItems = !!(item.subItems && item.subItems.length > 0);
    const subKey = `${parentId || item.id}-sub`;
    const isSubExpanded = expandedSubItems.has(subKey);
    const depthPadding = isIconOnly ? 0 : depth * 16;

    if (isIconOnly) {
      return (
        <div key={item.id} className="relative">
          <button
            onClick={() => handleItemClick(item.id, item.onClick)}
            disabled={item.disabled}
            className={`
              w-full flex items-center justify-center
              px-2 py-3 rounded-[var(--radius-md)]
              transition-all duration-180 relative
              ${
                item.disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[var(--color-bg-elevated)]/40 cursor-pointer"
              }
              ${
                isActive
                  ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
                  : "text-[var(--color-text-secondary)]"
              }
              group
            `}
            title={item.label}
            aria-current={isActive ? "page" : undefined}
            aria-disabled={item.disabled}
          >
            {item.icon && (
              <span className="flex-shrink-0 text-current w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>
            )}
            {item.badge && (
              <span
                className={`
                  absolute -top-0.5 ${isRTL ? "-left-0.5" : "-right-0.5"}
                  flex items-center justify-center
                  min-w-[18px] h-[18px] px-1
                  text-[9px] font-bold rounded-full
                  bg-[var(--color-danger)] text-white
                `}
              >
                {item.badge}
              </span>
            )}
            {isActive && (
              <span
                className={`
                  absolute ${isRTL ? "right-0" : "left-0"}
                  top-1/2 -translate-y-1/2
                  w-0.5 h-6 rounded-full
                  bg-[var(--color-primary)] shadow-[var(--shadow-glow-primary)]
                `}
              />
            )}
          </button>
        </div>
      );
    }

    return (
      <div key={item.id} className="relative">
        <button
          onClick={() => {
            if (hasSubItems) toggleSubItems(subKey);
            else handleItemClick(item.id, item.onClick);
          }}
          disabled={item.disabled}
          className={`
            w-full flex items-center gap-3
            ${isRTL ? "flex-row-reverse" : ""}
            px-3 py-2.5 rounded-[var(--radius-md)]
            transition-all duration-180
            text-sm font-medium relative
            ${
              item.disabled
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[var(--color-bg-elevated)]/40 cursor-pointer"
            }
            ${
              isActive
                ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
                : "text-[var(--color-text-secondary)]"
            }
            group
          `}
          style={{
            paddingInlineStart: `${16 + depthPadding}px`,
            paddingInlineEnd: "12px",
          }}
          aria-current={isActive ? "page" : undefined}
          aria-disabled={item.disabled}
          aria-expanded={hasSubItems ? isSubExpanded : undefined}
        >
          {item.icon && (
            <span className="flex-shrink-0 text-current w-5 h-5 flex items-center justify-center">
              {item.icon}
            </span>
          )}
          <span
            className={`flex-1 truncate ${isRTL ? "text-right" : "text-left"}`}
          >
            {item.label}
          </span>
          {item.badge && (
            <span
              className={`
                flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full
                ${
                  isActive
                    ? "bg-[var(--color-primary-solid)] text-white"
                    : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"
                }
              `}
            >
              {item.badge}
            </span>
          )}
          {hasSubItems && (
            <span
              className={`
                flex-shrink-0 transition-transform duration-250
                text-[var(--color-text-tertiary)]
                ${
                  isSubExpanded
                    ? "rotate-90"
                    : isRTL
                      ? "rotate-180"
                      : "rotate-0"
                }
              `}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          )}
          {isActive && (
            <span
              className={`
                absolute ${isRTL ? "right-0" : "left-0"}
                top-1/2 -translate-y-1/2
                w-0.5 h-6 rounded-full
                bg-[var(--color-primary)] shadow-[var(--shadow-glow-primary)]
              `}
            />
          )}
        </button>

        {hasSubItems && !isIconOnly && (
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-[var(--ease-in-out)]
              ${isSubExpanded ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <div
              className={`
                relative space-y-0.5 py-1
                ${
                  isRTL
                    ? "mr-4 pr-4 border-r border-[var(--color-border-secondary)]"
                    : "ml-4 pl-4 border-l border-[var(--color-border-secondary)]"
                }
              `}
            >
              {item.subItems!.map((subItem) =>
                renderItem(subItem, depth + 1, item.id),
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGroup = (group: SidebarGroup, index: number) => {
    const groupKey = `group-${index}`;
    const isExpanded = expandedGroups.has(groupKey);

    if (isIconOnly) {
      return (
        <div key={groupKey} className="space-y-1">
          {group.items.map((item) => renderItem(item))}
        </div>
      );
    }

    return (
      <div key={groupKey} className="mb-2">
        {showGroupLabels && (
          <button
            onClick={() => toggleGroup(groupKey)}
            className={`
              w-full flex items-center gap-2 px-3 py-2
              text-xs font-mono uppercase tracking-wider
              text-[var(--color-text-tertiary)]
              hover:text-[var(--color-text-secondary)]
              transition-colors duration-180
              rounded-[var(--radius-sm)]
              hover:bg-[var(--color-bg-elevated)]/20
              ${isRTL ? "flex-row-reverse" : ""}
            `}
          >
            {group.icon && (
              <span className="flex-shrink-0 w-4 h-4">{group.icon}</span>
            )}
            <span className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
              {group.label}
            </span>
            <span
              className={`transition-transform duration-250 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>
        )}
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-[var(--ease-in-out)]
            ${isExpanded ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="space-y-1 py-1">
            {group.items.map((item) => renderItem(item))}
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // MOBILE RENDER
  // ============================================
  if (isMobile) {
    return (
      <div className={`flex flex-col w-full h-full min-h-0 ${className}`}>
        {/* ===== Tab strip ===== */}
        <div className="relative flex items-stretch gap-2 px-4 pt-4 flex-shrink-0">
          {/* Scroll start arrow */}
          {canScrollStart && (
            <button
              type="button"
              onClick={() => scrollBy("start")}
              className="
                flex-shrink-0 w-8 self-stretch
                flex items-center justify-center
                rounded-[var(--radius-md)]
                glass
                text-[var(--color-text-secondary)]
                hover:text-[var(--color-text-primary)]
                transition-all duration-180
              "
              aria-label="Scroll previous"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Scrollable tab row */}
          <div
            ref={scrollRef}
            className="
              flex-1 min-w-0
              flex items-center gap-1
              overflow-x-auto scroll-smooth
              pb-1 sidebar-horizontal-scroll
            "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {brand && (
              <div className="flex-shrink-0 me-3 flex items-center">
                {brand}
              </div>
            )}

            {groups.map((group, groupIndex) => (
              <React.Fragment key={`group-${groupIndex}`}>
                {showGroupLabels && (
                  <span
                    className="
                      flex-shrink-0 px-3 py-1
                      text-[10px] font-mono uppercase tracking-wider
                      text-[var(--color-text-tertiary)]
                      border-e border-[var(--color-border-secondary)]
                      me-1
                    "
                    dir="auto"
                  >
                    {group.label}
                  </span>
                )}

                {group.items.map((item) => {
                  const hasSubItems = !!(
                    item.subItems && item.subItems.length > 0
                  );
                  const isActive =
                    activeId === item.id ||
                    (hasSubItems &&
                      item.subItems!.some((s) => s.id === activeId));

                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-sidebar-id={item.id}
                      onClick={() => handleItemClick(item.id, item.onClick)}
                      disabled={item.disabled}
                      className={`
                        flex-shrink-0
                        flex items-center gap-2
                        px-4 py-2 rounded-full
                        text-sm font-medium whitespace-nowrap
                        transition-all duration-180
                        ${
                          item.disabled
                            ? "opacity-40 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                        ${
                          isActive
                            ? "bg-[var(--color-primary-solid)] text-white shadow-[var(--shadow-glow-primary)]"
                            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/40"
                        }
                      `}
                      aria-current={isActive ? "page" : undefined}
                      aria-disabled={item.disabled}
                    >
                      {item.icon && (
                        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={`
                            flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                            ${
                              isActive
                                ? "bg-white/25 text-white"
                                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"
                            }
                          `}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Scroll end arrow */}
          {canScrollEnd && (
            <button
              type="button"
              onClick={() => scrollBy("end")}
              className="
                flex-shrink-0 w-8 self-stretch
                flex items-center justify-center
                rounded-[var(--radius-md)]
                glass
                text-[var(--color-text-secondary)]
                hover:text-[var(--color-text-primary)]
                transition-all duration-180
              "
              aria-label="Scroll next"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* ===== Sub-items row ===== */}
        {activeParent && activeParent.subItems && (
          <div className="flex flex-wrap items-center gap-1 mt-2 px-4 flex-shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] me-1">
              {activeParent.label}:
            </span>
            {activeParent.subItems.map((sub) => {
              const isSubActive = activeId === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleItemClick(sub.id, sub.onClick)}
                  disabled={sub.disabled}
                  className={`
                    flex items-center gap-1.5
                    px-3 py-1 rounded-full
                    text-xs font-medium whitespace-nowrap
                    transition-all duration-180
                    ${
                      sub.disabled
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                    ${
                      isSubActive
                        ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary)]/40"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/40"
                    }
                  `}
                  aria-current={isSubActive ? "page" : undefined}
                >
                  {sub.icon && (
                    <span className="flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center">
                      {sub.icon}
                    </span>
                  )}
                  <span>{sub.label}</span>
                  {sub.badge !== undefined && (
                    <span
                      className={`
                        flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full
                        ${
                          isSubActive
                            ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                            : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"
                        }
                      `}
                    >
                      {sub.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ===== Content panel — scrolls vertically when tall ===== */}
        {displayedContent != null && (
          <div
            className="flex-1 min-h-0 mt-4 px-4 pb-4 overflow-y-auto sidebar-content-scroll"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(6px)",
              transition:
                "opacity 160ms cubic-bezier(0.4, 0, 0.2, 1), transform 160ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {displayedContent}
          </div>
        )}

        <style>{`
          .sidebar-horizontal-scroll::-webkit-scrollbar { display: none; }
          .sidebar-content-scroll::-webkit-scrollbar { width: 4px; }
          .sidebar-content-scroll::-webkit-scrollbar-track { background: transparent; }
          .sidebar-content-scroll::-webkit-scrollbar-thumb {
            background: var(--color-border-primary);
            border-radius: 4px;
          }
        `}</style>
      </div>
    );
  }

  // ============================================
  // DESKTOP RENDER
  // ============================================
  const radiusClass = fixed
    ? ""
    : isRTL
      ? "rounded-l-[var(--radius-large)]"
      : "rounded-r-[var(--radius-large)]";

  const positionClasses = fixed
    ? "fixed top-0 z-40"
    : `relative overflow-hidden ${radiusClass}`;

  const rtlDirection =
    isRTL && !isCollapsed
      ? ({ direction: "rtl" } as const)
      : ({ direction: "ltr" } as const);

  // Nav scrollbar: on desktop, scrollbar rides on the edge that faces the
  // content (left in LTR when sidebar sits on the left, right in RTL).
  // We force it with a wrapper that flips the scroll container.
  const navDirection = isRTL ? "ltr" : "rtl";
  const innerDirection = isRTL ? "rtl" : "ltr";

  return (
    <div
      className={`
        flex ${isRTL ? "flex-row-reverse" : ""} transition-all duration-300 ease-[var(--ease-in-out)]
        ${fixed ? "min-h-screen" : ""}
        ${className}
      `}
      style={{
        height: fixed ? "100%" : height,
        maxHeight: fixed ? "100%" : height,
      }}
    >
      <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: var(--color-border-primary);
          border-radius: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--color-text-tertiary);
        }
      `}</style>

      <aside
        className={`
          ${positionClasses}
          h-full
          bg-[var(--color-bg-secondary)]/95
          backdrop-blur-[20px]
          transition-all duration-300 ease-[var(--ease-in-out)]
          flex flex-col
          ${isRTL ? "border-l" : "border-r"}
          border-[var(--color-border-primary)]
          ${fixed ? "" : "shadow-[var(--shadow-float)]"}
        `}
        style={{
          width: isCollapsed ? collapsedWidth : expandedWidth,
          [isRTL ? "right" : "left"]: fixed ? 0 : "auto",
          flexShrink: 0,
          height: "100%",
          maxHeight: "100%",
        }}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {brand && (
          <div
            className={`
              flex items-center gap-3 px-4 py-4
              border-b border-[var(--color-border-primary)]
              min-h-[64px] flex-shrink-0
              ${isCollapsed ? "justify-center px-2" : ""}
            `}
            style={rtlDirection}
            dir={isRTL && !isCollapsed ? "rtl" : "ltr"}
          >
            {brand}
          </div>
        )}

        {/* Nav uses an outer flipped-direction wrapper so the scrollbar
            sits on the edge facing the content */}
        <nav
          className="flex-1 overflow-y-auto min-h-0 sidebar-scroll"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--color-border-primary) transparent",
            direction: navDirection,
          }}
          dir={navDirection}
        >
          <div
            className="p-3 space-y-2"
            style={{ direction: innerDirection }}
            dir={innerDirection}
          >
            {groups.map((group, index) => renderGroup(group, index))}
          </div>
        </nav>

        <div className="border-t border-[var(--color-border-primary)] flex-shrink-0">
          {footer && (
            <div className={`p-3 ${isCollapsed ? "flex justify-center" : ""}`}>
              <div
                className={`
                  w-full
                  ${
                    isCollapsed
                      ? `
                        flex justify-center
                        [&>button]:!w-10 [&>button]:!h-10 [&>button]:!px-0 [&>button]:!gap-0 [&>button]:justify-center
                        [&>button>span:not(:first-child)]:hidden
                        [&>button>svg+span]:hidden
                        [&>a]:!w-10 [&>a]:!h-10 [&>a]:!px-0 [&>a]:!gap-0 [&>a]:justify-center
                        [&>a>span:not(:first-child)]:hidden
                      `
                      : ""
                  }
                `}
                style={rtlDirection}
                dir={isRTL && !isCollapsed ? "rtl" : "ltr"}
              >
                {footer}
              </div>
            </div>
          )}

          {collapsible && (
            <div
              className={`px-3 pb-3 ${isCollapsed ? "flex justify-center" : ""}`}
            >
              <button
                onClick={toggleCollapse}
                className={`
                  flex items-center justify-center
                  rounded-[var(--radius-md)] glass
                  text-[var(--color-text-secondary)]
                  hover:text-[var(--color-text-primary)]
                  hover:bg-[var(--color-bg-elevated)]/40
                  transition-all duration-180 text-sm gap-2
                  ${isCollapsed ? "w-10 h-10 px-0" : "w-full px-3 py-2"}
                  ${!isCollapsed && isRTL ? "flex-row-reverse" : ""}
                `}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={`${isCollapsed ? "Expand" : "Collapse"} (Ctrl+B)`}
              >
                <svg
                  className={`
                    h-4 w-4 flex-shrink-0 transition-transform duration-300
                    ${
                      isCollapsed
                        ? isRTL
                          ? "rotate-180"
                          : "rotate-0"
                        : isRTL
                          ? "rotate-0"
                          : "rotate-180"
                    }
                  `}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                {!isCollapsed && (
                  <span className="text-xs font-mono text-[var(--color-text-tertiary)]">
                    Ctrl+B
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </aside>

      {displayedContent != null && (
        <div
          className="flex-1 p-6 overflow-y-auto transition-all duration-300 ease-[var(--ease-in-out)]"
          style={{
            height: "100%",
            maxHeight: "100%",
            minHeight: 0,
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0)" : "translateY(6px)",
            transition:
              "opacity 160ms cubic-bezier(0.4, 0, 0.2, 1), transform 160ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {displayedContent}
        </div>
      )}
    </div>
  );
};

Sidebar.displayName = "Sidebar";
export default Sidebar;
