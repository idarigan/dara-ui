import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { PageLoader } from "./PageLoader";
import type { LoaderShape } from "./PageLoader";

export interface PageLoaderOptions {
  /**
   * Loading label
   */
  label?: string;
  /**
   * Loader shape
   * @default "spinner"
   */
  shape?: LoaderShape;
  /**
   * Minimum display time in ms
   * @default 400
   */
  minDuration?: number;
  /**
   * Show progress
   */
  showProgress?: boolean;
  /**
   * Show brand mark
   */
  showBrand?: boolean;
}

interface PageLoaderContextValue {
  /**
   * Show the page loader
   */
  show: (options?: PageLoaderOptions) => void;
  /**
   * Hide the page loader
   */
  hide: () => void;
  /**
   * Whether the loader is currently visible
   */
  isLoading: boolean;
  /**
   * Update progress (0-100)
   */
  setProgress: (progress: number) => void;
  /**
   * Wrap an async operation with automatic loader
   */
  wrap: <T>(fn: () => Promise<T>, options?: PageLoaderOptions) => Promise<T>;
}

const PageLoaderContext = createContext<PageLoaderContextValue | undefined>(
  undefined,
);

/**
 * PageLoaderProvider - App-level page loader with imperative API
 *
 * Features:
 * - show()/hide() imperative API
 * - wrap() to auto-load during async ops
 * - Route-change friendly
 * - Progress support
 */
export const PageLoaderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<PageLoaderOptions>({});
  const [progress, setProgressState] = useState<number | undefined>(undefined);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((opts?: PageLoaderOptions) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setOptions(opts || {});
    setProgressState(opts?.showProgress ? 0 : undefined);
    setIsLoading(true);
  }, []);

  const hide = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setProgress = useCallback((p: number) => {
    setProgressState(Math.max(0, Math.min(100, p)));
  }, []);

  const wrap = useCallback(
    async <T,>(fn: () => Promise<T>, opts?: PageLoaderOptions): Promise<T> => {
      show({ minDuration: 400, ...opts });
      try {
        const result = await fn();
        return result;
      } finally {
        hide();
      }
    },
    [show, hide],
  );

  const value: PageLoaderContextValue = {
    show,
    hide,
    isLoading,
    setProgress,
    wrap,
  };

  return (
    <PageLoaderContext.Provider value={value}>
      {children}
      <PageLoader
        isLoading={isLoading}
        shape={options.shape}
        label={options.label}
        progress={progress}
        showProgress={options.showProgress}
        showBrand={options.showBrand}
        minDuration={options.minDuration}
      />
    </PageLoaderContext.Provider>
  );
};

/**
 * usePageLoader - Imperative API for the page loader
 *
 * @example
 * ```tsx
 * const loader = usePageLoader();
 *
 * // Manual control
 * loader.show({ label: "Loading...", showBrand: true });
 * loader.hide();
 *
 * // Auto-wrap an async operation
 * await loader.wrap(async () => {
 *   const data = await fetch("/api/data");
 *   return data.json();
 * }, { label: "Fetching..." });
 * ```
 */
export const usePageLoader = (): PageLoaderContextValue => {
  const context = useContext(PageLoaderContext);
  if (!context) {
    throw new Error("usePageLoader must be used within a PageLoaderProvider");
  }
  return context;
};

export default usePageLoader;
