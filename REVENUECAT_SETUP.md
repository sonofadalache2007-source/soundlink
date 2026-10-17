# RevenueCat Integration Guide for SoundLink

SoundLink is now integrated with the official **RevenueCat Web Billing SDK (`@revenuecat/purchases-js`)**.

---

## 1. Get Your RevenueCat Public API Key

1. Log in to your **[RevenueCat Dashboard](https://app.revenuecat.com/)**.
2. Select your project (or create a new project named **SoundLink**).
3. In the sidebar, navigate to **Project Settings** $\rightarrow$ **API Keys**.
4. Under **Web Billing**, generate or copy your public API key (it begins with `rcb_...`).

---

## 2. Configure Your Environment Variable

In your local `.env` file (or in your hosting provider's environment variables):

```env
VITE_REVENUECAT_PUBLIC_API_KEY="rcb_your_actual_revenuecat_key_here"
```

> **Note**: While no live key is set or during local development, SoundLink runs in **Sandbox/Test Mode**, allowing you to test the full checkout and entitlement unlock flow instantly.

---

## 3. Set Up Products & Offerings in RevenueCat

In your RevenueCat Dashboard:

1. Go to **Offerings** $\rightarrow$ **Default Offering**.
2. Add Packages matching the identifiers in SoundLink:
   - **`soundlink_pro_monthly`**: Subscription — $29.99/month (Entitlement: `pro_access`)
   - **`soundlink_studio_annual`**: Subscription — $249.00/year (Entitlement: `pro_access`)
   - **`billboard_master_escrow`**: One-Time Product — $150.00 (Entitlement: `order_sl_88492`)
3. Connect your payment gateway:
   - For Web/PWA: Enable **RevenueCat Web Billing** (powered by Stripe).
   - For Google Play: Connect your **Google Play Service Account** under **Project Settings** $\rightarrow$ **Integrations**.

---

## 4. Features Enabled

- **Services Screen**: Booking any studio package now initiates a RevenueCat checkout.
- **Profile Screen**: Includes a **SoundLink Pro Pass** banner allowing users to upgrade or manage their subscription.
- **Entitlement Unlocks**: Automatically applies 0% escrow fees, unlimited stems storage, and verified PRO badges upon purchase.
