import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToHashElement Component
 *
 * This component automatically scrolls the page to a specific element
 * whenever the current URL contains a hash (for example: #section1).
 * If the URL has no hash, it smoothly scrolls the page back to the top.
 *
 * Usage:
 * Place <ScrollToHashElement /> inside your Router (for example, in App.jsx)
 * so it can listen for route and hash changes across all pages.
 */
function ScrollToHashElement() {
  // useLocation gives the current route information including pathname, search, and hash.
  // Example output: { pathname: "/category", search: "", hash: "#desserts" }
  const { hash } = useLocation();

  useEffect(() => {
    // This effect runs every time the hash part of the URL changes.

    if (hash) {
      // If there is a hash value in the URL (e.g., #appetizers)

      // Use querySelector to find the element whose id matches the hash value.
      // The hash includes the "#" symbol, which is compatible with CSS ID selectors.
      const element = document.querySelector(hash);

      if (element) {
        // If the element exists, scroll the page smoothly to that element.
        element.scrollIntoView({ behavior: "smooth" });
      }
      // If the element is not found, nothing happens.
      // Optionally, you could log a warning for debugging purposes.
    } else {
      // If no hash is present in the URL, scroll smoothly to the top of the page.
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash]); // The effect depends on `hash`, so it runs whenever the URL hash changes.

  // This component does not render any HTML elements.
  // It only performs a side effect for scrolling behavior.
  return null;
}

export default ScrollToHashElement;
