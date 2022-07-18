package com.example.patientdemo

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.patientdemo.DocAppointmentAdapter.BookingViewHolder

class DocAppointmentAdapter(
    private val labBookingsList: List<LabBooking>,
    private val context: Context
) : RecyclerView.Adapter<BookingViewHolder>() {

    override fun onBindViewHolder(holder: BookingViewHolder, position: Int) {
        val booking = labBookingsList[position]

        val comps = booking.fulfillment?.get(0)?.agent?.name?.split("-")
        val doctorName = if(comps!=null && comps.size > 1) comps[1] else (comps?.get(0)?:"")

        val exp = booking.fulfillment?.get(0)?.agent?.tags?.experience
        val price = booking.fulfillment?.get(0)?.item?.price?.value
        val degree = booking.fulfillment?.get(0)?.agent?.tags?.education
        val speciality = booking.fulfillment?.get(0)?.agent?.tags?.speciality

        holder.dr_name.text = doctorName
        holder.exp.text = exp
        holder.price.text = price
        holder.degree.text = degree
        holder.place.text = speciality

        holder.btn.setOnClickListener { v: View? ->
            val intent = Intent(context.applicationContext, ABHPBookAppointment::class.java)
            intent.putExtra("booking", booking)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            context.applicationContext.startActivity(intent)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BookingViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.design_doctor_list, parent, false)
        return BookingViewHolder(view)
    }

    override fun getItemCount(): Int {
        return labBookingsList.size
    }

    class BookingViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val dr_name: TextView = itemView.findViewById(R.id.dr_card_name)
        val exp: TextView = itemView.findViewById(R.id.dr_card_exp)
        val price: TextView= itemView.findViewById(R.id.dr_card_price)
        val degree: TextView = itemView.findViewById(R.id.dr_card_degree)
        val place: TextView = itemView.findViewById(R.id.dr_card_place)
        var btn: Button= itemView.findViewById(R.id.book_btn)
    }
}