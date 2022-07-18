package com.example.patientdemo

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class BookingRequest(
    val fulfillment: FulfillmentResponse? = null,
    @SerializedName("transaction_id") val transactionId: String? = null
) : Serializable