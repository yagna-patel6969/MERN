// Theme Management - Dark/Light Mode Toggle

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "dark";
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.setupToggleButton();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.theme = theme;
    localStorage.setItem("theme", theme);
    this.updateToggleButton();
  }

  toggleTheme() {
    const newTheme = this.theme === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);
  }

  setupToggleButton() {
    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => this.toggleTheme());
    }
  }

  updateToggleButton() {
    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      toggleBtn.textContent = this.theme === "dark" ? "☀️" : "🌙";
      toggleBtn.setAttribute(
        "aria-label",
        `Switch to ${this.theme === "dark" ? "light" : "dark"} mode`,
      );
    }
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();
