import { useEffect, useRef } from "react";

/** Progressive enhancement: content stays visible without JavaScript or with reduced motion. */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    root.querySelectorAll("[data-reveal]").forEach((element) => {
      if (element.getBoundingClientRect().bottom <= 0) return;
      element.classList.add("reveal-ready");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return ref;
}