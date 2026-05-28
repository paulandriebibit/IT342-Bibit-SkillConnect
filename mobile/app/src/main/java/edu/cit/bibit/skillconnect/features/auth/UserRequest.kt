package edu.cit.bibit.skillconnect.features.auth

data class UserRequest(
    val id: Long,
    val firstname: String,
    val lastname: String,
    val email: String,
    val role: String,
    val studentId: String?,
    val major: String?,
    val phone: String?,
    val bio: String?,
    val profileImage: String?
)