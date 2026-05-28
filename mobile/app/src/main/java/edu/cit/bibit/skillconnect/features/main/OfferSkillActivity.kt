package edu.cit.bibit.skillconnect.features.main

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import edu.cit.bibit.skillconnect.R
import edu.cit.bibit.skillconnect.features.common.RetrofitClient
import edu.cit.bibit.skillconnect.features.common.SkillRequest
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

private const val TAG = "OfferSkillActivity"

class OfferSkillActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_offer_skill)

        val etTitle = findViewById<EditText>(R.id.etSkillTitle)
        val etDesc = findViewById<EditText>(R.id.etSkillDescription)
        val spinnerCategory = findViewById<Spinner>(R.id.spinnerCategory)
        val btnSubmit = findViewById<Button>(R.id.btnSubmitSkill)
        val btnCancel = findViewById<Button>(R.id.btnCancelOffer)

        val categories = arrayOf("Programming", "Design", "Marketing", "Business", "Languages")
        spinnerCategory.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, categories)

        btnCancel.setOnClickListener { finish() }

        btnSubmit.setOnClickListener {
            val title = etTitle.text.toString().trim()
            val description = etDesc.text.toString().trim()
            val category = spinnerCategory.selectedItem.toString()

            if (title.isEmpty() || description.isEmpty()) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val prefs = getSharedPreferences("SkillConnectPrefs", Context.MODE_PRIVATE)
            
            // Fallback for session keys
            var currentUserId = prefs.getLong("USER_ID", -1L)
            if (currentUserId == -1L) currentUserId = prefs.getLong("userId", -1L)

            var firstName = prefs.getString("USER_FIRSTNAME", "") ?: ""
            if (firstName.isEmpty()) firstName = prefs.getString("userName", "") ?: ""
            
            val lastName = prefs.getString("USER_LASTNAME", "") ?: ""
            val providerName = "$firstName $lastName".trim().ifEmpty { "Anonymous User" }

            if (currentUserId == -1L) {
                Toast.makeText(this, "Session expired. Please log in again.", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            Toast.makeText(this, "Posting to marketplace...", Toast.LENGTH_SHORT).show()

            val skillRequest = SkillRequest(
                title = title,
                description = description,
                category = category,
                providerId = currentUserId,
                providerName = providerName
            )

            RetrofitClient.instance.createSkill(skillRequest).enqueue(object : Callback<ResponseBody> {
                override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@OfferSkillActivity, "Skill posted successfully!", Toast.LENGTH_SHORT).show()
                        setResult(RESULT_OK)
                        finish()
                    } else {
                        val errorMsg = "Server error: ${response.code()}"
                        Toast.makeText(this@OfferSkillActivity, errorMsg, Toast.LENGTH_LONG).show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Toast.makeText(this@OfferSkillActivity, "Network Error: ${t.message}", Toast.LENGTH_LONG).show()
                }
            })
        }
    }
}