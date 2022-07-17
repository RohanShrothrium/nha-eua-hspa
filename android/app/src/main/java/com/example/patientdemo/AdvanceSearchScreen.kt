package com.example.patientdemo

import android.app.TimePickerDialog
import android.content.Intent
import android.os.Bundle
import android.text.format.DateFormat
import android.util.Log
import android.view.View
import android.widget.TimePicker
import android.widget.Toast
import androidx.annotation.Nullable
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import com.example.patientdemo.databinding.AdvanceSearchBinding
import com.google.android.gms.common.api.Status
import com.google.android.libraries.places.api.Places
import com.google.android.libraries.places.api.model.Place
import com.google.android.libraries.places.api.model.TypeFilter
import com.google.android.libraries.places.api.net.PlacesClient
import com.google.android.libraries.places.widget.Autocomplete
import com.google.android.libraries.places.widget.AutocompleteActivity.RESULT_ERROR
import com.google.android.libraries.places.widget.AutocompleteSupportFragment
import com.google.android.libraries.places.widget.listener.PlaceSelectionListener
import com.google.android.libraries.places.widget.model.AutocompleteActivityMode
import java.text.SimpleDateFormat
import java.util.*


class AdvanceSearchScreen : AppCompatActivity() {

    private val PLACE_AUTOCOMPLETE_REQUEST_CODE = 1
    private var placesClient: PlacesClient? = null
    private var autocompleteFragment: AutocompleteSupportFragment? = null
    private lateinit var binding: AdvanceSearchBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = DataBindingUtil.setContentView(this, R.layout.advance_search)
        initListener()
    }

    private fun initListener(){


        var hour = 0
        var min = 0
        val calendar = Calendar.getInstance()
        val year = calendar.get(Calendar.YEAR)
        val month = calendar.get(Calendar.MONTH)
        val day = calendar.get(Calendar.DATE)
        var startDateTime = formatDate(Date())
        var endDateTime = formatDate(Date(Date().time + 10 * 60 * 60 * 1000))

        binding.confirm.setOnClickListener{

            val location = binding.location.editText?.text?.toString()?:""
            val type = binding.spinner.selectedItem?.toString()?:""
            val docName = binding.docName.editText?.text?.toString()?:""
            val docId = binding.docHpid.editText?.text?.toString()?:""
            val hospitalName = binding.hospital.editText?.text?.toString()?:""
            val exp = binding.exp.editText?.text?.toString()?:""
            val lang = binding.lang.editText?.text?.toString()?:""


            val searchEntity = AdvanceSearchEntity(
                location,
                "",
                docName,
                docId,
                hospitalName,
                exp,
                lang,
                type,
                startDateTime,
                endDateTime
            )

            goToLabBookingScreen(searchEntity)
        }

        binding.timer1.setOnClickListener { v: View? ->
            val timePickerDialog = TimePickerDialog(
                this,
                { view: TimePicker?, hourOfDay: Int, minute: Int ->

                    hour = hourOfDay
                    min = minute

                    calendar[year, month, day, hour] = minute
                    startDateTime = formatDate(calendar.time)

                    val dateAndroid = DateFormat.format("hh:mm aa", calendar).toString()
                    binding.timer1.text = dateAndroid
                }, 12, 0, false
            )
            timePickerDialog.updateTime(hour, min)
            timePickerDialog.show()
        }

        binding.timer2.setOnClickListener { v: View? ->
            val timePickerDialog = TimePickerDialog(
                this,
                { _: TimePicker?, hourOfDay: Int, minute: Int ->
                    hour = hourOfDay
                    min = minute
                    calendar[year, month, day, hour] = minute
                    endDateTime = formatDate(calendar.time)

                    val dateAndroid = DateFormat.format("hh:mm aa", calendar).toString()
                    binding.timer2.text = dateAndroid
                }, 12, 0, false
            )
            timePickerDialog.updateTime(hour, min)
            timePickerDialog.show()
        }
    }


    private fun formatDate(date: Date): String {
        val df = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val formattedDate = df.format(date)
        Log.d("sonusourav", "formatted date & time $formattedDate")
        return formattedDate
    }

    private fun goToLabBookingScreen(searchEntity: AdvanceSearchEntity) {
        val intent = Intent(this, DocAppointmentScreen::class.java)
        intent.putExtra("search", searchEntity)
        startActivity(intent)
    }

    private fun onSearchCalled() {
        // Set the fields to specify which types of place data to return.
        val fields: List<Place.Field> = listOf(
            Place.Field.ID,
            Place.Field.NAME,
            Place.Field.ADDRESS,
            Place.Field.LAT_LNG
        )
        // Start the autocomplete intent.
        val intent = Autocomplete.IntentBuilder(
            AutocompleteActivityMode.FULLSCREEN, fields
        ).setCountry("IN")
            .build(this)
        startActivityForResult(intent, PLACE_AUTOCOMPLETE_REQUEST_CODE)
    }

    private fun init() {
        if (!Places.isInitialized()) {
            Places.initialize(applicationContext, "AIzaSyA5UDPqCqZQiZtw17wBjjWr5cRBfZOE0p8");
        }

        // Create a new Places client instance.
        placesClient = Places.createClient(this)

        autocompleteFragment = supportFragmentManager.findFragmentById(R.id.place_autocomplete_fragment) as AutocompleteSupportFragment?
        autocompleteFragment?.setTypeFilter(TypeFilter.CITIES)

        autocompleteFragment?.setOnPlaceSelectedListener(object : PlaceSelectionListener {
            override fun onPlaceSelected(place: Place) {
                Toast.makeText(applicationContext, place.name, Toast.LENGTH_SHORT).show()
            }

            override fun onError(status: Status) {
                Log.d("sonusourav","error status ${status}")
                Toast.makeText(applicationContext, status.toString(), Toast.LENGTH_SHORT).show()
            }
        })
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, @Nullable data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == PLACE_AUTOCOMPLETE_REQUEST_CODE) {
            when (resultCode) {
                RESULT_OK -> {
                    val place = Autocomplete.getPlaceFromIntent(data!!)
                    Log.i("sonusourav", "Place: " + place.name + ", " + place.id + ", " + place.address)
                    Toast.makeText(
                        this,
                        "ID: " + place.id + "address:" + place.address + "Name:" + place.name + " latlong: " + place.latLng,
                        Toast.LENGTH_LONG
                    ).show()
                    val address = place.address
                    // do query with address
                }
                RESULT_ERROR -> {
                    val status = data?.let { Autocomplete.getStatusFromIntent(it) }
                    Toast.makeText(
                        this,
                        "Error: " + status?.statusMessage,
                        Toast.LENGTH_LONG
                    ).show()
                    Log.i("sonusourav", "${status?.statusMessage}")
                }
                RESULT_CANCELED -> {
                    // The user canceled the operation.
                }
            }
        }
    }
}