# SoundLink — Audio Engineering & Order Workspace

[![Deploy SoundLink to GitHub Pages](https://github.com/your-username/soundlink/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-username/soundlink/actions/workflows/deploy.yml)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-1db954?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

**SoundLink** is an audio engineering and music production escrow workspace designed for recording artists, mixing engineers, and mastering suites. It bridges the gap between high-end digital audio workstations (DAWs) and collaborative marketplace ergonomics.

---

## Key Features

- **Order Workspace (#SL-88492)**:
  - Real-time studio order management with SoundLink Escrow protection ($150.00 USD secured).
  - Milestone tracker with countdown timers (`18h 42m remaining`) and criteria inspection.
- **Interactive A/B Deliverable Waveform Player**:
  - Synthesized real-time audio playback using the **Web Audio API**.
  - **Raw vs. Master A/B**: Instant acoustic comparison between raw unmastered vocal stems and analog-mastered tracks with stereo enhancement, true peak limiting, and harmonic excitation.
  - Interactive scrubbing, -10s / +10s seeking, and dynamic visualizer bars.
- **Shared Workspace Files**:
  - Multi-track stems (`Raw_Lead_Vocals_24bit.wav`, `Backing_Harmonies_Stems.zip`).
  - Inline playable reference preview (`Instrumental_Reference_Mix.mp3`).
  - "+ Add Stems" modal for drag-and-drop stem uploads.
- **Studio Task Checklist**:
  - Live progress counter (`4 of 5 Done`) tracking Celemony Melodyne pitch correction, Neve 1073 EQ, LA-2A compression, and Dolby Atmos binaural rendering.
- **Smart Escrow Deck**:
  - **Revision Request**: Timestamped markers (`01:24`) and affected stem checklist.
  - **Approve & Release**: Commercial rights transfer, producer tip selection, and instant escrow release.
- **Multi-Screen Navigation**:
  - **Explore**: Audio marketplace with featured engineers and demo audio players.
  - **Services**: Tiered packages (Single Master, Billboard Vocal Mix, Dolby Atmos 7.1.4).
  - **Messages**: Direct studio messaging with voice notes and timecode pins.
  - **Profile**: Persona switcher (Jaxson Drake / Marcus Vance), outboard gear specs, and escrow history.
- **Progressive Web App (PWA)**:
  - Installable directly to Android and iOS home screens.
  - Full standalone app experience without browser address bars.
  - Offline mode with automatic asset caching and connection status banner.

---

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4 (Obsidian modern studio design system)
- **Audio Engine**: Web Audio API (real-time synthesizer and A/B frequency DSP filtering)
- **Icons**: Google Material Symbols & Lucide Icons
- **PWA Tooling**: `vite-plugin-pwa` with Workbox caching
- **Build Tool**: Vite 8

---

## Local Development

```bash
# 1. Clone repository
git clone https://github.com/your-username/soundlink.git
cd soundlink

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Building for Production

```bash
npm run build
```

The production output will be generated in `dist/` with all PWA service workers and manifest files.

---

## Free Deployment to GitHub Pages

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Push this project to your GitHub repository on branch `main`.
2. In your repository on GitHub, navigate to:
   **Settings** $\rightarrow$ **Pages** $\rightarrow$ **Build and deployment** $\rightarrow$ **Source**: Select **GitHub Actions**.
3. Every push to `main` will automatically build and publish your app to:
   `https://<your-username>.github.io/soundlink/`
