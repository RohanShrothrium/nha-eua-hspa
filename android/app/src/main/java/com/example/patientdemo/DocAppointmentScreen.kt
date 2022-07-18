package com.example.patientdemo

import com.example.patientdemo.Retrofit.EUAService
import androidx.appcompat.app.AppCompatActivity
import android.widget.TextView
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.patientdemo.databinding.ActivityDoctorListBinding
import com.google.gson.Gson
import java.text.SimpleDateFormat
import java.util.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DocAppointmentScreen : AppCompatActivity() {
    var labBookingListAdapter: DocAppointmentAdapter? = null
    private lateinit var binding: ActivityDoctorListBinding
    private var searchType: String? = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_doctor_list)

        UserName = intent.getStringExtra("UserName")
        binding.drawerLayout.findViewById<TextView>(R.id.nav_name).text = UserName

        val searchEntity = intent.getSerializableExtra("search") as? AdvanceSearchEntity
        searchType = intent.getStringExtra("searchType")?:""
        binding.title.text = when(searchType){
            "Ambulance" -> "Available Ambulances"
            "LabTest" -> "Available Labs"
            else -> "Available Doctors"
        }
        initAdapter()
        searchEntity?.let { searchLabs(it) }
    }

    private fun formatDate(date: Date): String {
        val df = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val formattedDate = df.format(date)
        Log.d("sonusourav", "formatted date & time $formattedDate")
        return formattedDate
    }

    private fun initAdapter(){
        binding.drCards.setHasFixedSize(true)
        binding.drCards.layoutManager = LinearLayoutManager(this)
    }

    private fun searchLabs(searchEntity: AdvanceSearchEntity) {
        val start = Timestamp("2022-07-06T06:41:36")
        val end = Timestamp("2022-07-18T23:59:59")

        val location = searchEntity.location?:""
        val docName = searchEntity.doctorName?:""
        val docId = searchEntity.doctorId?:""
        val hospital = searchEntity.hospital?:""
        val exp = searchEntity.experience?:5
        val lang = searchEntity.lang?:""
        val type = searchEntity.type?: "ENT"
        val speciality = searchEntity.speciality?: ""
        val startDateTime = searchEntity.startTime?: formatDate(Date())
        val endDateTime = searchEntity.endTime?: formatDate(Date(Date().time + 10 * 60 * 60 * 1000))

        val fulfillment = Fulfillment(
            name = docName,
            hpid = docId,
            speciality = speciality,
            language = lang,
            type = type,
            start = Timestamp(startDateTime),
            end = Timestamp(endDateTime)
        )
        val searchRequest = SearchRequest(Message(fulfillment))

        val call = EUAService.getAvailableLabs(searchRequest)
        call.enqueue(object : Callback<SearchResponse> {
            override fun onResponse(
                call: Call<SearchResponse>,
                response: Response<SearchResponse>
            ) {

                Log.d("sonusourav","inside onResponse")
                val searchResponse = response.body()

                Log.d("sonusourav","list ${Gson().toJson(searchResponse)}")

                searchResponse?.let { res ->
                    val labBookingList =
                        res.fulfillments?.mapIndexed { index, fulfillmentResponse ->
                            LabBooking(
                                fulfillmentResponse,
                                res.transactionId
                            )
                        }

                    Log.d("sonusourav","list size ${labBookingList?.size} ${Gson().toJson(labBookingList)}")
                    labBookingList?.let {
                        labBookingListAdapter = DocAppointmentAdapter(labBookingList, context = this@DocAppointmentScreen)
                        binding.drCards.adapter = labBookingListAdapter
                        binding.drCards.adapter?.notifyDataSetChanged()
                    }
                }
                binding.progressLoader.visibility = View.GONE

            }

            override fun onFailure(call: Call<SearchResponse>, throwable: Throwable) {
                binding.progressLoader.visibility = View.GONE
                Log.d("sonusourav", "inside onfailure")
                Log.d("sonusourav", throwable.toString())
            }
        })
    }

    // ---------------------------- NAVIGATION BAR ---------------------------- //
    fun ClickMenu(view: View?) {
        PatientDashboard.openDrawer(binding.drawerLayout)
    }

    fun ClickLogo(view: View?) {
        PatientDashboard.closeDrawer(binding.drawerLayout)
    }

    fun ClickHome(view: View?) {
        PatientDashboard.redirectActivity(this, PatientDashboard::class.java)
    }

    fun ClickUpdateProfile(view: View?) {
        PatientDashboard.redirectActivity(this, UpdateProfilePatient::class.java)
    }

    fun ClickLogout(view: View?) {
        PatientDashboard.logout(this)
    }

    override fun onPause() {
        super.onPause()
        PatientDashboard.closeDrawer(binding.drawerLayout)
    } // ----------------------------------------------------------------------- //

    companion object {
        private const val TAG = "sonusourav"
        var UserName: String? = null
    }
}