package com.example.patientdemo

import java.io.Serializable

data class AdvanceSearchEntity constructor(
    val location: String? = null,
    val speciality: String? = null,
    val doctorName: String? = null,
    val doctorId: String? = null,
    val hospital: String? = null,
    val experience: String? = null,
    val lang: String? = null,
    val type: String? = null,
    val startTime: String? = null,
    val endTime: String? = null
) : Serializable