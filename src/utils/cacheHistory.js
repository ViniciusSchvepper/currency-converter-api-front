const CACHE_KEY = "conversion_history";

export function saveToHistory(entry) {
  const history = JSON.parse(localStorage.getItem(CACHE_KEY)) || [];

  const newHistory = [entry, ...history].slice(0, 5);

  localStorage.setItem(CACHE_KEY, JSON.stringify(newHistory));
}

export function getHistory() {
  return JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
}
