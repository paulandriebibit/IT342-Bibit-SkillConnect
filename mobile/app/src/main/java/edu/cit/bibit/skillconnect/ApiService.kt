package edu.cit.bibit.skillconnect

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("api/v1/auth/login")
    fun loginUser(@Body credentials: Map<String, String>): Call<String>


    @POST("api/v1/auth/register")
    fun registerUser(@Body user: UserRequest): Call<String>
}