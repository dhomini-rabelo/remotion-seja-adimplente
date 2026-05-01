# Remotion Project Setup Guide

This guide covers the commands needed to set up, preview, and render this project with Remotion.

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- Git

Check your local versions:

```bash
node --version
npm --version
git --version
```

## Create the Remotion Project

If this repository does not already contain a Remotion app, scaffold one from the repository root and choose a template with TailwindCSS support:

```bash
npx create-video@latest
```

When prompted, choose a template that supports TailwindCSS, such as `Blank` or `Hello World`, and enable TailwindCSS.

If the current folder is not empty and the command refuses to scaffold into it, create the app in a temporary folder and move the generated files into this repository:

```bash
npx create-video@latest remotion-app
```

Then copy the generated project files from `remotion-app/` into the repository root.

## Install Dependencies

After the project files exist, install dependencies:

```bash
npm install
```

## Enable TailwindCSS

If TailwindCSS was enabled during scaffolding, skip this section.

For an existing Remotion project, install Tailwind v4 support:

```bash
npm install --save-dev @remotion/tailwind-v4 tailwindcss
```

Update `remotion.config.ts`:

```ts
import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind-v4';

Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});
```

Create `src/index.css`:

```css
@import 'tailwindcss';
```

Import the stylesheet at the top of `src/Root.tsx`:

```tsx
import './index.css';
```

If `package.json` contains `"sideEffects": false`, change it so CSS imports are preserved:

```json
{
  "sideEffects": ["*.css"]
}
```

## Start Remotion Studio

Run the local preview environment:

```bash
npm run dev
```

If the generated project does not include a `dev` script, use the Remotion CLI directly:

```bash
npx remotion studio
```

Remotion Studio opens a browser UI where you can preview compositions, scrub the timeline, and inspect props.

## Main Files

Common files in a blank Remotion project:

- `src/Root.tsx`: registers compositions.
- `src/Composition.tsx`: contains the main video component.
- `src/index.css`: imports TailwindCSS.
- `remotion.config.ts`: project-level Remotion configuration.
- `package.json`: scripts and dependencies.

## Add a Composition

Register compositions in `src/Root.tsx`:

```tsx
import {Composition} from 'remotion';
import './index.css';
import {Main} from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
```

For vertical ads, use `width={1080}` and `height={1920}`. For horizontal video, use `width={1920}` and `height={1080}`.

Use Tailwind classes in components:

```tsx
export const Main: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-950 text-white">
      <h1 className="text-7xl font-bold">Seja Adimplente</h1>
    </div>
  );
};
```

For animation, prefer Remotion primitives such as `useCurrentFrame()`, `interpolate()`, and `spring()` instead of Tailwind `animate-*` or `transition-*` classes.

## Render a Video

Render the `Main` composition:

```bash
npx remotion render Main out/main.mp4
```

Render with explicit codec settings:

```bash
npx remotion render Main out/main.mp4 --codec=h264 --crf=18
```

## Render a Still Frame

Use a still render to quickly check layout, colors, and timing:

```bash
npx remotion still Main --frame=30 --scale=0.25 out/frame-30.png
```

At 30 FPS, frame `30` is the one-second mark.

## Build and Validate

Run TypeScript and lint checks if the generated project includes these scripts:

```bash
npm run typecheck
npm run lint
```

If those scripts are not present, inspect available scripts:

```bash
npm run
```

## Useful Remotion Commands

```bash
npx remotion studio
npx remotion compositions
npx remotion still Main --frame=30 out/frame-30.png
npx remotion render Main out/main.mp4
npx remotion render Main out/main.webm --codec=vp8
```

## Suggested Workflow

1. Start Studio with `npm run dev` or `npx remotion studio`.
2. Edit the composition in `src/Composition.tsx`.
3. Register or adjust compositions in `src/Root.tsx`.
4. Render a still frame with `npx remotion still`.
5. Render the final MP4 with `npx remotion render`.

## Troubleshooting

If dependencies fail to install, clear the local install and retry:

```bash
rm -rf node_modules package-lock.json
npm install
```

If Studio starts but the composition is blank, verify that:

- The composition ID passed to render matches the ID in `src/Root.tsx`.
- `durationInFrames`, `fps`, `width`, and `height` are set.
- The component registered in `src/Root.tsx` returns visible content.

If rendering fails because of browser or codec issues, update Remotion packages:

```bash
npm install remotion@latest @remotion/cli@latest @remotion/renderer@latest
```

If Tailwind classes do not apply, verify that:

- `@remotion/tailwind-v4` and `tailwindcss` are installed.
- `enableTailwind()` is configured in `remotion.config.ts`.
- `src/index.css` contains `@import 'tailwindcss';`.
- `src/index.css` is imported in `src/Root.tsx`.
