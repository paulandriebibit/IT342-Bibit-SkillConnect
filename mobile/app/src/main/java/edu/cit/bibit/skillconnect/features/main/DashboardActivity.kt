package edu.cit.bibit.skillconnect.features.main

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import edu.cit.bibit.skillconnect.R

class DashboardActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        findViewById<Button>(R.id.btnMarketplace).setOnClickListener {
            startActivity(Intent(this, MarketplaceActivity::class.java))
        }

        findViewById<Button>(R.id.btnBookings).setOnClickListener {
            startActivity(Intent(this, BookingsActivity::class.java))
        }

        findViewById<Button>(R.id.btnSettings).setOnClickListener {
            startActivity(Intent(this, ProfileSettingsActivity::class.java))
        }

        findViewById<Button>(R.id.btnLogout).setOnClickListener {
            val sharedPreferences = getSharedPreferences("SkillConnectPrefs", Context.MODE_PRIVATE)
            sharedPreferences.edit().clear().apply()
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }
    }
}