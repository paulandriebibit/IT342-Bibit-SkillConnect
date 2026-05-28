package edu.cit.bibit.skillconnect.features.main

import android.content.Context
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import edu.cit.bibit.skillconnect.R

class ProfileSettingsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile_settings)

        val prefs = getSharedPreferences("SkillConnectPrefs", Context.MODE_PRIVATE)

        findViewById<TextView>(R.id.tvNameValue).text =
            "${prefs.getString("USER_FIRSTNAME", "")} ${prefs.getString("USER_LASTNAME", "")}"
        findViewById<TextView>(R.id.tvEmailValue).text = prefs.getString("USER_EMAIL", "")
        findViewById<TextView>(R.id.tvRoleValue).text = prefs.getString("USER_ROLE", "")
        findViewById<TextView>(R.id.tvMajorValue).text = prefs.getString("USER_MAJOR", "CCS")
    }
}