package com.example.patientdemo

import android.app.Activity
import android.graphics.Color
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.core.content.res.ResourcesCompat
import androidx.recyclerview.widget.RecyclerView
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.*

class SlotsAdapter(
    private var activity: Activity,
    var labBookingsList: List<FulfillmentResponse>
) : RecyclerView.Adapter<SlotsAdapter.SlotsViewHolder>() {

    private var lastSelectedPosition = -1

    override fun onBindViewHolder(holder: SlotsViewHolder, position: Int) {
        val pos = position
        val slot = labBookingsList[pos]
        val start = slot.start?.time?.timestamp?.let { convertToHourFormat(it) }
        val end = slot.end?.time?.timestamp?.let { convertToHourFormat(it) }
        holder.slotTime.text = "$start - $end"

        Log.d("sonusourav","pos = $pos start $start end = $end")

        holder.slotTime.setOnClickListener {

            lastSelectedPosition = if (pos == lastSelectedPosition) {
                -1
            } else {
                pos
            }
            notifyDataSetChanged()
        }

        if(pos == lastSelectedPosition){
            selectSlot(holder.slotTime)
        }else{
            unselectSlot(holder.slotTime)
        }
    }

    private fun unselectSlot(slot: TextView){
        slot.background = ContextCompat.getDrawable(
            activity,
            R.drawable.rectangle_outline
        )

        slot.setTextColor(ResourcesCompat.getColor(activity.resources, R.color.colorTextSecondary, null))
    }

    private fun selectSlot(slot: TextView){
        slot.background = ContextCompat.getDrawable(activity, R.drawable.rectangle_fill)
        slot.setTextColor(Color.WHITE)
    }

    private fun convertToHourFormat(date: String): String? {
        var modifiedDate = date
        val originalFormat: DateFormat = if(date.startsWith("T")) {
            modifiedDate = date.split("+")[0]
            SimpleDateFormat("'T'HH:mm", Locale.ENGLISH)
        }
        else
            SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.ENGLISH)

        Log.d("sonusourav","date $modifiedDate")

        val targetFormat: DateFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())
        val parsedDate = originalFormat.parse(modifiedDate)
        return parsedDate?.let { targetFormat.format(it) }
    }

    fun getSelectedSlot(): FulfillmentResponse? {
        Log.d("sonusourav", "selected position $lastSelectedPosition")
        return if (lastSelectedPosition != -1) labBookingsList[lastSelectedPosition] else null
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SlotsViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.slot_design, parent, false)
        return SlotsViewHolder(view)
    }

    override fun getItemCount(): Int {
        return labBookingsList.size
    }

    class SlotsViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val slotTime: TextView = itemView.findViewById(R.id.text_view)
    }

}