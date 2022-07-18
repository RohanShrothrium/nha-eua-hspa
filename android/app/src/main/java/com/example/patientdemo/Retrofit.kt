package com.example.patientdemo

import android.util.Log
import com.google.gson.GsonBuilder
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import okio.Buffer
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object Retrofit {

    private const val BASE_URL = "https://f0ee-122-162-231-10.in.ngrok.io/"

    val gson = GsonBuilder()
        .setLenient()
        .create()

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .client(buildClient())
            .build()
    }

    val EUAService: EUAService by lazy {
        retrofit.create(com.example.patientdemo.EUAService::class.java)
    }

    private fun buildClient(): OkHttpClient {
        val builder = OkHttpClient.Builder()
        val logging = HttpLoggingInterceptor()
        logging.setLevel(HttpLoggingInterceptor.Level.BASIC)
        logging.setLevel(HttpLoggingInterceptor.Level.BODY)
        logging.setLevel(HttpLoggingInterceptor.Level.HEADERS)
        builder.addInterceptor(logging)
        builder.addInterceptor(Interceptor { chain ->

            // Here, can add multiple headers as per your need.
            // If user session is valid it will execute if{} otherwise else{}
            val request = chain.request().newBuilder()
                .addHeader("Accept", "application/json").build()

            // This if{} is only to print the request body if you want to.
            if (request.body != null) {
                val buffer = Buffer()
                request.body?.writeTo(buffer)
                val body: String = buffer.readUtf8()
                Log.i("sonusourav", "intercept: Request Body: $body")
            }
            chain.proceed(request)
        })
        return builder.build()
    }
}