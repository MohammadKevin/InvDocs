@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --background-subtle: #f9f9f9;
  --background-muted: #f3f4f6;

  --foreground: #111111;
  --foreground-muted: #6b7280;
  --foreground-subtle: #9ca3af;

  --border: #e5e7eb;
  --border-strong: #d1d5db;

  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-fg: #ffffff;

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

.dark {
  --background: #0a0a0a;
  --background-subtle: #111111;
  --background-muted: #1a1a1a;

  --foreground: #ededed;
  --foreground-muted: #9ca3af;
  --foreground-subtle: #6b7280;

  --border: #262626;
  --border-strong: #404040;

  --primary: #3b82f6;
  --primary-hover: #60a5fa;
  --primary-fg: #ffffff;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}