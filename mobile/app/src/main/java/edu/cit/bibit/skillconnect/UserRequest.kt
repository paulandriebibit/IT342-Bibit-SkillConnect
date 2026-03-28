package edu.cit.bibit.skillconnect


data class UserRequest(
    val firstname: String,
    val lastname: String,
    val email: String,
    val password: String
)