package com.example.patientdemo

import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.patientdemo.databinding.ActivityConfirmPaymentBinding
import com.google.gson.Gson
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ABHPConfirmPayment : AppCompatActivity() {

    private var invoiceAdapter: InvoiceAdapter? = null
    private var paymentBreakUp: InitLabBookingResponse? = null
    private var bookingInfo: BookingRequest? = null
    private var binding: ActivityConfirmPaymentBinding? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_confirm_payment)

        paymentBreakUp = intent.getSerializableExtra("paymentDetails") as? InitLabBookingResponse
        bookingInfo = intent.getSerializableExtra("bookingDetails") as? BookingRequest

        Log.d("sonusourav","payment ${Gson().toJson(paymentBreakUp)}")
        Log.d("sonusourav","booking ${Gson().toJson(bookingInfo)}")

        paymentBreakUp?.quote?.breakup?.let {
            val modifiedList = it.toMutableList()
                .apply { add(Breakup(price = paymentBreakUp?.quote?.price, title = "Total Amount")) }
            invoiceAdapter = InvoiceAdapter(modifiedList)
            binding?.invoiceRecylcerView?.layoutManager = LinearLayoutManager(this)
            binding?.invoiceRecylcerView?.adapter = invoiceAdapter
            invoiceAdapter?.notifyDataSetChanged()
        }

        bookingInfo?.let { initListeners(it) }
    }

    private fun initListeners(bookingRequest: BookingRequest) {
        binding?.completePayment?.setOnClickListener {
            binding?.progressLoader?.visibility = View.VISIBLE
            confirmPayment(bookingRequest)
        }

        binding?.cancelPayment?.setOnClickListener {
            goToDashBoard()
        }
    }

    private fun confirmPayment(bookingRequest: BookingRequest) {
        val call = Retrofit.EUAService.confirmBooking(bookingRequest)
        call.enqueue(object : Callback<ConfirmLabBookingResponse> {
            override fun onResponse(
                call: Call<ConfirmLabBookingResponse?>,
                response: Response<ConfirmLabBookingResponse>
            ) {
                binding?.progressLoader?.visibility = View.GONE
                binding?.animationView?.visibility = View.VISIBLE
                showToast("Payment successful")
                binding?.animationView?.playAnimation()

                Handler().postDelayed({
                    goToDashBoard()
                }, 6000)
            }

            override fun onFailure(call: Call<ConfirmLabBookingResponse?>, throwable: Throwable) {
                binding?.progressLoader?.visibility = View.GONE
                showToast("Something went wrong")
            }
        })
    }

    private fun showToast(message: String){
        Toast.makeText(this@ABHPConfirmPayment, message, Toast.LENGTH_SHORT).show()
    }

    private fun goToDashBoard() {
        val intent = Intent(applicationContext, PatientDashboard::class.java)
        intent.putExtra("UserName", PatientDashboard.UserName)
        startActivity(intent)
        finish()
    }

    override fun onBackPressed() {
        val dialog = AlertDialog.Builder(this)
        dialog.setTitle("Cancel Payment")
        dialog.setMessage("Do you want to cancel Payment?")

        dialog.setPositiveButton("Yes") { dialog1: DialogInterface?, which: Int ->
            goToDashBoard()
        }
        dialog.setNegativeButton("No") { dialog12: DialogInterface?, which: Int -> }
        dialog.show()
    }

}