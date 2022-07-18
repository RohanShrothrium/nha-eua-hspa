package com.example.patientdemo

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class SearchRequest(
    @SerializedName("message") val message: Message? = null
) : Serializable

data class Message(
    @SerializedName("fulfillment") val fulfillment: Fulfillment? = null
) : Serializable

data class Fulfillment(
    @SerializedName("name") val name: String? = null,
    @SerializedName("hpid") val hpid: String? = null,
    @SerializedName("speciality") val speciality: String? = null,
    @SerializedName("language") val language: String? = null,
    @SerializedName("start") val start: Timestamp? = null,
    @SerializedName("end") val end: Timestamp? = null,
    @SerializedName("type") val type: String? = null
) : Serializable

data class Timestamp(
    @SerializedName("timestamp") val timestamp: String? = null
) : Serializable
