package com.example.patientdemo

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class LabBooking(
    val fulfillment: List<FulfillmentResponse>? = null,
    @SerializedName("transaction_id") val transactionId: String? = null
) : Serializable