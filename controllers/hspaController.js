const fs = require('fs');
var path = require('path');
const axios = require('axios');

const dbPath = '../db/dbConfig.json'
const jsonPath = path.join(__dirname, '..', 'db', 'dbConfig.json');

exports.Search = async (context, intent) => {
    try {
        let rawdata = fs.readFileSync(jsonPath);
        let catalogue = JSON.parse(rawdata);

        var response = { context: context, message: { catalog: { fulfillments: [], items: [] } } }
        var reqStartTime = new Date(intent.fulfillment.start.time.timestamp)
        var reqEndTime = new Date(intent.fulfillment.end.time.timestamp)
        for (let i = 0; i < catalogue.fulfillments.length; i++) {
            if (validateFulfilmentTime(catalogue.fulfillments[i], reqStartTime, reqEndTime)) {
                response.message.catalog.fulfillments.push(catalogue.fulfillments[i])
                response.message.catalog.items.push(catalogue.items[i])
            }
            // todo: more validations??
        }
        response.context.provider_id = "thecodingcompany.herokuapp.com"
        response.context.provider_uri = "https://5646-122-162-231-10.in.ngrok.io/hspa"
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
        response.context.provider_uri = "https://5646-122-162-231-10.in.ngrok.io/hspa"
        response.context.action = "on_init"
        response.context.message_id = context.transaction_id

        // add payment
        response.message.order.payment = PAYMENT

        // add quote
        response.message.order.quote = QUOTE

        axios
            .post(context.consumer_uri+'/on_init', response)
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
        response.context.provider_uri = "https://5646-122-162-231-10.in.ngrok.io/hspa"
        response.context.action = "on_init"
        response.context.message_id = context.transaction_id

        let rawdata = fs.readFileSync(jsonPath);
        let catalogue = JSON.parse(rawdata);

        for (let i = 0; i < catalogue.fulfillments.length; i++) {
            if (catalogue.fulfillments[i].id == order.fulfillment.id) {
                catalogue.fulfillments.splice(i, 1)
                catalogue.items.splice(i, 1)
            }
        }

        const initString = JSON.stringify(catalogue)
        fs.writeFile(jsonPath, initString, function (err) {
            if (err) throw err;
            console.log("It's saved!");
            // file written successfully
        });

        axios
            .post(context.consumer_uri+'/on_confirm', response)
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
