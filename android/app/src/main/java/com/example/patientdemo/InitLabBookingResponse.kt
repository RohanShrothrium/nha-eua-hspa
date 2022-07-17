package com.example.patientdemo

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class InitLabBookingResponse(
    @SerializedName("quote") val quote: Quote? = null
): Serializable

data class Quote(
    @SerializedName("breakup") val breakup: List<Breakup>? = null,
    @SerializedName("price") val price: Price? = null
): Serializable

data class Breakup(
    @SerializedName("price") val price: Price? = null,
    @SerializedName("title") val title: String? = null
): Serializable