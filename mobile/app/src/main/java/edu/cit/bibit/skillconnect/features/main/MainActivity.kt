package edu.cit.bibit.skillconnect.features.main

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import edu.cit.bibit.skillconnect.R
import edu.cit.bibit.skillconnect.features.auth.RegisterActivity
import edu.cit.bibit.skillconnect.features.auth.UserRequest
import edu.cit.bibit.skillconnect.features.common.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 1. Initialize UI Elements from XML
        val etEmail = findViewById<EditText>(R.id.etLoginEmail)
        val etPassword = findViewById<EditText>(R.id.etLoginPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val tvGoToRegister = findViewById<TextView>(R.id.tvGoToRegister)

        // 2. Navigation: Switch from Login Island to Register Island
        tvGoToRegister.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }

        // 3. Login Logic: Triggered when Login button is clicked
        btnLogin.setOnClickListener {
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            // Basic Validation
            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter both email and password", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Create the credentials Map (matches @RequestBody Map<String, String> in Java)
            val credentials = mapOf(
                "email" to email,
                "password" to password
            )

            // 4. API Call: Send to Spring Boot Logic Tier
            RetrofitClient.instance.loginUser(credentials).enqueue(object : Callback<UserRequest> {
                override fun onResponse(call: Call<UserRequest>, response: Response<UserRequest>) {
                    if (response.isSuccessful) {
                        // Success! Spring Boot sent "200 OK"
                        val user = response.body()
                        
                        // Save user session in SharedPreferences if user data is provided
                        if (user != null) {
                            val sharedPreferences = getSharedPreferences("SkillConnectPrefs", Context.MODE_PRIVATE)
                            sharedPreferences.edit().apply {
                                putLong("USER_ID", user.id)
                                putString("USER_FIRSTNAME", user.firstname)
                                putString("USER_LASTNAME", user.lastname)
                                putString("USER_EMAIL", user.email)
                                putString("USER_ROLE", user.role)
                                putString("USER_MAJOR", user.major)
                                apply()
                            }
                            Toast.makeText(this@MainActivity, "Welcome, ${user.firstname}!", Toast.LENGTH_LONG).show()
                        } else {
                            Toast.makeText(this@MainActivity, "Login Successful", Toast.LENGTH_SHORT).show()
                        }

                        // Navigate to DashboardActivity regardless of whether body is null (as long as 200 OK)
                        val intent = Intent(this@MainActivity, DashboardActivity::class.java)
                        startActivity(intent)
                        finish() // Close login screen
                    } else {
                        // Spring Boot sent "401 Unauthorized"
                        Toast.makeText(this@MainActivity, "Invalid Email or Password", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<UserRequest>, t: Throwable) {
                    // Backend is likely OFF or the IP 10.0.2.2 is wrong
                    Toast.makeText(this@MainActivity, "Server Error: Check if IntelliJ is running", Toast.LENGTH_LONG).show()
                }
            })
        }
    }
}