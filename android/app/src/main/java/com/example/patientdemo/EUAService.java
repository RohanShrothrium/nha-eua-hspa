package com.example.patientdemo;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface EUAService {
    @POST("eua/hit_search")
    Call<SearchResponse> getAvailableLabs(@Body SearchRequest searchRequest);

    @POST("eua/hit_init")
    Call<InitLabBookingResponse> initBooking(@Body BookingRequest bookingRequest);

    @POST("eua/hit_confirm")
    Call<ConfirmLabBookingResponse> confirmBooking(@Body BookingRequest bookingRequest);
}
