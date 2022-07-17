package com.example.patientdemo

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.res.ResourcesCompat
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.GridLayoutManager
import com.example.patientdemo.databinding.AbhpBookAppointmentBinding
import com.google.gson.Gson
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ABHPBookAppointment : AppCompatActivity() {
    var adapter: SlotsAdapter? = null

    private lateinit var binding: AbhpBookAppointmentBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.abhp_book_appointment)

        binding = DataBindingUtil.setContentView(this, R.layout.abhp_book_appointment)

        val labBooking = intent.getSerializableExtra("booking") as? LabBooking
        val type = intent.getStringExtra("type")

        val docDetails = labBooking?.fulfillment?.get(0)?.agent
        val comps = docDetails?.name?.split("-")
        val doctorName = if(comps!=null && comps.size > 1) comps[1] else (comps?.get(0)?:"")

        binding.drAppName.text = doctorName
        binding.drAppExp.text = docDetails?.tags?.experience
        binding.drAppDegree.text = docDetails?.tags?.education
        binding.drAppPlace.text = docDetails?.tags?.speciality

        if(type.equals("labTest")){
            binding.drAppImg.setImageDrawable(ResourcesCompat.getDrawable(this.resources, R.drawable.ic_lab_tests, null))
            binding.drAppName.visibility = View.GONE
            binding.yearExp.visibility = View.GONE
            binding.drAppDegree.visibility = View.GONE
            binding.drAppPlace.visibility = View.GONE
        }

        labBooking?.let {
            initListeners(labBooking.transactionId)
        }

        labBooking?.fulfillment?.let {
            adapter = SlotsAdapter(this, it)
            val manager = GridLayoutManager(this, 3)
            binding.slotTimings.layoutManager = manager
            binding.slotTimings.adapter = adapter
        }
    }

    private fun initListeners(transactionId: String?) {
        binding.drAppBtn.setOnClickListener { v: View? ->

            val selectedSlot = adapter?.getSelectedSlot()
            selectedSlot?.let {
                binding.progressLoader.visibility = View.VISIBLE
                initializeBooking(BookingRequest(it, transactionId))
            }
        }
    }

    private fun initializeBooking(bookingRequest: BookingRequest) {
        val call = Retrofit.EUAService.initBooking(bookingRequest)
        call.enqueue(object : Callback<InitLabBookingResponse> {
            override fun onResponse(
                call: Call<InitLabBookingResponse?>,
                response: Response<InitLabBookingResponse>
            ) {

                binding.progressLoader.visibility = View.GONE
                response.body()?.let {

                    Log.d("sonusourav","payment in book appointment ${Gson().toJson(it)}")
                    goToPaymentsPage(bookingRequest, it)
                } ?: onFailure(call, Throwable("Booking failed"))
            }

            override fun onFailure(call: Call<InitLabBookingResponse?>, throwable: Throwable) {
                binding.progressLoader.visibility = View.GONE
            }
        })
    }

    private fun goToPaymentsPage(bookingRequest: BookingRequest, payment: InitLabBookingResponse) {
        val intent = Intent(applicationContext, ABHPConfirmPayment::class.java)
        intent.putExtra("bookingDetails", bookingRequest)
        intent.putExtra("paymentDetails", payment)
        startActivity(intent)
        finish()
    }

    // ---------------------------- NAVIGATION BAR ---------------------------- //
    fun ClickMenu(view: View?) {
        PatientDashboard.openDrawer(binding.drawerLayout)
    }

    fun ClickLogo(view: View?) {
        PatientDashboard.closeDrawer(binding.drawerLayout)
    }

    fun ClickHome(view: View?) {
        PatientDashboard.redirectActivity(this, PatientDashboard::class.java)
    }

    fun ClickUpdateProfile(view: View?) {
        PatientDashboard.redirectActivity(this, UpdateProfilePatient::class.java)
    }

    fun ClickLogout(view: View?) {
        PatientDashboard.logout(this)
    }

    override fun onPause() {
        super.onPause()
        PatientDashboard.closeDrawer(binding.drawerLayout)
    } // ----------------------------------------------------------------------- //
}