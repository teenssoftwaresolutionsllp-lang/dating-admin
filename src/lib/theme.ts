export type AdminTheme = "dark" | "light";

const themeListeners = new Set<() => void>();

export function getThemeSnapshot(): AdminTheme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function getServerThemeSnapshot(): AdminTheme {
  return "dark";
}

export function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => themeListeners.delete(listener);
}

export function setAdminTheme(theme: AdminTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem("dating-admin-theme", theme);
  themeListeners.forEach((listener) => listener());
}

export function initializeAdminTheme() {
  const savedTheme = window.localStorage.getItem("dating-admin-theme");
  setAdminTheme(savedTheme === "light" ? "light" : "dark");
}
