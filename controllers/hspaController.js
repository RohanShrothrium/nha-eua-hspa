const constants = require('../constants/hspaConstants')
const { randomUUID } = require('crypto');
const fs = require('fs');
var path = require('path');
const axios = require('axios');

const dbPath = '../db/dbConfig.json'
const jsonPath = path.join(__dirname, '..', 'db', 'dbConfig.json');

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
            var user = {
                name: catalogue.fulfillments[i].agent.name,
                id: catalogue.fulfillments[i].agent.id,
                gender: catalogue.fulfillments[i].agent.gender,
                type: catalogue.fulfillments[i].type,
                startTime: catalogue.fulfillments[i].start.time.timestamp,
                endTime: catalogue.fulfillments[i].end.time.timestamp,
                isBooked: catalogue.fulfillments[i].isBooked != undefined
            }
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

        var response = { context: context, message: { catalog: { fulfillments: [], items: [] } } }
        var reqStartTime = new Date(intent.fulfillment.start.time.timestamp)
        var reqEndTime = new Date(intent.fulfillment.end.time.timestamp)
        for (let i = 0; i < catalogue.fulfillments.length; i++) {
            if (validateFulfilmentTime(catalogue.fulfillments[i], reqStartTime, reqEndTime) &&
                validateFulfillmentTags(catalogue.fulfillments[i], intent.fulfillment.agent) &&
                catalogue.fulfillments[i].isBooked == undefined) {
                response.message.catalog.fulfillments.push(catalogue.fulfillments[i])
                response.message.catalog.items.push(catalogue.items[i])
            }
            // todo: more validations??
        }
        response.context.provider_id = "thecodingcompany.herokuapp.com"
        response.context.provider_uri = "https://f0ee-122-162-231-10.in.ngrok.io/hspa"
        response.context.action = "on_search"
        response.context.message_id = context.transaction_id

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
        response.context.message_id = context.transaction_id

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
        response.context.message_id = context.transaction_id

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

function validateFulfilmentTime(fulfilment, reqStartTime, reqEndTime) {
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
    for (key in agent.tags) {
        if (!JSON.stringify(fulfillment.agent).includes(agent.tags[key])) {
            return false
        }
    }
    return true
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
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
                "currency": "1000"
            }
        },
        {
            "title": "CGST @ 5%",
            "price": {
                "currency": "1000"
            }
        },
        {
            "title": "SGST @ 5%",
            "price": {
                "currency": "1000"
            }
        },
        {
            "title": "Registration",
            "price": {
                "currency": "1000"
            }
        }
    ]
}
