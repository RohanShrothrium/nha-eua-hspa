package com.example.patientdemo

import android.app.Activity
import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class AmbulanceBookingAdapter(
    private val labBookingsList: List<LabBooking>,
    private val context: Activity,
    private val showProgress: (Boolean) -> Unit = {}
) : RecyclerView.Adapter<AmbulanceBookingAdapter.AmbulanceViewHolder>() {

    override fun onBindViewHolder(holder: AmbulanceViewHolder, position: Int) {
        val booking = labBookingsList[position]

        val doctorName = booking.fulfillment?.get(0)?.item?.descriptor?.name ?: "Ambulance KA092304"
        val price = booking.fulfillment?.get(0)?.item?.price?.value ?: "100"
        val cur = booking.fulfillment?.get(0)?.item?.price?.currency ?: "INR"

        holder.dr_name.text = doctorName
        holder.price.text = price
        holder.currency.text = cur

        holder.btn.setOnClickListener { v: View? ->
            showProgress(true)

            initializeBooking(BookingRequest(booking.fulfillment?.get(position), booking.transactionId))
        }
    }

    private fun initializeBooking(bookingRequest: BookingRequest) {
        val call = Retrofit.EUAService.initBooking(bookingRequest)
        call.enqueue(object : Callback<InitLabBookingResponse> {
            override fun onResponse(
                call: Call<InitLabBookingResponse?>,
                response: Response<InitLabBookingResponse>
            ) {

                showProgress(false)
                response.body()?.let {

                    Log.d("sonusourav","payment in book appointment ${Gson().toJson(it)}")
                    goToPaymentsPage(bookingRequest, it)
                } ?: onFailure(call, Throwable("Booking failed"))
            }

            override fun onFailure(call: Call<InitLabBookingResponse?>, throwable: Throwable) {
                showProgress(false)
            }
        })
    }

    private fun goToPaymentsPage(bookingRequest: BookingRequest, payment: InitLabBookingResponse) {
        val intent = Intent(context, ABHPConfirmPayment::class.java)
        intent.putExtra("bookingDetails", bookingRequest)
        intent.putExtra("paymentDetails", payment)
        context.startActivity(intent)
        context.finish()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AmbulanceViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.design_ambulance, parent, false)
        return AmbulanceViewHolder(view)
    }

    override fun getItemCount(): Int {
        return labBookingsList.size
    }

    class AmbulanceViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val dr_name: TextView = itemView.findViewById(R.id.dr_card_name)
        val price: TextView = itemView.findViewById(R.id.dr_card_price)
        val currency: TextView = itemView.findViewById(R.id.currency)
        var btn: Button = itemView.findViewById(R.id.book_btn)
    }
}