package edu.cit.bibit.skillconnect.features.auth

data class RegisterRequest(
    val firstname: String,
    val lastname: String,
    val email: String,
    val password: String,
    val major: String,
    val role: String = "STUDENT"
)