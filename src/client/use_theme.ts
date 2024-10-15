/**
 * Automatic Dark Mode Switching
 * Allows to save/load from localstorage as well as the system default
 */
export default function use_theme() {
  // make "css media query"
  if (!localStorage.getItem("theme")) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTimeout(() => document.documentElement.classList.add("dark"), 0);
    } else {
      setTimeout(() => document.documentElement.classList.remove("dark"), 0);
    }
  }

  // For when theme actively changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches }) => {
      console.log("onChange Event", matches);
      if (localStorage.getItem("theme")) return;
      if (matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    });

  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
