function scrollKey(hash) {
  return "scrollPos:" + hash;
}

function showPage(restoreScroll) {
  const hash = window.location.hash || "#home";
  const pages = document.querySelectorAll(".page");
  let matched = false;

  pages.forEach((page) => {
    if ("#" + page.id === hash) {
      page.classList.add("active");
      matched = true;
    } else {
      page.classList.remove("active");
    }
  });

  // Fallback to home if hash doesn't match any section
  if (!matched) {
    document.getElementById("home").classList.add("active");
  }

  if (restoreScroll) {
    const saved = sessionStorage.getItem(scrollKey(matched ? hash : "#home"));
    if (saved !== null) {
      // Wait a tick so the newly-visible section has laid out first
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(saved, 10));
      });
    }
  }
}

// Save scroll position continuously (throttled) for the current section
let scrollSaveTimer = null;
window.addEventListener("scroll", () => {
  if (scrollSaveTimer) return;
  scrollSaveTimer = setTimeout(() => {
    const hash = window.location.hash || "#home";
    sessionStorage.setItem(scrollKey(hash), window.scrollY);
    scrollSaveTimer = null;
  }, 100);
});

// Save scroll position right before the page unloads (covers refresh/close)
window.addEventListener("beforeunload", () => {
  const hash = window.location.hash || "#home";
  sessionStorage.setItem(scrollKey(hash), window.scrollY);
});

window.addEventListener("hashchange", () => showPage(false));
window.addEventListener("DOMContentLoaded", () => showPage(true));

// Back to top button
const backToTopBtn = document.getElementById("back-to-top");
const BACK_TO_TOP_THRESHOLD = 300; // px scrolled before button appears

function updateBackToTopVisibility() {
  if (window.scrollY > BACK_TO_TOP_THRESHOLD) {
    backToTopBtn.classList.add("visible");
  } else {
    backToTopBtn.classList.remove("visible");
  }
}

window.addEventListener("scroll", updateBackToTopVisibility);
window.addEventListener("DOMContentLoaded", updateBackToTopVisibility);

backToTopBtn.addEventListener("click", () => {
  // Temporarily disable smooth scrolling so this jump is instant,
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previous;
});
