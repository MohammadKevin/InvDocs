@import "tailwindcss";

/* ===================================================
   Dark mode pakai class (diatur oleh next-themes)
   =================================================== */
@variant dark (&:where(.dark, .dark *));

/* ===================================================
   CSS Variables — Light & Dark
   =================================================== */
:root {
  /* Background */
  --background:        #ffffff;
  --background-subtle: #f9f9f9;
  --background-muted:  #f3f4f6;

  /* Foreground / Text */
  --foreground:        #111111;
  --foreground-muted:  #6b7280;
  --foreground-subtle: #9ca3af;

  /* Border */
  --border:            #e5e7eb;
  --border-strong:     #d1d5db;

  /* Brand */
  --primary:           #2563eb;
  --primary-hover:     #1d4ed8;
  --primary-fg:        #ffffff;

  /* Font */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

.dark {
  /* Background */
  --background:        #0a0a0a;
  --background-subtle: #111111;
  --background-muted:  #1a1a1a;

  /* Foreground / Text */
  --foreground:        #ededed;
  --foreground-muted:  #9ca3af;
  --foreground-subtle: #6b7280;

  /* Border */
  --border:            #262626;
  --border-strong:     #404040;

  /* Brand */
  --primary:           #3b82f6;
  --primary-hover:     #60a5fa;
  --primary-fg:        #ffffff;
}

/* ===================================================
   Tailwind v4 — daftarkan custom tokens
   =================================================== */
@theme inline {
  --color-background:        var(--background);
  --color-background-subtle: var(--background-subtle);
  --color-background-muted:  var(--background-muted);

  --color-foreground:        var(--foreground);
  --color-foreground-muted:  var(--foreground-muted);
  --color-foreground-subtle: var(--foreground-subtle);

  --color-border:            var(--border);
  --color-border-strong:     var(--border-strong);

  --color-primary:           var(--primary);
  --color-primary-hover:     var(--primary-hover);
  --color-primary-fg:        var(--primary-fg);

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

/* ===================================================
   Base styles
   =================================================== */
html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}