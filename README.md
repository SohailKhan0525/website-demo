# Motion Foundry

A premium, open-source gallery of motion patterns for React and Next.js. Explore 50 effects, preview them in a contained stage, switch between light and dark preview surfaces, and copy a React starter, CSS accent, or install command.

## Features

- 50 searchable animation studies organized by category
- Detail pages with medium and large contained live previews
- Global light and dark theme plus an independent preview theme
- Copyable React, CSS, and install snippets
- Responsive layout, reduced-motion support, and accessible controls
- Next.js App Router, TypeScript, Motion for React, and custom CSS

## Run locally

1. Install Node.js 20 or newer.
2. Install packages with npm install.
3. Start the dev server with npm run dev.
4. Open http://localhost:3000.

## Deploy

Import this repository into Vercel. The framework is detected as Next.js automatically. No environment variables are required.

## Copy snippets

Open an animation, choose Component, CSS, or Install in the implementation panel, and use Copy. The React starter is built with Motion for React using the motion package. Some advanced ideas—such as shader distortion and spatial scenes—are represented as lightweight, browser-friendly starter treatments; use a WebGL renderer when you need physically accurate 3D or custom shaders.

## Contributing

Add new entries to src/app/animations.ts, add or refine the matching visual treatment in src/app/globals.css, and add a focused code recipe in src/app/components.tsx. Keep previews contained, avoid expensive always-running effects in the gallery grid, and respect reduced-motion preferences.

## License

MIT. See LICENSE.
