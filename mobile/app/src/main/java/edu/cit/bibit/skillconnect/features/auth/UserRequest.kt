package edu.cit.bibit.skillconnect.features.auth

data class UserRequest(
    val firstname: String,
    val lastname: String,
    val email: String,
    val password: String
)