package edu.cit.bibit.skillconnect.features.main

import android.os.Bundle
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import edu.cit.bibit.skillconnect.R
import edu.cit.bibit.skillconnect.features.common.BookingResponse
import edu.cit.bibit.skillconnect.features.common.RetrofitClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class BookingsActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var tvEmptyPlaceholder: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_bookings)

        recyclerView = findViewById(R.id.rvBookings)
        tvEmptyPlaceholder = findViewById(R.id.tvEmptyStatePlaceholder)
        recyclerView.layoutManager = LinearLayoutManager(this)

        findViewById<View>(R.id.btnBack).setOnClickListener {
            finish()
        }

        loadUserBookingHistory()
    }

    private fun loadUserBookingHistory() {
        val prefs = getSharedPreferences("SkillConnectPrefs", MODE_PRIVATE)
        val userId = prefs.getLong("USER_ID", -1L)

        if (userId == -1L) return

        RetrofitClient.instance.getMyBookings(userId).enqueue(object : Callback<List<BookingResponse>> {
            override fun onResponse(call: Call<List<BookingResponse>>, response: Response<List<BookingResponse>>) {
                if (response.isSuccessful && response.body() != null) {
                    val bookingsList = response.body()!!

                    if (bookingsList.isEmpty()) {
                        recyclerView.visibility = View.GONE
                        tvEmptyPlaceholder.visibility = View.VISIBLE
                    } else {
                        recyclerView.visibility = View.VISIBLE
                        tvEmptyPlaceholder.visibility = View.GONE
                        recyclerView.adapter = BookingAdapter(bookingsList, userId) { booking, newStatus ->
                            updateStatus(booking.id, newStatus)
                        }
                    }
                } else {
                    Toast.makeText(this@BookingsActivity, "Server data format error", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<BookingResponse>>, t: Throwable) {
                Toast.makeText(this@BookingsActivity, "Network connection error", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun updateStatus(bookingId: Long, status: String) {
        val statusData = mapOf("status" to status)

        RetrofitClient.instance.updateBookingStatus(bookingId, statusData).enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@BookingsActivity, "Status updated to $status!", Toast.LENGTH_SHORT).show()
                    loadUserBookingHistory()
                } else {
                    Toast.makeText(this@BookingsActivity, "Failed to update swap status", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Toast.makeText(this@BookingsActivity, "Network error", Toast.LENGTH_SHORT).show()
            }
        })
    }
}