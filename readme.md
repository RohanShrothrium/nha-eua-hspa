Booking tele consultation

1. EUA hits gateway search
    Request:
        {
            startTime: timestamp,
            endTime: timeStamp,
            type: "string" (Teleconsultation, PhysicalConsultation, Ambulance)
            state: "std:080"
            domain: "nic2004:85111"
            country: "IND"
        }

        Resp:
LIST:    [
            {
                "id": "0",
                "type": "Teleconsultation",
                "agent": {
                    "id": "deepak.kumar@hpr.abdm",
                    "name": "deepak.kumar@hpr.abdm - Deepak Kumar",
                    "gender": "M",
                    "tags": {
                        "@abdm/gov/in/first_consultation": "500.0",
                        "@abdm/gov/in/upi_id": "9896271877@okicici",
                        "@abdm/gov/in/follow_up": "200.0",
                        "@abdm/gov/in/experience": "7.0",
                        "@abdm/gov/in/languages": "Eng, Hin",
                        "@abdm/gov/in/speciality": "ENT",
                        "@abdm/gov/in/lab_report_consultation": "1000.0",
                        "@abdm/gov/in/education": "MS",
                        "@abdm/gov/in/hpr_id": "10696314",
                        "@abdm/gov/in/signature": null
                    }
                },
                "start": {
                    "time": {
                        "timestamp": "T15:28+05:30"
                    }
                },
                "end": {
                    "time": {
                        "timestamp": "T15:28+05:30"
                    }
                }
            }
        ]
List:   [
            {
                "id": "0",
                "descriptor": {
                    "name": "Consultation"
                },
                "price": {
                    "currency": "INR",
                    "value": "500.0"
                },
                "fulfillment_id": "0"
            }
        ]
2. HSPA receives search from gateway (AUTO)
3. HSPA responds gateway on_search
4. EUA receives on_search from gateway (AUTO) —> Gets a catalogue
5. EUA hits HSPA init with booking data. Chooses from list of catalogues.
Request:
            {
                fullfilment: {fullfilment_object}
                item: {item_object}
            }

Respone:
            {
                bill
            }
6. HSPA responds to EUA with on_init with bill and payment details
7. EUA calls HSPA confirm
Request:
            {
                payment_confirmation
            }
8. HSPA responds to EUA with EUA on_confirm
