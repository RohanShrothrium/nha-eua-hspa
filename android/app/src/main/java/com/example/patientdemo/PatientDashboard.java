package com.example.patientdemo;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class PatientDashboard extends AppCompatActivity {

    private static FirebaseAuth mAuth;
    public static String UserName;

    DrawerLayout drawerLayout;
    TextView nav_name;
    CardView book_doctor, active_appointments, book_lab_test, book_ambulance;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_patient_dashboard);

        mAuth = FirebaseAuth.getInstance();
        UserName = getIntent().getStringExtra("UserName");

        drawerLayout = findViewById(R.id.drawer_layout);
        nav_name = findViewById(R.id.nav_name);
        nav_name.setText(UserName);

        book_lab_test = findViewById(R.id.lab_test);
        book_doctor = findViewById(R.id.book_doctor);
        active_appointments = findViewById(R.id.active_appointments);
        book_ambulance = findViewById(R.id.lab_ambulance);

        book_lab_test.setOnClickListener(v -> {
            Intent intent = new Intent(getApplicationContext(), Specialist.class);
            intent.putExtra("UserName", UserName);
            intent.putExtra("searchType", "LabTest");
            startActivity(intent);
        });

        book_doctor.setOnClickListener(v -> {
            Intent intent = new Intent(getApplicationContext(), Specialist.class);
            intent.putExtra("UserName", UserName);
            intent.putExtra("searchType", "doctor");
            startActivity(intent);
        });

        active_appointments.setOnClickListener(v -> {
        });

        book_ambulance.setOnClickListener(v -> goToAmbulanceSearch());

    }

    private String formatDate(Date date) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
        String formattedDate = df.format(date);
        Log.d("sonusourav", "formatted date & time $formattedDate");
        return formattedDate;
    }

    public void goToSearch(String searchType){
        String startDateTime = formatDate(new Date());
        String endDateTime = formatDate(new Date((new Date()).getTime() + 10 * 60 * 60 * 1000));
        Intent intent = new Intent(getApplicationContext(), DocAppointmentScreen.class);
        intent.putExtra("searchType",searchType);
        AdvanceSearchEntity searchEntity = new AdvanceSearchEntity(
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                searchType,
                startDateTime,
                endDateTime
        );
        intent.putExtra("search", searchEntity);
        startActivity(intent);
    }

    public void goToAmbulanceSearch(){
        String startDateTime = formatDate(new Date());
        String endDateTime = formatDate(new Date((new Date()).getTime() + 10 * 60 * 60 * 1000));
        Intent intent = new Intent(getApplicationContext(), AmbulanceBookingScreen.class);
        intent.putExtra("searchType","Ambulance");
        AdvanceSearchEntity searchEntity = new AdvanceSearchEntity(
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "Ambulance",
                startDateTime,
                endDateTime
        );
        intent.putExtra("search", searchEntity);
        startActivity(intent);
    }

    public void ClickMenu(View view) {
        openDrawer(drawerLayout);
    }

    static void openDrawer(DrawerLayout drawerLayout) {
        drawerLayout.openDrawer(GravityCompat.START);
    }

    public void ClickLogo(View view) {
        closeDrawer(drawerLayout);
    }

    public static void closeDrawer(DrawerLayout drawerLayout) {
        if (drawerLayout.isDrawerOpen(GravityCompat.START))
            drawerLayout.closeDrawer(GravityCompat.START);
    }

    public void ClickHome(View view)  {
        recreate();
    }

    public void ClickUpdateProfile(View view) {
        redirectActivity(this, UpdateProfilePatient.class);
    }

    public void ClickLogout(View view) {
        logout(this);
    }

    public static void logout(Activity activity) {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle("Logout");
        builder.setMessage("Are you sure you want to Logout ?");

        builder.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                FirebaseAuth.getInstance().signOut();
                GoogleSignIn.getClient(activity, new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_GAMES_SIGN_IN).build()).signOut().addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        FirebaseAuth.getInstance().signOut();
                        Toast.makeText(activity, "Logged out", Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(activity, StartPage.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        activity.startActivity(intent);
                        System.exit(100);
                    }
                }).addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Toast.makeText(activity, "Signout Failed", Toast.LENGTH_SHORT).show();
                    }
                });
            }

        });

        builder.setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        builder.show();
    }

    public static void redirectActivity(Activity activity, Class aclass) {
        Intent intent = new Intent(activity, aclass);
        intent.putExtra("UserName", UserName);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        activity.startActivity(intent);
    }

    @Override
    protected void onPause() {
        super.onPause();
        closeDrawer(drawerLayout);
    }

}