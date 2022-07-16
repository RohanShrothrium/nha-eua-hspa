console.log('Hello world');

async function registerDoctor() {
    var doctorName = document.querySelector("#add-doctor-form [name='doctor-form-name']").value;
    var doctorId = document.querySelector("#add-doctor-form [name='doctor-form-id']").value;
    var doctorGender = document.querySelector("#add-doctor-form [name='doctor-form-gender']").value;
    var doctorSlotTimeStart = document.querySelector("#add-doctor-form [name='doctor-form-slottimestart']").value;
    var doctorSlotTimeEnd = document.querySelector("#add-doctor-form [name='doctor-form-slottimeend']").value;
    var doctorType = document.querySelector("#add-doctor-form [name='doctor-form-type']").value;
    var formJSON = {name: doctorName, id: doctorId, gender: doctorGender, type: doctorType,
                    startTime: doctorSlotTimeStart, endTime: doctorSlotTimeEnd};
    console.log(formJSON);

    try {
        var headers = new Headers();
        headers.append('Accept', 'application/json'); // This one is enough for GET requests
        headers.append('Content-Type', 'application/json'); // This one sends body
        const response = await fetch('https://f0ee-122-162-231-10.in.ngrok.io/hspa/registerDoctor', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formJSON),
        });
        const data = await response.json();
        console.log(data);
        
        //call loadDoctors

    } catch(error) {
        console.log(error)
    }
}

async function loadDoctors() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
        const response = await fetch('https://f0ee-122-162-231-10.in.ngrok.io/hspa/getDoctors', {
            method: 'GET',
            headers: headers
        });
    const data = await response.json();
    console.log(data)
    // let data = doctorsResponse;
    // for(let i = 0; i < doctorsResponse["users"].length; i++) {
    //     let record = doctorsResponse["users"][i];
    //     let index = i + 1;
    //     let colour = 'success';
    //     let status = 'Available';
    //     if (index == 8 || index == 7) {
    //         colour = 'danger';
    //         status = 'Booked'
    //     }
    //     var recordHTML = `  <tr>
    //                             <td>${index}</td>
    //                             <td><a href="#"><img src="https://www.tutorialrepublic.com/examples/images/avatar/${index}.jpg" class="avatar" alt="Avatar">${record.name}</a></td>
    //                             <td>${record.startTime}</td>                        
    //                             <td>${record.type}</td>
    //                             <td><span class="status text-${colour}">&bull;</span> ${status}</td>
    //                             <td>
    //                                 <a href="#" class="settings" title="Settings" data-toggle="tooltip"><i class="material-icons">&#xE8B8;</i></a>
    //                                 <a href="#" class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE5C9;</i></a>
    //                             </td>
    //                         </tr>`
    //     document.getElementById("dm-table-tbody").innerHTML += recordHTML;
    //     console.log(recordHTML);
    // }

}



const doctorsResponse = {
    "status": "success",
    "users": [
        {
            "name": "sonu.sourav@hpr.abdm - Sonu Sourav",
            "id": "sonu.sourav@hpr.abdm",
            "gender": "M",
            "type": "Teleconsultation",
            "startTime": "2022-06-22T15:30:00",
            "endTime": "2022-06-22T16:00:00"
        },
        {
            "name": "sonu.sourav@hpr.abdm - Sonu Sourav",
            "id": "sonu.sourav@hpr.abdm",
            "gender": "M",
            "type": "Teleconsultation",
            "startTime": "2022-06-22T16:00:00",
            "endTime": "2022-06-22T16:30:00"
        },
        {
            "name": "praveen.sv@hpr.abdm - Praveen S V",
            "id": "praveen.sv@hpr.abdm",
            "gender": "M",
            "type": "Teleconsultation",
            "startTime": "2022-06-22T16:00:00",
            "endTime": "2022-06-22T16:30:00"
        },
        {
            "name": "rohan.shrothrium@hpr.abdm - Rohan Shrothrium",
            "id": "rohan.shrothrium@hpr.abdm",
            "gender": "M",
            "type": "Teleconsultation",
            "startTime": "2022-06-22T16:30:00",
            "endTime": "2022-06-22T17:00:00"
        },
        {
            "name": "Dr. Rohan S",
            "id": "abcd",
            "gender": "M",
            "type": "teleconsult",
            "startTime": "2022-07-16T12:00:00.000Z",
            "endTime": "2022-07-16T12:30:00.000Z"
        },
        {
            "name": "Dr. Rohan S",
            "id": "abcd",
            "gender": "M",
            "type": "teleconsult",
            "startTime": "2022-07-16T12:30:00.000Z",
            "endTime": "2022-07-16T13:00:00.000Z"
        },
        {
            "name": "Dr. Rohan S",
            "id": "abcd",
            "gender": "M",
            "type": "teleconsult",
            "startTime": "2022-07-16T13:00:00.000Z",
            "endTime": "2022-07-16T13:30:00.000Z"
        },
        {
            "name": "Dr. XYZ",
            "id": "abcd",
            "gender": "M",
            "type": "teleconsult",
            "startTime": "2022-07-16T12:00:00.000Z",
            "endTime": "2022-07-16T12:30:00.000Z"
        },
        {
            "name": "Dr. XYZ",
            "id": "abcd",
            "gender": "M",
            "type": "teleconsult",
            "startTime": "2022-07-16T12:30:00.000Z",
            "endTime": "2022-07-16T13:00:00.000Z"
        },
        {
            "name": "Dr. XYZ",
            "id": "abcd",
            "gender": "M",
            "type": "teleconsult",
            "startTime": "2022-07-16T13:00:00.000Z",
            "endTime": "2022-07-16T13:30:00.000Z"
        }
    ]
}

loadDoctors();