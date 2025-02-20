interface AI {
  languageDetector?: unknown; // Change to actual type if known
  translator?: unknown;
  summarizer?: unknown;
}

declare global {
  interface Window {
    ai?: AI;
  }
}
