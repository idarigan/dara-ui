import { useEffect } from "react";
import { startGlowLayer } from "../components/shared/glowLayer";

/**
 * useGlowLayer - lets glows and shadows paint over every container
 *
 * Features:
 * - Starts one shared glow layer for the whole document
 * - Stops it when the last component using it unmounts
 * - Safe on the server and under StrictMode
 */
export function useGlowLayer() {
  useEffect(() => startGlowLayer(), []);
}

export default useGlowLayer;
