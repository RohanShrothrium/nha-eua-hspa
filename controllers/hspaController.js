const constants = require('../constants/hspaConstants')
const { randomUUID } = require('crypto');
const fs = require('fs');
var path = require('path');
const axios = require('axios');

const dbPath = '../db/dbConfig.json'
const jsonPath = path.join(__dirname, '..', 'db', 'dbConfig.json');

exports.RegisterAmbulance = async (vehicleNumber) => {
    try {
        let rawdata = fs.readFileSync(jsonPath);
        let catalogue = JSON.parse(rawdata);
        var uuid = randomUUID()
        var newUser = {
            id: uuid,
            type: "Ambulance",
            agent: {},
            start: {
                time: {
                    timestamp: ""
                }
            },
            end: {
                time: {
                    timestamp: ""
                }
            }
        }
        catalogue.fulfillments.push(newUser)
        catalogue.items.push({ ...constants.ITEM, id: uuid, fulfillment_id: uuid, descriptor: { name: "Ambulance - " + vehicleNumber } })

        fs.writeFile(jsonPath, JSON.stringify(catalogue), function (err) {
            if (err) throw err;
            console.log("It's saved!");
            // file written successfully
        });

        return { status: "success" }
    } catch (err) {
        return { err }
    }
}

exports.RegisterLabTest = async (startTime, endTime, type) => {
    try {
        let rawdata = fs.readFileSync(jsonPath);
        let catalogue = JSON.parse(rawdata);


        var startTimeAsDate = new Date(startTime)
        var endTimeAsDate = new Date(endTime)

        while (startTimeAsDate <= endTimeAsDate) {
            var uuid = randomUUID()
            var newUser = {
                id: uuid,
                type: "Lab Booking " + type,
                agent: {},
                start: {
                    time: {
                        timestamp: startTimeAsDate.toISOString()
                    }
                },
                end: {
                    time: {
                        timestamp: addMinutes(startTimeAsDate, 30).toISOString()
                    }
                }
            }

            startTimeAsDate = addMinutes(startTimeAsDate, 30)
            catalogue.fulfillments.push(newUser)
            catalogue.items.push({ ...constants.ITEM, id: uuid, fulfillment_id: uuid, descriptor: { name: type } })
        }

        fs.writeFile(jsonPath, JSON.stringify(catalogue), function (err) {
            if (err) throw err;
            console.log("It's saved!");
            // file written successfully
        });

        return { status: "success" }
    } catch (err) {
        return { err }
    }
}

exports.Register = async (id, name, gender, startTime, endTime, type) => {
    try {
        let rawdata = fs.readFileSync(jsonPath);
        let catalogue = JSON.parse(rawdata);


        var startTimeAsDate = new Date(startTime)
        var endTimeAsDate = new Date(endTime)

        while (startTimeAsDate <= endTimeAsDate) {
            var uuid = randomUUID()
            var newUser = {
                id: uuid,
                type,
                agent: {
                    id,
                    name,
                    gender,
                    tags: constants.TAGS
                },
                start: {
                    time: {
                        timestamp: startTimeAsDate.toISOString()
                    }
                },
                end: {
                    time: {
                        timestamp: addMinutes(startTimeAsDate, 30).toISOString()
                    }
                }
            }

            startTimeAsDate = addMinutes(startTimeAsDate, 30)
            catalogue.fulfillments.push(newUser)
            catalogue.items.push({ ...constants.ITEM, id: uuid, fulfillment_id: uuid, descriptor: { name: type } })
        }

        fs.writeFile(jsonPath, JSON.stringify(catalogue), function (err) {
            if (err) throw err;
            console.log("It's saved!");
            // file written successfully
        });

        return { status: "success" }
    } catch (err) {
        return { err }
    }
}

exports.GetAppointments = async () => {
    try {
        let rawdata = fs.readFileSync(jsonPath);
        let catalogue = JSON.parse(rawdata);

        var users = []
        for (let i = 0; i < catalogue.fulfillments.length; i++) {
            if (catalogue.fulfillments[i].agent.name == undefined) {
                continue;
            }
            var user = {
                name: catalogue.fulfillments[i].agent.name,
                id: catalogue.fulfillments[i].agent.id,
                gender: catalogue.fulfillments[i].agent.gender,
                type: catalogue.fulfillments[i].type,
                startTime: catalogue.fulfillments[i].start.time.timestamp,
                endTime: catalogue.fulfillments[i].end.time.timestamp,
                isBooked: catalogue.fulfillments[i].isBooked != undefined
            }
            console.log(user)
            users.push(user)
        }
        users = sort_by_key(users, 'name')

        return { status: "success", users }
    } catch (err) {
        return { err }
    }
}

exports.GetLabBookings = async () => {
    try {
        let rawdata = fs.readFileSync(jsonPath);
        let catalogue = JSON.parse(rawdata);

        var users = []
        for (let i = 0; i < catalogue.fulfillments.length; i++) {
            if (!catalogue.fulfillments[i].type.includes("Lab Booking")) {
                continue;
            }
            var user = {
                type: catalogue.fulfillments[i].type,
                startTime: catalogue.fulfillments[i].start.time.timestamp,
                endTime: catalogue.fulfillments[i].end.time.timestamp,
                isBooked: catalogue.fulfillments[i].isBooked != undefined
            }
            console.log(user)
            users.push(user)
        }

        return { status: "success", users }
    } catch (err) {
        return { err }
    }
}

exports.GetAmbulances = async () => {
    try {
        let rawdata = fs.readFileSync(jsonPath);
        let catalogue = JSON.parse(rawdata);

        var users = []
        for (let i = 0; i < catalogue.fulfillments.length; i++) {
            if (!catalogue.fulfillments[i].type.includes("Ambulance")) {
                continue;
            }
            var user = {
                type: catalogue.fulfillments[i].type,
                vehicleNumber: catalogue.items[i].descriptor.name,
                isBooked: catalogue.fulfillments[i].isBooked != undefined
            }
            console.log(user)
            users.push(user)
        }

        return { status: "success", users }
    } catch (err) {
        return { err }
    }
}

exports.Search = async (context, intent) => {
    try {
        let rawdata = fs.readFileSync(jsonPath);
        let catalogue = JSON.parse(rawdata);

        var response = {
            context: context,
            message: {
                catalog: {
                    descriptor: { name: "thecodingcompany" },
                    fulfillments: [],
                    items: []
                }
            }
        }
        var reqStartTime = new Date(intent.fulfillment.start.time.timestamp)
        var reqEndTime = new Date(intent.fulfillment.end.time.timestamp)
        for (let i = 0; i < catalogue.fulfillments.length; i++) {
            if (validateFulfilmentTime(catalogue.fulfillments[i], reqStartTime, reqEndTime) &&
                validateFulfillmentTags(catalogue.fulfillments[i], intent.fulfillment.agent) &&
                validateFulfillmentType(catalogue.fulfillments[i], intent.fulfillment.type) &&
                catalogue.fulfillments[i].isBooked == undefined) {
                response.message.catalog.fulfillments.push(catalogue.fulfillments[i])
                response.message.catalog.items.push(catalogue.items[i])
            }
            // todo: more validations??
        }
        response.context.provider_id = "thecodingcompany.herokuapp.com"
        response.context.provider_uri = "https://f0ee-122-162-231-10.in.ngrok.io/hspa/service"
        response.context.action = "on_search"
        response.context.message_id = context.message_id

        // send post request to gateway
        axios
            .post('http://121.242.73.120:8083/api/v1/on_search', response)
            .then(res => {
                console.log(`statusCode: ${res.status}`);
                console.log(res.data);
            })
            .catch(error => {
                console.error(error);
            });

        return { response: "success" }
    } catch (err) {
        return { err }
    }
}

exports.ServiceSearch = async (context, intent) => {
    try {
        let rawdata = fs.readFileSync(jsonPath);
        let catalogue = JSON.parse(rawdata);

        var response = {
            context: context,
            message: {
                catalog: {
                    descriptor: { name: "thecodingcompany" },
                    fulfillments: [],
                    items: []
                }
            }
        }
        var reqStartTime = new Date(intent.fulfillment.start.time.timestamp)
        var reqEndTime = new Date(intent.fulfillment.end.time.timestamp)
        for (let i = 0; i < catalogue.fulfillments.length; i++) {
            if (validateFulfilmentTime(catalogue.fulfillments[i], reqStartTime, reqEndTime) &&
                validateFulfillmentTags(catalogue.fulfillments[i], intent.fulfillment.agent) &&
                validateFulfillmentType(catalogue.fulfillments[i], intent.fulfillment.type) &&
                catalogue.fulfillments[i].isBooked == undefined) {
                response.message.catalog.fulfillments.push(catalogue.fulfillments[i])
                response.message.catalog.items.push(catalogue.items[i])
            }
            // todo: more validations??
        }
        response.context.provider_id = "thecodingcompany.herokuapp.com"
        response.context.provider_uri = "https://f0ee-122-162-231-10.in.ngrok.io/hspa/service"
        response.context.action = "on_search"
        response.context.message_id = context.message_id

        // send post request to gateway
        axios
            .post(context.consumer_uri + '/on_search', response)
            .then(res => {
                console.log(`statusCode: ${res.status}`);
                console.log(res.data);
            })
            .catch(error => {
                console.error(error);
            });

        return { response: "success" }
    } catch (err) {
        return { err }
    }
}

exports.Init = async (context, order) => {
    try {
        const { id, item, fulfillment, billing, customer } = order
        var response = { context: context, message: { order: order } }

        // if (!validateFulfilmentExists(fulfillment, item)) {
        //     return { success: false }
        // }

        response.context.provider_id = "thecodingcompany.herokuapp.com"
        response.context.provider_uri = "https://f0ee-122-162-231-10.in.ngrok.io/hspa"
        response.context.action = "on_init"
        response.context.message_id = context.message_id

        // add payment
        response.message.order.payment = PAYMENT

        // add quote
        response.message.order.quote = QUOTE

        axios
            .post(context.consumer_uri + '/on_init', response)
            .then(res => {
                console.log(`statusCode: ${res.status}`);
                console.log(res.data);
            })
            .catch(error => {
                console.error(error);
            });
        return { response: "success" }
    } catch (err) {
        return { err }
    }
}

exports.Confirm = async (context, order) => {
    try {
        var response = { context: context, message: { order: order } }
        response.context.provider_id = "thecodingcompany.herokuapp.com"
        response.context.provider_uri = "https://f0ee-122-162-231-10.in.ngrok.io/hspa"
        response.context.action = "on_init"
        response.context.message_id = context.message_id

        let rawdata = fs.readFileSync(jsonPath);
        let catalogue = JSON.parse(rawdata);

        for (let i = 0; i < catalogue.fulfillments.length; i++) {
            if (catalogue.fulfillments[i].id == order.fulfillment.id) {
                catalogue.fulfillments[i].isBooked = true
                catalogue.items[i].isBooked = true
                // catalogue.fulfillments.splice(i, 1)
                // catalogue.items.splice(i, 1)
            }
        }

        const initString = JSON.stringify(catalogue)
        fs.writeFile(jsonPath, initString, function (err) {
            if (err) throw err;
            console.log("It's saved!");
            // file written successfully
        });

        axios
            .post(context.consumer_uri + '/on_confirm', response)
            .then(res => {
                console.log(`statusCode: ${res.status}`);
                console.log(res.data);
            })
            .catch(error => {
                console.error(error);
            });
        return { response: "success" }
    } catch (err) {
        return { err }
    }
}

function validateFulfillmentType(fulfillment, type) {
    try {
        var s = similarity(fulfillment.type, type)
        if (fulfillment.type.includes('Lab Booking')) {
            updatedFulfillmentType = fulfillment.type.replace('Lab Booking ', '')
            updatedType = type.replace('Lab Booking ', '')
            s = similarity(updatedFulfillmentType, updatedType)
            return s > 0.4 || updatedFulfillmentType.includes(updatedType)
        }
        return s > 0.6
    } catch (err) {
        return false
    }
}

function validateFulfilmentTime(fulfilment, reqStartTime, reqEndTime) {
    if (fulfilment.type == "Ambulance") {
        return true;
    }
    const { start, end } = fulfilment
    var startTime = new Date(start.time.timestamp)
    var endTime = new Date(end.time.timestamp)

    if (reqStartTime <= startTime && reqEndTime >= endTime) return true

    return false
}

function validateFulfilmentExists(fulfillment, item) {
    let rawdata = fs.readFileSync(jsonPath);
    let catalogue = JSON.parse(rawdata);

    for (let i = 0; i < catalogue.fulfillments.length; i++) {
        if (JSON.stringify(catalogue.fulfillments[i]) == JSON.stringify(fulfillment) && JSON.stringify(catalogue.items[i]) == JSON.stringify(item)) {
            return true
        }
    }

    return false
}

function validateFulfillmentTags(fulfillment, agent) {
    try {
        if (fulfillment.agent.type === {}) {
            return true
        }

        for (key in agent.tags) {
            if (!JSON.stringify(fulfillment.agent).includes(agent.tags[key])) {
                return false
            }
        }

        if (agent.name != "" && agent.name != undefined && agent.name != null) {
            if (!fulfillment.agent.name.includes(agent.name)) {
                return false
            }
        }

        var x = agent.id
        if (agent.id != "" && agent.id != undefined && agent.id != null) {
            if (fulfillment.agent.id != agent.id) {
                return false
            }
        }
        return true
    } catch (err) {
        return false
    }
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function sort_by_key(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

const PAYMENT = {
    uri: "https://phonepe.com/fakePaymentLink",
    type: "ON-ORDER",
    status: "NOT-PAID",
    tl_method: null,
    params: null
}

const QUOTE = {
    "price": {
        "currency": "INR",
        "value": "1000"
    },
    "breakup": [
        {
            "title": "Consultation",
            "price": {
                "currency": "INR",
                "value": "500"
            }
        },
        {
            "title": "CGST @ 5%",
            "price": {
                "currency": "INR",
                "value": "200"
            }
        },
        {
            "title": "SGST @ 5%",
            "price": {
                "currency": "INR",
                "value": "100"
            }
        },
        {
            "title": "Registration",
            "price": {
                "currency": "INR",
                "value": "100"
            }
        }
    ]
}
