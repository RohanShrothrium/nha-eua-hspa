package com.example.patientdemo

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class SearchResponse(
    @SerializedName("fulfillments") val fulfillments: List<List<FulfillmentResponse>>? = null,
    @SerializedName("items") val items: List<Item>? = null,
    @SerializedName("transaction_id") val transactionId: String? = null
) : Serializable

data class Agent(
    @SerializedName("gender") val gender: String? = null,
    @SerializedName("id") val id: String? = null,
    @SerializedName("name") val name: String? = null,
    @SerializedName("tags") val tags: Tags? = null
) : Serializable

data class Tags(
    @SerializedName("@abdm/gov/in/education") val education: String? = null,
    @SerializedName("@abdm/gov/in/experience") val experience: String? = null,
    @SerializedName("@abdm/gov/in/first_consultation") val firstConsultation: String? = null,
    @SerializedName("@abdm/gov/in/follow_up") val followUp: String? = null,
    @SerializedName("@abdm/gov/in/hpr_id") val hprId: String? = null,
    @SerializedName("@abdm/gov/in/lab_report_consultation") val labReportConsultation: String? = null,
    @SerializedName("@abdm/gov/in/languages") val languages: String? = null,
    @SerializedName("@abdm/gov/in/speciality") val speciality: String? = null,
    @SerializedName("@abdm/gov/in/upi_id") val upiId: String? = null
) : Serializable

data class Time(
    @SerializedName("time") val time: Timestamp? = null
) : Serializable

data class Item(
    @SerializedName("descriptor") val descriptor: Descriptor? = null,
    @SerializedName("fulfillment_id") val fulfillmentId: String?,
    @SerializedName("id") val id: String?,
    @SerializedName("price") val price: Price?
) : Serializable

data class Descriptor(
    @SerializedName("name") val name: String?
) : Serializable

data class Price(
    @SerializedName("currency") val currency: String?,
    @SerializedName("value") val value: String?
) : Serializable

data class FulfillmentResponse(
    @SerializedName("agent") val agent: Agent?,
    @SerializedName("end") val end: Time?,
    @SerializedName("id") val id: String?,
    @SerializedName("start") val start: Time?,
    @SerializedName("type") val type: String?,
    @SerializedName("item") val item: Item?
) : Serializable