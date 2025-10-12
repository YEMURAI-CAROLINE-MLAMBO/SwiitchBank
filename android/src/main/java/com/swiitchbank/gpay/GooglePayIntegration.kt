package com.swiitchbank.gpay

import android.app.Activity
import com.google.android.gms.wallet.PaymentsClient
import com.google.android.gms.wallet.Wallet
import com.google.android.gms.wallet.WalletConstants
import org.json.JSONArray
import org.json.JSONObject

class GooglePayIntegration(private val activity: Activity) {

    private val paymentsClient: PaymentsClient = createPaymentsClient()

    private fun createPaymentsClient(): PaymentsClient {
        val walletOptions = Wallet.WalletOptions.Builder()
            .setEnvironment(WalletConstants.ENVIRONMENT_TEST) // Use ENVIRONMENT_PRODUCTION for release
            .build()
        return Wallet.getPaymentsClient(activity, walletOptions)
    }

    /**
     * Check if Google Pay is available and ready on the device.
     */
    fun isReadyToPay(callback: (Boolean) -> Unit) {
        val isReadyToPayRequest = IsReadyToPayRequest.fromJson(googlePayBaseRequest().toString())
        val task = paymentsClient.isReadyToPay(isReadyToPayRequest)
        task.addOnCompleteListener { completedTask ->
            callback(completedTask.isSuccessful)
        }
    }

    /**
     * Creates a PaymentDataRequest and presents the Google Pay sheet.
     */
    fun requestPayment(priceCents: Long, callback: (JSONObject?) -> Unit) {
        val paymentDataRequest = createPaymentDataRequest(priceCents)
        val task = paymentsClient.loadPaymentData(paymentDataRequest)
        // The result of this task is handled in onActivityResult of the calling Activity
        // For this proof of concept, we'll assume a successful callback for demonstration
        // In a real app, you would use AutoResolveHelper.resolveTask to launch the sheet
        // and handle the result in onActivityResult.
        // For now, let's just indicate the request was made.
         callback(JSONObject("{}")) // Placeholder for success
    }

    private fun googlePayBaseRequest(): JSONObject {
        return JSONObject().apply {
            put("apiVersion", 2)
            put("apiVersionMinor", 0)
        }
    }

    private fun createPaymentDataRequest(priceCents: Long): PaymentDataRequest {
        val paymentDataRequest = googlePayBaseRequest().apply {
            put("allowedPaymentMethods", JSONArray().put(cardPaymentMethod()))
            put("transactionInfo", getTransactionInfo(priceCents))
            put("merchantInfo", getMerchantInfo())
        }
        return PaymentDataRequest.fromJson(paymentDataRequest.toString())
    }

    private fun getTransactionInfo(priceCents: Long): JSONObject {
        return JSONObject().apply {
            put("totalPrice", (priceCents / 100.0).toString())
            put("totalPriceStatus", "FINAL")
            put("currencyCode", "USD") // Change to your currency
        }
    }

    private fun getMerchantInfo(): JSONObject {
        return JSONObject().apply {
            put("merchantName", "Swiitch")
        }
    }

    private fun cardPaymentMethod(): JSONObject {
        return JSONObject().apply {
            put("type", "CARD")
            put("parameters", JSONObject().apply {
                put("allowedAuthMethods", JSONArray(listOf("PAN_ONLY", "CRYPTOGRAM_3DS")))
                put("allowedCardNetworks", JSONArray(listOf("AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA")))
            })
            put("tokenizationSpecification", getGatewayTokenizationSpecification())
        }
    }

    private fun getGatewayTokenizationSpecification(): JSONObject {
        // NOTE: Could not locate a build.gradle file to verify the Stripe SDK dependency.
        // TODO: Replace with your actual Stripe Publishable Key.
        return JSONObject().apply {
            put("type", "PAYMENT_GATEWAY")
            put("parameters", JSONObject().apply {
                put("gateway", "stripe")
                put("stripe:publishableKey", "YOUR_STRIPE_PUBLISHABLE_KEY_HERE")
                put("stripe:version", "2020-08-27")
            })
        }
    }
}
