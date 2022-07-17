console.log('Hello world');

async function registerAmbulance() {
    var ambulanceVehicleNumber = document.querySelector("#add-ambulance-form [name='ambulance-form-vehiclenumber']").value;
    var formJSON = {vehicleNumber: ambulanceVehicleNumber};
    console.log(formJSON);

    try {
        var headers = new Headers();
        headers.append('Accept', 'application/json'); // This one is enough for GET requests
        headers.append('Content-Type', 'application/json'); // This one sends body
        const response = await fetch('https://f0ee-122-162-231-10.in.ngrok.io/hspa/registerAmbulance', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formJSON),
        });
        const data = await response.json();
        console.log(data);
        
        //call loadambulances

    } catch(error) {
        console.log(error)
    }
}

async function loadAmbulances() {

    var headers = new Headers();
    headers.append('Accept', 'application/json'); // This one is enough for GET requests
    headers.append('Content-Type', 'application/json'); // This one sends body

    const response = await fetch('https://f0ee-122-162-231-10.in.ngrok.io/hspa/getAmbulances', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({}),
    });


    const data = await response.json();
    console.log(data)
    for(let i = 0; i < data["users"].length; i++) {
        let record = data["users"][i];
        let index = (i%10 + 1);
        let colour = 'success';
        let status = 'Available';
        if (record.isBooked) {
            colour = 'danger';
            status = 'Booked'
        }
        var recordHTML = `  <tr>
                                <td>${index}</td>
                                <td>${record.vehicleNumber}</td>                        
                                <td><span class="status text-${colour}">&bull;</span> ${status}</td>
                                <td>
                                    <a href="#" class="settings" title="Settings" data-toggle="tooltip"><i class="material-icons">&#xE8B8;</i></a>
                                    <a href="#" class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE5C9;</i></a>
                                </td>
                            </tr>`
        document.getElementById("dm-table-tbody").innerHTML += recordHTML;
        // console.log(recordHTML);
    }

}


loadAmbulances();