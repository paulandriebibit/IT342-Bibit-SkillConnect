package edu.cit.bibit.skillconnect.features.main

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.bibit.skillconnect.R
import edu.cit.bibit.skillconnect.features.common.BookingResponse

class BookingAdapter(
    private val bookings: List<BookingResponse>,
    private val currentUserId: Long,
    private val onStatusUpdate: (BookingResponse, String) -> Unit
) : RecyclerView.Adapter<BookingAdapter.BookingViewHolder>() {

    class BookingViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvTitle: TextView = view.findViewById(R.id.tvBookingTitle)
        val tvStatus: TextView = view.findViewById(R.id.tvBookingStatus)
        val tvDetails: TextView = view.findViewById(R.id.tvBookingDetails)
        val layoutActions: LinearLayout = view.findViewById(R.id.layoutActionButtons)
        val btnAccept: Button = view.findViewById(R.id.btnAcceptBooking)
        val btnDecline: Button = view.findViewById(R.id.btnDeclineBooking)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BookingViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_booking_card, parent, false)
        return BookingViewHolder(view)
    }

    override fun onBindViewHolder(holder: BookingViewHolder, position: Int) {
        val booking = bookings[position]
        holder.tvTitle.text = booking.skillTitle
        holder.tvStatus.text = booking.status.uppercase()

        if (booking.providerId == currentUserId) {
            holder.tvDetails.text = "Received offer from: ${booking.requesterName}"

            if (booking.status.equals("PENDING", ignoreCase = true)) {
                holder.layoutActions.visibility = View.VISIBLE
            } else {
                holder.layoutActions.visibility = View.GONE
            }
        } else {
            holder.tvDetails.text = "Sent request to: ${booking.providerName}"
            holder.layoutActions.visibility = View.GONE
        }

        holder.btnAccept.setOnClickListener { onStatusUpdate(booking, "ACCEPTED") }
        holder.btnDecline.setOnClickListener { onStatusUpdate(booking, "DECLINED") }
    }

    override fun getItemCount() = bookings.size
}