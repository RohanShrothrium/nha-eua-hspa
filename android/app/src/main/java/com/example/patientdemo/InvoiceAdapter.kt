package com.example.patientdemo

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class InvoiceAdapter(
    private val breakUpList: List<Breakup>
) : RecyclerView.Adapter<InvoiceAdapter.InvoiceViewHolder>() {

    override fun onBindViewHolder(holder: InvoiceViewHolder, position: Int) {
        val item = breakUpList[position]
        holder.desc.text = item.title
        holder.amount.text = "${item.price?.value?:0.0} ${item.price?.currency?:"INR"}"
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): InvoiceViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.invoice_item, parent, false)
        return InvoiceViewHolder(view)
    }

    override fun getItemCount(): Int {
        return breakUpList.size
    }

    class InvoiceViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val desc: TextView = itemView.findViewById(R.id.invoice_desc)
        val amount: TextView = itemView.findViewById(R.id.invoice_amount)
    }
}