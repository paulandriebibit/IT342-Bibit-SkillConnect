package edu.cit.bibit.skillconnect

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val btnRegister = findViewById<Button>(R.id.btnRegister)
        val tvGoBack = findViewById<TextView>(R.id.tvGoBackToLogin)

        // NAVIGATION: Closes this screen to go back to Login
        tvGoBack.setOnClickListener { finish() }

        btnRegister.setOnClickListener {
            val user = UserRequest(
                firstname = findViewById<EditText>(R.id.etFirstname).text.toString(),
                lastname = findViewById<EditText>(R.id.etLastname).text.toString(),
                email = findViewById<EditText>(R.id.etEmail).text.toString(),
                password = findViewById<EditText>(R.id.etPassword).text.toString()
            )

            // API CALL: Sends User object to Spring Boot /register
            RetrofitClient.instance.registerUser(user).enqueue(object : Callback<String> {
                override fun onResponse(call: Call<String>, response: Response<String>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@RegisterActivity, "Account Created!", Toast.LENGTH_SHORT).show()
                        finish() // Return to login screen automatically
                    } else {
                        Toast.makeText(this@RegisterActivity, "Registration Failed", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<String>, t: Throwable) {
                    Toast.makeText(this@RegisterActivity, "Network Error", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }
}