import { useEffect, useState } from "react";

/**
 * useActiveSection - Returns the id of the section currently under the navbar
 */
export const useActiveSection = (ids: readonly string[], offset = 140) => {
  const [active, setActive] = useState("");
  const key = ids.join("|");

  useEffect(() => {
    const update = () => {
      let current = "";

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) current = id;
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom && ids.length > 0) current = ids[ids.length - 1];

      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, offset]);

  return active;
};

export default useActiveSection;
