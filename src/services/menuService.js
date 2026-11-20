import { menuItems } from "../data/menu.js";

// Abortable mock request: mirrors a real async request and clears its timer on cleanup.
export function loadMenu({ shouldFail = false, signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted)
      return reject(new DOMException("Request cancelled", "AbortError"));
    const timer = window.setTimeout(() => {
      signal?.removeEventListener("abort", cancel);
      if (shouldFail)
        reject(
          new Error(
            "The menu could not be loaded. Check the connection and try again.",
          ),
        );
      else resolve(menuItems.map((item) => ({ ...item })));
    }, 350);
    function cancel() {
      window.clearTimeout(timer);
      reject(new DOMException("Request cancelled", "AbortError"));
    }
    signal?.addEventListener("abort", cancel, { once: true });
  });
}
