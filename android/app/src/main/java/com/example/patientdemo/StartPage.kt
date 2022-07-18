package com.example.patientdemo

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import com.example.patientdemo.databinding.ActivityStartPageBinding

class StartPage : AppCompatActivity(), View.OnClickListener {
    private lateinit var binding: ActivityStartPageBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_start_page)

        setListeners()
    }

    private fun setListeners(){
        binding.patient.setOnClickListener(this)
        binding.doctor.setOnClickListener(this)
    }

    override fun onClick(v: View) {
        val intent = when (v) {
            binding.patient -> Intent(this@StartPage, PatientDashboard::class.java)
            else -> Intent(this@StartPage, DoctorDashboard::class.java)
        }

        startActivity(intent)
    }
}