# SoundLink — Android (Kotlin) RevenueCat Integration Guide

This guide provides the complete, production-ready implementation of **RevenueCat Purchases SDK v10.28.1** in Android using modern Kotlin, Coroutines, RevenueCat Paywalls, and Customer Center.

---

## 1. Gradle Dependencies

In your app-level `build.gradle.kts` (or `build.gradle`):

```kotlin
dependencies {
    // Core RevenueCat Purchases Android SDK
    implementation("com.revenuecat.purchases:purchases:10.28.1")

    // RevenueCat UI: Paywalls & Customer Center
    implementation("com.revenuecat.purchases:purchases-ui:10.28.1")

    // Android Coroutines Lifecycle
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.6")
    implementation("androidx.activity:activity-ktx:1.9.3")
}
```

In `AndroidManifest.xml`, make sure internet permission is declared:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

---

## 2. Initialize RevenueCat in your Application Class

Create or update your `SoundLinkApp.kt`:

```kotlin
package com.soundlink.app

import android.app.Application
import com.revenuecat.purchases.LogLevel
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.PurchasesConfiguration

class SoundLinkApp : Application() {

    override fun onCreate() {
        super.onCreate()

        // Enable debug logging for testing
        Purchases.logLevel = LogLevel.DEBUG

        // Configure RevenueCat with your API key
        Purchases.configure(
            PurchasesConfiguration.Builder(
                context = this,
                apiKey = "test_cooNYDJWVecmPYGSRCCzLelsbOf"
            ).build()
        )
    }
}
```

Remember to declare `android:name=".SoundLinkApp"` in your `AndroidManifest.xml` under `<application>`.

---

## 3. Subscription & Entitlement Manager (`SubscriptionManager.kt`)

A clean, modern repository/manager class handling entitlement checks for **`sounlink_pro`**, fetching offerings, and making purchases using Kotlin Coroutines:

```kotlin
package com.soundlink.app

import android.app.Activity
import com.revenuecat.purchases.CustomerInfo
import com.revenuecat.purchases.Package
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.PurchasesException
import com.revenuecat.purchases.awaitCustomerInfo
import com.revenuecat.purchases.awaitOfferings
import com.revenuecat.purchases.awaitPurchase
import com.revenuecat.purchases.awaitRestore
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

object SubscriptionManager {

    const val ENTITLEMENT_ID = "sounlink_pro"

    private val _isPro = MutableStateFlow(false)
    val isPro: StateFlow<Boolean> = _isPro.asStateFlow()

    private val _customerInfo = MutableStateFlow<CustomerInfo?>(null)
    val customerInfo: StateFlow<CustomerInfo?> = _customerInfo.asStateFlow()

    init {
        // Listen to real-time customer info changes (renewals, cancellations, refunds)
        Purchases.sharedInstance.updatedCustomerInfoListener = { info ->
            handleCustomerInfo(info)
        }
    }

    /**
     * Check if user is currently entitled to sounlink_pro
     */
    suspend fun checkProStatus(): Boolean {
        return try {
            val info = Purchases.sharedInstance.awaitCustomerInfo()
            handleCustomerInfo(info)
            _isPro.value
        } catch (e: PurchasesException) {
            false
        }
    }

    /**
     * Retrieve available packages (monthly, yearly, lifetime)
     */
    suspend fun getAvailablePackages(): List<Package> {
        return try {
            val offerings = Purchases.sharedInstance.awaitOfferings()
            offerings.current?.availablePackages ?: emptyList()
        } catch (e: PurchasesException) {
            emptyList()
        }
    }

    /**
     * Purchase a specific package
     */
    suspend fun purchasePackage(activity: Activity, rcPackage: Package): Result<CustomerInfo> {
        return try {
            val purchaseResult = Purchases.sharedInstance.awaitPurchase(activity, rcPackage)
            handleCustomerInfo(purchaseResult.customerInfo)
            Result.success(purchaseResult.customerInfo)
        } catch (e: PurchasesException) {
            Result.failure(e)
        }
    }

    /**
     * Restore previous purchases
     */
    suspend fun restorePurchases(): Result<CustomerInfo> {
        return try {
            val info = Purchases.sharedInstance.awaitRestore()
            handleCustomerInfo(info)
            Result.success(info)
        } catch (e: PurchasesException) {
            Result.failure(e)
        }
    }

    private fun handleCustomerInfo(info: CustomerInfo) {
        _customerInfo.value = info
        val hasPro = info.entitlements[ENTITLEMENT_ID]?.isActive == true
        _isPro.value = hasPro
    }
}
```

---

## 4. Presenting RevenueCat Paywall & Customer Center

RevenueCat v10 provides **Paywalls** and **Customer Center** out of the box with `purchases-ui`.

### A. In an Activity (`MainActivity.kt`):

```kotlin
package com.soundlink.app

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.revenuecat.purchases.ui.revenuecatui.CustomerCenterActivityLauncher
import com.revenuecat.purchases.ui.revenuecatui.PaywallActivityLauncher
import com.revenuecat.purchases.ui.revenuecatui.PaywallResult
import com.revenuecat.purchases.ui.revenuecatui.PaywallResultHandler
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity(), PaywallResultHandler {

    // 1. Paywall Launcher
    private lateinit var paywallLauncher: PaywallActivityLauncher

    // 2. Customer Center Launcher (Subscription management, cancellation, refunds)
    private lateinit var customerCenterLauncher: CustomerCenterActivityLauncher

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        paywallLauncher = PaywallActivityLauncher(this, this)
        customerCenterLauncher = CustomerCenterActivityLauncher(this)

        // Check entitlement on startup
        lifecycleScope.launch {
            val isPro = SubscriptionManager.checkProStatus()
            if (isPro) {
                // User has SoundLink Pro!
            }
        }
    }

    /**
     * Call this when user taps "Upgrade to SoundLink Pro"
     * It presents the Paywall only if the user does NOT already have the sounlink_pro entitlement!
     */
    fun showPaywallIfNeeded() {
        paywallLauncher.launchIfNeeded(requiredEntitlementIdentifier = SubscriptionManager.ENTITLEMENT_ID)
    }

    /**
     * Call this from settings to let users manage/cancel subscription or see invoices
     */
    fun showCustomerCenter() {
        customerCenterLauncher.launch()
    }

    /**
     * Handle Paywall outcome
     */
    override fun onActivityResult(result: PaywallResult) {
        when (result) {
            is PaywallResult.Purchased -> {
                Toast.makeText(this, "Welcome to SoundLink Pro!", Toast.LENGTH_SHORT).show()
                // Entitlement is automatically active and verified
            }
            is PaywallResult.Restored -> {
                Toast.makeText(this, "Purchases restored!", Toast.LENGTH_SHORT).show()
            }
            is PaywallResult.Cancelled -> {
                // User dismissed paywall
            }
            is PaywallResult.Error -> {
                Toast.makeText(this, "Error: ${result.error.message}", Toast.LENGTH_LONG).show()
            }
        }
    }
}
```

---

## 5. Jetpack Compose Implementation (Alternative)

If your app uses Jetpack Compose:

```kotlin
import androidx.compose.runtime.*
import com.revenuecat.purchases.ui.revenuecatui.PaywallDialog
import com.revenuecat.purchases.ui.revenuecatui.PaywallDialogOptions
import com.revenuecat.purchases.ui.revenuecatui.customercenter.CustomerCenter

@Composable
fun SoundLinkScreen() {
    var showPaywall by remember { mutableStateOf(false) }
    var showCustomerCenter by remember { mutableStateOf(false) }
    val isPro by SubscriptionManager.isPro.collectAsState()

    if (showPaywall) {
        PaywallDialog(
            PaywallDialogOptions.Builder()
                .setRequiredEntitlementIdentifier("sounlink_pro")
                .setDismissRequest { showPaywall = false }
                .build()
        )
    }

    if (showCustomerCenter) {
        CustomerCenter(
            onDismiss = { showCustomerCenter = false }
        )
    }
}
```

---

## 6. RevenueCat Dashboard Configuration

To match your products with the code:

1. **Create Entitlement**:
   - Identifier: **`sounlink_pro`**
   - Description: SoundLink Pro Access

2. **Add Products in RevenueCat**:
   - **`monthly`**: Product Type: Subscription (Duration: 1 Month)
   - **`yearly`**: Product Type: Subscription (Duration: 1 Year)
   - **`lifetime`**: Product Type: Non-Subscription / One-Time Purchase

3. **Attach to Entitlement**:
   - Attach all 3 products (`monthly`, `yearly`, `lifetime`) to the **`sounlink_pro`** entitlement.

4. **Default Offering Packages**:
   - Package: `$rc_monthly` $\rightarrow$ Product: `monthly`
   - Package: `$rc_annual` $\rightarrow$ Product: `yearly`
   - Package: `$rc_lifetime` $\rightarrow$ Product: `lifetime`
