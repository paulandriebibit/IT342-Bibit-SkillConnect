package edu.cit.bibit.skillconnect.features.common

import edu.cit.bibit.skillconnect.features.auth.RegisterRequest
import edu.cit.bibit.skillconnect.features.auth.UserRequest
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.*

interface ApiService {
    @POST("api/v1/auth/login")
    fun loginUser(@Body credentials: Map<String, String>): Call<UserRequest>

    @POST("api/v1/auth/register")
    fun registerUser(@Body user: RegisterRequest): Call<ResponseBody>

    @GET("api/v1/skills")
    fun getAllSkills(): Call<List<SkillResponse>>

    @POST("api/v1/skills")
    fun createSkill(@Body skill: SkillRequest): Call<ResponseBody>

    @GET("api/v1/bookings/my-bookings/{userId}")
    fun getMyBookings(@Path("userId") userId: Long): Call<List<BookingResponse>>

    @PUT("api/v1/bookings/{id}/status")
    fun updateBookingStatus(
        @Path("id") id: Long,
        @Body statusData: Map<String, String>
    ): Call<ResponseBody>
}

data class SkillRequest(
    val title: String,
    val description: String,
    val category: String,
    val providerId: Long,
    val providerName: String
)

data class SkillResponse(
    val id: Long,
    val title: String,
    val description: String,
    val category: String,
    val providerId: Long,
    val providerName: String,
    val providerImage: String?
)

data class BookingResponse(
    val id: Long,
    val requesterId: Long,
    val requesterName: String,
    val providerId: Long,
    val providerName: String,
    val skillId: Long,
    val skillTitle: String,
    val status: String,
    val createdAt: String
)