import { useEffect } from "react";

export interface CursorImage {
  /**
   * Image URL (png, svg, cur - keep it at 32x32 or smaller)
   */
  src: string;
  /**
   * Click point inside the image in pixels
   * @default [0, 0]
   */
  hotspot?: [number, number];
}

export interface CustomCursorProps {
  /**
   * Cursor used everywhere by default. Falls back to the built-in arrow
   */
  defaultCursor?: string | CursorImage;
  /**
   * Cursor used over links, buttons and other clickable elements.
   * Falls back to the built-in ring
   */
  pointerCursor?: string | CursorImage;
  /**
   * Size of the built-in cursors in pixels
   * @default 32
   */
  size?: number;
  /**
   * Color of the built-in cursors (any CSS color or a CSS variable)
   * @default "var(--color-primary-solid)"
   */
  color?: string;
}

const MAX_SIZE = 64;

const readColor = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed.startsWith("var(")) return trimmed;
  const name = trimmed.slice(4, -1).split(",")[0].trim();
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    "#7c5cff"
  );
};

const arrowSvg = (size: number, fill: string, stroke: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><path d="M5 3v21l5.5-5 4 8.5 3.5-1.6-4-8.2 7.5-.2z" fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

const ringSvg = (size: number, fill: string, stroke: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><circle cx="16" cy="16" r="10.5" fill="${fill}" fill-opacity="0.18" stroke="${fill}" stroke-width="2"/><circle cx="16" cy="16" r="3.4" fill="${fill}" stroke="${stroke}" stroke-width="1"/></svg>`;

const svgCursor = (svg: string, hotX: number, hotY: number, fallback: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotX} ${hotY}, ${fallback}`;

const imageCursor = (image: string | CursorImage, fallback: string): string => {
  const { src, hotspot = [0, 0] } =
    typeof image === "string"
      ? { src: image, hotspot: [0, 0] as [number, number] }
      : image;
  return `url("${src}") ${hotspot[0]} ${hotspot[1]}, ${fallback}`;
};

/**
 * Dara UI CustomCursor - Themed cursors with a default and a pointer variant
 *
 * Features:
 * - Native CSS cursors, so there is no lag and no extra render loop
 * - Built-in arrow and ring cursors colored from the active theme
 * - Bring your own default and pointer images with custom hotspots
 * - Pointer cursor applies to links, buttons, tabs, options and checkable inputs
 * - Text fields keep the text cursor and disabled elements keep not-allowed
 * - Only active on devices with a fine pointer
 * - Renders nothing, mount it once near the app root
 */
export const CustomCursor: React.FC<CustomCursorProps> = ({
  defaultCursor,
  pointerCursor,
  size = 32,
  color = "var(--color-primary-solid)",
}) => {
  const defaultKey = JSON.stringify(defaultCursor ?? null);
  const pointerKey = JSON.stringify(pointerCursor ?? null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    const px = Math.min(MAX_SIZE, Math.max(12, size));

    const apply = () => {
      const fill = readColor(color);
      const stroke = readColor("var(--color-text-primary)");

      root.style.setProperty(
        "--dara-cursor",
        defaultCursor
          ? imageCursor(defaultCursor, "auto")
          : svgCursor(arrowSvg(px, fill, stroke), 3, 2, "auto"),
      );
      root.style.setProperty(
        "--dara-cursor-pointer",
        pointerCursor
          ? imageCursor(pointerCursor, "pointer")
          : svgCursor(
              ringSvg(px, fill, stroke),
              Math.round(px / 2),
              Math.round(px / 2),
              "pointer",
            ),
      );
      root.setAttribute("data-dara-cursor", "true");
    };

    apply();

    const observer = new MutationObserver(apply);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
      root.removeAttribute("data-dara-cursor");
      root.style.removeProperty("--dara-cursor");
      root.style.removeProperty("--dara-cursor-pointer");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultKey, pointerKey, size, color]);

  return null;
};

CustomCursor.displayName = "CustomCursor";
export default CustomCursor;
