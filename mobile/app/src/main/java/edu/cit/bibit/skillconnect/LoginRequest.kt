package edu.cit.bibit.skillconnect

data class LoginRequest(
    val email: String,
    val password: String
) {
    fun isValid(): Boolean {
        return email.isNotBlank() && password.isNotBlank()
    }
}