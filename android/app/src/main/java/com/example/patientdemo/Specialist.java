package com.example.patientdemo;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.SearchView.OnQueryTextListener;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

public class Specialist extends AppCompatActivity {

    DrawerLayout drawerLayout;
    public static String UserName;

    RecyclerView docCards;
    RecyclerView.Adapter adapter;
    SpecialistAdapter.RecyclerViewClickListener listener;
    SearchView searchView;
    ImageView advanceControlImageView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_specialist);

        drawerLayout = findViewById(R.id.drawer_layout);
        UserName = getIntent().getStringExtra("UserName");
        searchView = findViewById(R.id.search_view);
        advanceControlImageView = findViewById(R.id.advance_search_iv);

        String searchType = getIntent().getStringExtra("searchType");
        boolean docType = searchType.equalsIgnoreCase("doctor");

        if(!docType) advanceControlImageView.setVisibility(View.GONE);
        initListeners(docType);
        docCards = findViewById(R.id.docCards);
        docCards();
    }

    private String formatDate(Date date) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
        String formattedDate = df.format(date);
        Log.d("sonusourav", "formatted date & time $formattedDate");
        return formattedDate;
    }

    private void initListeners(boolean isDocType){
        String startDateTime = formatDate(new Date());
        String endDateTime = formatDate(new Date((new Date()).getTime() + 10 * 60 * 60 * 1000));
        searchView.setOnQueryTextListener(new OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                Intent intent = new Intent(getApplicationContext(), DocAppointmentScreen.class);

                AdvanceSearchEntity searchEntity = new AdvanceSearchEntity(
                        "",
                        query,
                        "",
                        "",
                        "",
                        "1x",
                        "",
                        "",
                        startDateTime,
                        endDateTime
                );

                if(!isDocType) {
                    intent = new Intent(getApplicationContext(), AvailableLabsTestScreen.class);
                    String modifiedQuery = "Lab Booking "+query;

                    searchEntity = new AdvanceSearchEntity(
                            "",
                            "",
                            "",
                            "",
                            "",
                            "5",
                            "",
                            modifiedQuery,
                            startDateTime,
                            endDateTime
                    );
                }

                intent.putExtra("search", searchEntity);
                startActivity(intent);
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                return false;
            }
        });

        advanceControlImageView.setOnClickListener(v -> {
            goToAdvanceSearchScreen();
        });
    }

    public void goToAdvanceSearchScreen(){
        Intent intent = new Intent(this, AdvanceSearchScreen.class);
        startActivity(intent);
    }

    private void docCards() {
        docCards.setHasFixedSize(true);
        docCards.setLayoutManager(new LinearLayoutManager(this));

        ArrayList<com.example.patientdemo.SpecialistModel> CardLocations = new ArrayList<>();

        CardLocations.add(new SpecialistModel(R.drawable.cold_fever, "Cold, Cough and Fever",
                "For common health concerns", "Fever, Eye Infection, Stomach Ache, Headache"));
        CardLocations.add(new SpecialistModel(R.drawable.covid, "Covid Consultation",
                "Treatment of COVID-19", "Cough, Fever and Breathlessness"));
        CardLocations.add(new SpecialistModel(R.drawable.cardiology, "Cardiology",
                "For Heart and Blood pressure problems", "Chest pain, Heart pain, Cholesterol"));
        CardLocations.add(new SpecialistModel(R.drawable.child_development, "Child Development",
                "For development disorder in children", "Learning disability, Development delay"));
        CardLocations.add(new SpecialistModel(R.drawable.ic_ent, "ENT",
                "ENT specialists for Ear, Nose and Throat", "Earache, Bad breath, Swollen neck, Vertigo"));


        listener = (v, position) -> {
            Intent intent = new Intent(getApplicationContext(), DoctorList.class);
            intent.putExtra("title", CardLocations.get(position).getTitle());
            intent.putExtra("UserName", UserName);
            startActivity(intent);
        };
        adapter = new SpecialistAdapter(CardLocations, listener);
        docCards.setAdapter(adapter);
    }


    // ---------------------------- NAVIGATION BAR ---------------------------- //
    public void ClickMenu(View view) {
        PatientDashboard.openDrawer(drawerLayout);
    }

    public void ClickLogo(View view) {
        PatientDashboard.closeDrawer(drawerLayout);
    }

    public void ClickHome(View view) {
        PatientDashboard.redirectActivity(this, PatientDashboard.class);
    }

    public void ClickUpdateProfile(View view) {
        PatientDashboard.redirectActivity(this, UpdateProfilePatient.class);
    }

    public void ClickLogout(View view) {
        PatientDashboard.logout(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        PatientDashboard.closeDrawer(drawerLayout);
    }
    // ----------------------------------------------------------------------- //
}