package edu.cit.bibit.skillconnect.features.auth

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import edu.cit.bibit.skillconnect.R
import edu.cit.bibit.skillconnect.features.common.RetrofitClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val etFirstname = findViewById<EditText>(R.id.etFirstname)
        val etLastname = findViewById<EditText>(R.id.etLastname)
        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val btnRegister = findViewById<Button>(R.id.btnRegister)
        val tvGoBack = findViewById<TextView>(R.id.tvGoBackToLogin)
        val spinnerMajor = findViewById<Spinner>(R.id.spinnerMajor)

        val majors = arrayOf("CCS", "CEA", "CASE", "CMBA")
        spinnerMajor.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, majors)

        tvGoBack.setOnClickListener { finish() }

        btnRegister.setOnClickListener {
            val firstName = etFirstname.text.toString().trim()
            val lastName = etLastname.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()
            val major = spinnerMajor.selectedItem?.toString() ?: ""

            if (firstName.isBlank() || lastName.isBlank() || email.isBlank() || password.isBlank() || major.isBlank()) {
                Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val request = RegisterRequest(
                firstname = firstName,
                lastname = lastName,
                email = email,
                password = password,
                major = major
            )

            RetrofitClient.instance.registerUser(request).enqueue(object : Callback<ResponseBody> {
                override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@RegisterActivity, "Account Created Successfully!", Toast.LENGTH_SHORT).show()
                        finish()
                    } else if (response.code() == 409) {
                        Toast.makeText(this@RegisterActivity, "Email already exists in system records", Toast.LENGTH_LONG).show()
                    } else {
                        Toast.makeText(this@RegisterActivity, "Registration failed, validation criteria mismatch", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Toast.makeText(this@RegisterActivity, "Network Error: Verify server host state", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }
}