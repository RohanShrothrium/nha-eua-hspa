package com.example.patientdemo

import android.app.Activity
import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.res.ResourcesCompat
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LabTestBookingAdapter(
    private val labBookingsList: List<LabBooking>,
    private val context: Activity,
    private val showProgress: (Boolean) -> Unit = {}
) : RecyclerView.Adapter<LabTestBookingAdapter.LabTestViewHolder>() {

    override fun onBindViewHolder(holder: LabTestViewHolder, position: Int) {
        val booking = labBookingsList[position]

        val doctorName = booking.fulfillment?.get(0)?.item?.descriptor?.name ?: "Thyroid Lab Test "
        val price = booking.fulfillment?.get(0)?.item?.price?.value ?: "100"
        val cur = booking.fulfillment?.get(0)?.item?.price?.currency ?: "INR"

        holder.dr_name.text = doctorName
        holder.price.text = price
        holder.currency.text = cur
        holder.cardImage.setImageDrawable(ResourcesCompat.getDrawable(context.resources, R.drawable.ic_lab_tests, null))
        holder.btn.text = "BOOK LAB TEST"

        holder.btn.setOnClickListener { v: View? ->
            showProgress(true)
            goToSlotBooking(booking)
        }
    }

    private fun goToSlotBooking(booking: LabBooking) {
        val intent = Intent(context.applicationContext, ABHPBookAppointment::class.java)
        intent.putExtra("booking", booking)
        intent.putExtra("type", "labTest")
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        context.applicationContext.startActivity(intent)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LabTestViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.design_ambulance, parent, false)
        return LabTestViewHolder(view)
    }

    override fun getItemCount(): Int {
        return labBookingsList.size
    }

    class LabTestViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val dr_name: TextView = itemView.findViewById(R.id.dr_card_name)
        val price: TextView = itemView.findViewById(R.id.dr_card_price)
        val currency: TextView = itemView.findViewById(R.id.currency)
        var btn: Button = itemView.findViewById(R.id.book_btn)
        val cardImage: ImageView = itemView.findViewById(R.id.dr_card_image)
    }
}