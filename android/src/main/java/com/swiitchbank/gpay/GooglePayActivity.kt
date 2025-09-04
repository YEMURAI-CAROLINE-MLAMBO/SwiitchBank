
package com.swiitchbank.gpay

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.Toast
import com.google.android.gms.wallet.AutoResolveHelper
import com.google.android.gms.wallet.PaymentData
import org.json.JSONObject

class GooglePayActivity : Activity() {

    private lateinit var googlePayIntegration: GooglePayIntegration
    private lateinit var googlePayButton: Button

    private val LOAD_PAYMENT_DATA_REQUEST_CODE = 991

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Set your layout file here, which should contain a Button with id 'googlePayButton'
        // setContentView(R.layout.activity_google_pay)

        googlePayIntegration = GooglePayIntegration(this)

        // googlePayButton = findViewById(R.id.googlePayButton)
        // googlePayButton.setOnClickListener { requestGooglePay() }

        // Check for Google Pay readiness on startup
        checkGooglePayReadiness()
    }

    private fun checkGooglePayReadiness() {
        googlePayIntegration.isReadyToPay {
            isReady ->
            if (isReady) {
                googlePayButton.visibility = View.VISIBLE
            } else {
                // Hide Google Pay button or show a message
            }
        }
    }

    private fun requestGooglePay() {
        // Replace with the actual price in cents
        val priceCents = 1000L
        googlePayIntegration.requestPayment(priceCents) { paymentDataRequest ->
            if (paymentDataRequest != null) {
                // This is where you would launch the Google Pay sheet.
                // In a real app, this would be a PaymentDataRequest object, and you would use
                // AutoResolveHelper to launch the payment sheet.
                val task = googlePayIntegration.paymentsClient.loadPaymentData(paymentDataRequest)
                AutoResolveHelper.resolveTask(task, this, LOAD_PAYMENT_DATA_REQUEST_CODE)
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == LOAD_PAYMENT_DATA_REQUEST_CODE) {
            when (resultCode) {
                Activity.RESULT_OK -> {
                    data?.let {
                        val paymentData = PaymentData.getFromIntent(it)
                        val paymentDataJson = paymentData?.toJson() ?: ""
                        val paymentDataObj = JSONObject(paymentDataJson)
                        // Handle the successful payment data
                        Log.d("GooglePayResult", paymentDataObj.toString())
                        Toast.makeText(this, "Payment Successful", Toast.LENGTH_LONG).show()
                    }
                }
                Activity.RESULT_CANCELED -> {
                    // The user canceled the payment
                    Toast.makeText(this, "Payment Canceled", Toast.LENGTH_LONG).show()
                }
                AutoResolveHelper.RESULT_ERROR -> {
                    val status = AutoResolveHelper.getStatusFromIntent(data)
                    // Handle the error
                    Log.w("GooglePayResult", "Error: ${status?.statusMessage}")
                }
            }
        }
    }
}
