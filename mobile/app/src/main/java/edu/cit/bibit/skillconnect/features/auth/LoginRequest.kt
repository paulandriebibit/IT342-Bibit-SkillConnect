package edu.cit.bibit.skillconnect.features.auth

data class LoginRequest(
    val email: String,
    val password: String
) {
    fun isValid(): Boolean {
        return email.isNotBlank() && password.isNotBlank()
    }
}