package com.example.patientdemo

import com.google.gson.annotations.SerializedName

data class ConfirmLabBookingResponse(
    @SerializedName("payment") val payment: Payment? = null
)

data class Payment(
    @SerializedName("params") val params: Params? = null,
    @SerializedName("status") val status: String? = null,
    @SerializedName("tl_method") val tlMethod: String? = null,
    @SerializedName("type") val type: String? = null,
    @SerializedName("uri") val uri: String? = null
)

data class Params(
    @SerializedName("amount") val amount: String? = null,
    @SerializedName("mode") val mode: String? = null,
    @SerializedName("transaction_id") val transactionId: String? = null,
    @SerializedName("vpa") val vpa: String? = null
)