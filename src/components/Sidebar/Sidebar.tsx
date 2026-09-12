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
   * Layout orientation
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Whether the sidebar is collapsible (vertical only)
   * @default true
   */
  collapsible?: boolean;
  /**
   * Initially collapsed state (vertical only)
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Controlled collapsed state (vertical only)
   */
  collapsed?: boolean;
  /**
   * Callback when collapse state changes (vertical only)
   */
  onCollapseChange?: (collapsed: boolean) => void;
  /**
   * Icon-only mode (vertical only)
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
   * Width when expanded (vertical only)
   * @default "260px"
   */
  expandedWidth?: string;
  /**
   * Width when collapsed (vertical only)
   * @default "64px"
   */
  collapsedWidth?: string;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Footer content (vertical only)
   */
  footer?: React.ReactNode;
  /**
   * Whether the sidebar is fixed to the viewport
   * @default false
   */
  fixed?: boolean;
  /**
   * Height of the sidebar container (vertical only)
   * @default "100%"
   */
  height?: string;
}

/**
 * Dara UI Sidebar - Navigation with horizontal tab strip or vertical column
 *
 * Features:
 * - Horizontal orientation: scrollable tab strip with edge arrows
 * - Vertical orientation: classic collapsible sidebar (Ctrl+B)
 * - Groups become labeled sections in the tab strip
 * - Items with sub-items reveal a second row of sub-tabs
 * - Content panel renders below the tab strip (horizontal) or beside (vertical)
 * - Full RTL support (scroll direction, chevrons, active bar)
 */
export const Sidebar: React.FC<SidebarProps> = ({
  brand,
  groups = [],
  orientation = "horizontal",
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
}) => {
  const isHorizontal = orientation === "horizontal";

  // ----- Collapse state (vertical only) -----
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
  const { activeItem, activeParent, activeGroupIndex } = useMemo(() => {
    for (let gi = 0; gi < groups.length; gi++) {
      const group = groups[gi];
      for (const item of group.items) {
        if (item.id === activeId) {
          return { activeItem: item, activeParent: null, activeGroupIndex: gi };
        }
        if (item.subItems) {
          for (const sub of item.subItems) {
            if (sub.id === activeId) {
              return {
                activeItem: sub,
                activeParent: item,
                activeGroupIndex: gi,
              };
            }
          }
        }
      }
    }
    return {
      activeItem: null,
      activeParent: null,
      activeGroupIndex: -1,
    };
  }, [groups, activeId]);

  // ----- Content fade animation -----
  const activeContent = activeItem?.content ?? activeParent?.content ?? null;
  const [displayedContent, setDisplayedContent] =
    useState<React.ReactNode>(activeContent);
  const [contentVisible, setContentVisible] = useState(true);

  useEffect(() => {
    if (activeContent === displayedContent) return;
    setContentVisible(false);
    const timer = setTimeout(() => {
      setDisplayedContent(activeContent);
      requestAnimationFrame(() => setContentVisible(true));
    }, 160);
    return () => clearTimeout(timer);
  }, [activeContent, displayedContent]);

  // ----- Handlers -----
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

  // Ctrl+B shortcut (vertical only)
  useEffect(() => {
    if (isHorizontal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        toggleCollapse();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isHorizontal, toggleCollapse]);

  // ----- Horizontal scroll strip logic -----
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (isRTL) {
      // RTL: scrollLeft goes negative from 0 to -(scrollWidth - clientWidth)
      setCanScrollStart(scrollLeft < -1);
      setCanScrollEnd(scrollLeft > -(scrollWidth - clientWidth) + 1);
    } else {
      setCanScrollStart(scrollLeft > 1);
      setCanScrollEnd(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, [isRTL]);

  useEffect(() => {
    if (!isHorizontal) return;
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [isHorizontal, updateScrollState]);

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

  // Scroll active item into view when it changes
  useEffect(() => {
    if (!isHorizontal) return;
    const el = scrollRef.current?.querySelector<HTMLElement>(
      `[data-sidebar-id="${activeId}"]`,
    );
    el?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId, isHorizontal]);

  // ============================================
  // HORIZONTAL RENDER
  // ============================================
  if (isHorizontal) {
    return (
      <div className={`flex flex-col w-full ${className}`}>
        {/* ===== Tab strip ===== */}
        <div className="relative flex items-stretch gap-2">
          {/* Left scroll arrow */}
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
                {/* Group label chip */}
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

                {/* Group items */}
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

          {/* Right scroll arrow */}
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
          <div className="flex flex-wrap items-center gap-1 mt-2 ps-1">
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

        {/* ===== Content panel ===== */}
        {displayedContent != null && (
          <div
            className="flex-1 mt-4 transition-all duration-300 ease-[var(--ease-in-out)]"
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
      </div>
    );
  }

  // ============================================
  // VERTICAL RENDER
  // ============================================
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

  const renderVerticalItem = (
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
                renderVerticalItem(subItem, depth + 1, item.id),
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderVerticalGroup = (group: SidebarGroup, index: number) => {
    const groupKey = `group-${index}`;
    const isExpanded = expandedGroups.has(groupKey);

    if (isIconOnly) {
      return (
        <div key={groupKey} className="space-y-1">
          {group.items.map((item) => renderVerticalItem(item))}
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
            {group.items.map((item) => renderVerticalItem(item))}
          </div>
        </div>
      </div>
    );
  };

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

        <nav
          className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 sidebar-scroll"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--color-border-primary) transparent",
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
            .sidebar-horizontal-scroll::-webkit-scrollbar { display: none; }
          `}</style>
          {groups.map((group, index) => renderVerticalGroup(group, index))}
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
