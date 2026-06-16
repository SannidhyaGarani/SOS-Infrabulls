import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop - scroll the window to (0,0) whenever the route changes
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Use instant for route changes to feel like a new page
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
