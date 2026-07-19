import { useState, useEffect, useCallback } from "react";

export type Direction = "ltr" | "rtl";

export function useDirection(initialDirection: Direction = "ltr") {
  const [direction, setDirection] = useState<Direction>(initialDirection);

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = direction === "rtl" ? "fa" : "en";
  }, [direction]);

  const toggleDirection = useCallback(() => {
    setDirection((prev) => (prev === "ltr" ? "rtl" : "ltr"));
  }, []);

  const setDirectionTo = useCallback((dir: Direction) => {
    setDirection(dir);
  }, []);

  return { direction, setDirection: setDirectionTo, toggleDirection };
}

export default useDirection;
