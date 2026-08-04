import { useState, useEffect } from 'react';

/**
 * Custom hook: returns true when the given media query matches.
 * @param {string} query  e.g. '(max-width: 640px)'
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (e) => setMatches(e.matches);

    // Modern browsers
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
    } else {
      // Safari < 14
      mediaQueryList.addListener(listener);
    }

    // Sync immediately in case query changed between render and effect
    setMatches(mediaQueryList.matches);

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener);
      } else {
        mediaQueryList.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
