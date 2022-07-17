console.log('Hello world');


function getParameter(name){
    var r = /[?&]([^=#]+)=([^&#]*)/g,p={},match;
    while(match = r.exec(window.location)) p[match[1]] = match[2];
    return p[name];
}

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
 }

async function loadDoctorById() {
    var foo = parseInt(get('doctorId'))
    var headers = new Headers();
    headers.append('Accept', 'application/json'); // This one is enough for GET requests
    headers.append('Content-Type', 'application/json'); // This one sends body
    const response = await fetch('https://f0ee-122-162-231-10.in.ngrok.io/hspa/getDoctors', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({}),
    });
    const data = await response.json();
    const name = data["users"][foo]['name']
    
    for(let i = 0; i < data["users"].length; i++) {
        let record = data["users"][i];
        if (record.name == name){
            console.log(record)
            let index = (i + 1);
            let colour = 'success';
            let status = 'Available';
            if (record.isBooked) {
                colour = 'danger';
                status = 'Booked'
            }
            let bookingDate = record.startTime.slice(0, 10)
            let bookingStart = record.startTime.slice(12,19)
            let bookingEnd = record.endTime.slice(12,19)
            console.log(bookingStart)
            console.log(bookingDate)
            console.log(name)
            // <td><a href="#"><img src="https://www.tutorialrepublic.com/examples/images/avatar/${index}.jpg" class="avatar" alt="Avatar">${record.name}</a></td>
            var recordHTML = `<li class="position-relative booking">
                                <div class="media">
                                    <div class="media-body">
                                             <div class="row">
                                        <div class="col-md-3">
                                            <div class="mb-3">
                                                <span class="bg-light-green">Slot ${index}</span>
                                            </div>
                                            <div class="mb-3">
                                                <span class="bg-light">${bookingDate}</span>
                                            </div>
                                            06.03.2020  <div class="mb-3">
                                                <span class="bg-light">${bookingStart} - ${bookingEnd}</span>
                                            </div>
                                        </div>
                                        <div class="col-md-6 text-center">
                                            <h5 class="mb-4">Physical Consultation</h5>
                                        </div>
                                        <div class="col-md-2">
                                            <h5 class="mb-4"><span class="badge badge-${colour} ml-3">${status}</span></h5>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </li>`
            document.getElementById("doctor-appointment-details").innerHTML += recordHTML;
            document.getElementById("doctor-appointment-name").innerHTML = name;
            
        }
        // console.log(recordHTML);
    }
    
}

loadDoctorById();