# ColorBuddy 🎨 - Your AI Palette Magician

## The Idea

Finding the perfect color palette can be time-consuming, whether you're starting from scratch or trying to match an inspiring image. Checking if those colors work well together, especially for accessibility (WCAG contrast), adds another layer of complexity. And finally, translating that palette into usable code for your web project is yet another step.

**ColorBuddy aims to streamline this entire process.**

It's designed as a quick, intuitive tool for **designers and developers** who need beautiful, accessible, and ready-to-use color palettes *fast*.

**How it works:**

1.  **Get Inspired:** Upload an image that catches your eye, OR simply click the "Inspire Me" button to get a unique, AI-generated palette.
2.  **Instant Palette:** ColorBuddy analyzes the image (or uses AI) to extract/generate a harmonious set of 5-7 colors.
3.  **Accessibility First:** It automatically calculates the WCAG contrast ratios between key color pairs (e.g., for text on backgrounds), showing you immediately if they pass AA or AAA standards.
4.  **Code Ready:** Instantly copy the generated palette as ready-to-use **Tailwind CSS configuration** snippets or standard **CSS variables**. No more manual hex code typing!

**Core Features (MVP):**

*   🌈 Extract dominant colors from uploaded images.
*   💡 Generate random, aesthetically pleasing palettes using AI prompts (via "Inspire Me").
*   👀 Visualize the generated palette clearly.
*   ♿ Perform automatic WCAG 2.1 contrast checking between palette colors.
*   💻 Export palettes directly as Tailwind CSS `theme.extend.colors` configuration.
*   🎨 Export palettes as CSS custom properties (variables).
*   🖱️ Click-to-copy individual hex codes.

ColorBuddy wants to be the fastest bridge between color inspiration and practical implementation in your web projects.