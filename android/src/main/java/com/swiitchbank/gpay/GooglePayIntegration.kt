package com.swiitchbank.gpay

import android.app.Activity
import com.google.android.gms.wallet.AutoResolveHelper
import com.google.android.gms.wallet.IsReadyToPayRequest
import com.google.android.gms.wallet.PaymentDataRequest
import com.swiitchbank.gpay.R
import com.google.android.gms.wallet.PaymentsClient
import com.google.android.gms.wallet.Wallet
import com.google.android.gms.wallet.WalletConstants
import org.json.JSONArray
import org.json.JSONObject

class GooglePayIntegration(private val activity: Activity) {

    val paymentsClient: PaymentsClient = createPaymentsClient()

    private fun createPaymentsClient(): PaymentsClient {
        val environment = if (activity.getString(R.string.google_pay_env) == "ENVIRONMENT_PRODUCTION") {
            WalletConstants.ENVIRONMENT_PRODUCTION
        } else {
            WalletConstants.ENVIRONMENT_TEST
        }
        val walletOptions = Wallet.WalletOptions.Builder()
            .setEnvironment(environment)
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
    fun requestPayment(priceCents: Long) {
        val paymentDataRequestJson = createPaymentDataRequest(priceCents)
        val request = PaymentDataRequest.fromJson(paymentDataRequestJson.toString())
        AutoResolveHelper.resolveTask(paymentsClient.loadPaymentData(request), activity, LOAD_PAYMENT_DATA_REQUEST_CODE)
    }

    private fun googlePayBaseRequest(): JSONObject {
        return JSONObject().apply {
            put("apiVersion", 2)
            put("apiVersionMinor", 0)
        }
    }

    private fun createPaymentDataRequest(priceCents: Long): JSONObject {
        val paymentDataRequest = googlePayBaseRequest().apply {
            put("allowedPaymentMethods", JSONArray().put(cardPaymentMethod()))
            put("transactionInfo", getTransactionInfo(priceCents))
            put("merchantInfo", getMerchantInfo())
        }
        return paymentDataRequest
    }

    private fun getTransactionInfo(priceCents: Long): JSONObject {
        return JSONObject().apply {
            put("totalPrice", (priceCents / 100.0).toString())
            put("totalPriceStatus", "FINAL")
            put("currencyCode", activity.getString(R.string.currency_code))
        }
    }

    private fun getMerchantInfo(): JSONObject {
        return JSONObject().apply {
            put("merchantName", activity.getString(R.string.merchant_name))
        }
    }

    private fun cardPaymentMethod(): JSONObject {
        val authMethods = activity.resources.getStringArray(R.array.auth_methods).toList()
        val cardNetworks = activity.resources.getStringArray(R.array.card_networks).toList()
        return JSONObject().apply {
            put("type", "CARD")
            put("parameters", JSONObject().apply {
                put("allowedAuthMethods", JSONArray(authMethods))
                put("allowedCardNetworks", JSONArray(cardNetworks))
            })
            put("tokenizationSpecification", getGatewayTokenizationSpecification())
        }
    }

    private fun getGatewayTokenizationSpecification(): JSONObject {
        // TODO: Ensure you have the Stripe SDK dependency in your build.gradle.
        // TODO: Replace with your actual Stripe Publishable Key.
        return JSONObject().apply {
            put("type", "PAYMENT_GATEWAY")
            put("parameters", JSONObject().apply {
                put("gateway", activity.getString(R.string.gateway_stripe))
                put("stripe:publishableKey", activity.getString(R.string.stripe_publishable_key))
                put("stripe:version", activity.getString(R.string.stripe_api_version))
            })
        }
    }

    companion object {
        const val LOAD_PAYMENT_DATA_REQUEST_CODE = 991
    }
}
