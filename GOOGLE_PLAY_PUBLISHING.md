# SoundLink — Google Play Store Publishing Guide

Your SoundLink app is now fully configured as an installable **Progressive Web App (PWA)** with a complete Web App Manifest, auto-updating service worker, and verified Android icon package.

---

## Step 1: Generate your Android App Bundle (`.aab`) with PWABuilder

1. Visit **[PWABuilder.com](https://www.pwabuilder.com/)**.
2. Enter your live app URL:
   ```
   https://ais-pre-myto3xudraxa7ojqletmiu-693203855468.europe-west1.run.app
   ```
   *(Or your custom domain if you have connected one).*
3. PWABuilder will audit the app — it will detect the manifest, icons, and service worker.
4. Click **"Package for Stores"** $\rightarrow$ **Android**.
5. Fill in the package details:
   - **Package ID**: `com.soundlink.studio` (or your preferred unique ID)
   - **App Name**: `SoundLink`
   - **Short Name**: `SoundLink`
   - **Version code**: `1`
   - **Version name**: `1.0.0`
   - **Display Mode**: `Standalone`
   - **Nav color / Status bar color**: `#10131a`
   - **Signing key**: Choose **Generate a new key** (make sure to download and save the `.keystore` / password safely).
6. Click **Generate** and download the resulting **`.aab` (Android App Bundle)** file.

---

## Step 2: Set up your Google Play Console Account

1. Go to **[play.google.com/console](https://play.google.com/console)**.
2. Sign in with your Google Account and pay the one-time $25 registration fee (if you haven't already).
3. Verify your developer identity as requested by Google Play.

---

## Step 3: Create the App in Google Play Console

1. In the console, click **Create app**.
2. **App details**:
   - **App name**: `SoundLink - Audio Engineering & Order Workspace`
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free (or Paid)
   - Check the Declarations & Terms boxes, then click **Create app**.

---

## Step 4: Complete Store Listing Information

Under **Grow** $\rightarrow$ **Store presence** $\rightarrow$ **Main store listing**:

- **Short description** (up to 80 characters):
  ```
  Billboard-quality audio mixing, mastering & escrow-protected stems workspace.
  ```
- **Full description**:
  ```
  SoundLink is the professional audio production workspace for artists, engineers, and producers.
  
  Features:
  • Milestone & Stem Delivery Tracking: Real-time progress on vocals, mixes, and master passes.
  • Interactive A/B Master Preview: Compare raw dry vocal stems with analog-mastered tracks with interactive waveform scrubbing.
  • SoundLink Escrow Protection: Funds are secured in escrow until you inspect and approve the final master deliverable.
  • Studio Task Checklist: Track Celemony Melodyne pitch correction, Neve 1073 EQ, LA-2A compression, and Dolby Atmos rendering.
  • Shared Workspace Files: High-res 24-bit WAV stems, instrumental references, and acapella packs.
  • Direct Studio Messaging: Real-time collaboration, timecode feedback pins, and voice notes.
  ```
- **App Icon**: 512 × 512 px PNG (located at `/public/pwa-512x512.png`).
- **Feature Graphic**: 1024 × 500 px JPEG or PNG.
- **Phone Screenshots**: Take 2–4 screenshots of the Order Workspace, A/B Player, and Shared Files tabs.

---

## Step 5: Complete Policy & Content Rating

Under **Policy** $\rightarrow$ **App content**:
- **Privacy Policy**: Provide a link to your privacy policy.
- **Target Audience & Content**: Select 13+ or General Audience.
- **IARC Content Rating Questionnaire**: Answer the short questionnaire (Utility / Music).
- **Financial Features / Digital Goods**: Specify if using external escrow or standard services.

---

## Step 6: Upload your `.aab` & Publish

1. Navigate to **Release** $\rightarrow$ **Production** (or **Closed Testing**).
2. Click **Create new release**.
3. Upload your signed `.aab` file from Step 1.
4. Add release notes:
   ```
   Initial release of SoundLink - Audio Engineering & Order Workspace.
   ```
5. Click **Save** $\rightarrow$ **Review release** $\rightarrow$ **Start rollout to Production**.

Google will review your application within 1 to 3 business days!
