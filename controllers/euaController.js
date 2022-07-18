const fs = require('fs');
var path = require('path');
const axios = require('axios');
const { randomUUID } = require('crypto');

const jsonPath = path.join(__dirname, '..', 'db', 'search.json');
const hitInitJSONPath = path.join(__dirname, '..', 'db', 'hitInit.json');
const hitConfirmJSONPath = path.join(__dirname, '..', 'db', 'hitConfirm.json');
const hitDelaySeconds = 5;

const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, Math.ceil(time * 1000)));
};

exports.hitSearch = async (message) => {
    try {
        let rawdata = fs.readFileSync(jsonPath);
        let searchJSON = JSON.parse(rawdata);
        searchJSON.message.intent.fulfillment.start.time.timestamp = message.fulfillment.start.timestamp
        searchJSON.message.intent.fulfillment.end.time.timestamp = message.fulfillment.end.timestamp
        searchJSON.message.intent.fulfillment.type = message.fulfillment.type
        searchJSON.context.transaction_id = randomUUID()

        //  add optional params
        if (message.fulfillment.speciality != "" && message.fulfillment.speciality != undefined) {
            searchJSON.message.intent.fulfillment.agent.tags["@abdm/gov/in/speciality"] = message.fulfillment.speciality
        }
        if (message.fulfillment.language != "" && message.fulfillment.speciality != undefined) {
            searchJSON.message.intent.fulfillment.agent.tags["@abdm/gov/in/language"] = message.fulfillment.language
        }
        if (message.fulfillment.name != "" && message.fulfillment.name != undefined) {
            searchJSON.message.intent.fulfillment.agent.name = message.fulfillment.name
        }
        if (message.fulfillment.hpid != "" && message.fulfillment.hpid != undefined) {
            searchJSON.message.intent.fulfillment.agent.id = message.fulfillment.hpid
        }

        // send post request to gateway
        res = await axios.post('http://121.242.73.120:8083/api/v1/search', searchJSON)
        // console.log(res.data);
        await sleep(hitDelaySeconds)
        //read catalogue (fulfillments + items) responses
        let fulfillmentsData = fs.readFileSync(path.join(__dirname, '..', 'db', 'fulfillments', searchJSON.context.transaction_id + '.json'))
        let fulfillments = JSON.parse(fulfillmentsData)

        let itemsData = fs.readFileSync(path.join(__dirname, '..', 'db', 'items', searchJSON.context.transaction_id + '.json'))
        let items = JSON.parse(itemsData)

        agentMap = {}
        for (var i = 0; i < fulfillments.length; i++) {
            if (!fulfillments[i].type.includes("Lab Booking")) {
                if (agentMap[fulfillments[i].agent.id] == undefined) {
                    agentMap[fulfillments[i].agent.id] = [
                        {
                            ...fulfillments[i],
                            item: items[i]
                        }
                    ]
                } else {
                    agentMap[fulfillments[i].agent.id].push(
                        {
                            ...fulfillments[i],
                            item: items[i]
                        }
                    )
                }
            } else {
                if (agentMap[fulfillments[i].type] == undefined) {
                    agentMap[fulfillments[i].type] = [
                        {
                            ...fulfillments[i],
                            item: items[i]
                        }
                    ]
                } else {
                    agentMap[fulfillments[i].type].push(
                        {
                            ...fulfillments[i],
                            item: items[i]
                        }
                    )
                }
            }
        }
        var resp = []
        for (var key in agentMap) {
            resp.push(agentMap[key])
        }

        return { fulfillments: resp, transaction_id: searchJSON.context.transaction_id }

    } catch (err) {
        return { err }
    }
}

exports.hitInit = async (fulfillment, item, transaction_id) => {
    try {
        let rawdata = fs.readFileSync(hitInitJSONPath);
        let initJSON = JSON.parse(rawdata);
        initJSON.message.order.fulfillment = fulfillment;
        initJSON.message.order.item = item;
        initJSON.context.transaction_id = transaction_id;

        // Fetch url
        let fulfillmentMapData = fs.readFileSync(path.join(__dirname, '..', 'db', 'fm', transaction_id + '.json'))
        let fulfillmentMap = JSON.parse(fulfillmentMapData)

        // var x = (JSON.stringify(fulfillment) + JSON.stringify(item)).split('').sort().join('').replace(/\s/g, '')
        var hspaUri = fulfillmentMap[fulfillment.id]

        //Sonu should pass transaction id right then? YES Woohoooo!!! I love
        // send post request to HSPA Init
        res = await axios.post(hspaUri + '/init', initJSON)
        // console.log(res.data);
        await sleep(hitDelaySeconds)

        //read bill
        let initsData = fs.readFileSync(path.join(__dirname, '..', 'db', 'init', transaction_id + '.json'))
        let inits = JSON.parse(initsData)

        return { quote: inits.message.order.quote }

    } catch (err) {
        return { err }
    }
}


exports.hitConfirm = async (fulfillment, item, transaction_id) => {
    try {
        let rawdata = fs.readFileSync(hitConfirmJSONPath);
        let confirmJSON = JSON.parse(rawdata);
        confirmJSON.message.order.fulfillment = fulfillment;
        confirmJSON.message.order.item = item;
        confirmJSON.context.transaction_id = transaction_id;

        // Fetch url
        let fulfillmentMapData = fs.readFileSync(path.join(__dirname, '..', 'db', 'fm', transaction_id + '.json'))
        let fulfillmentMap = JSON.parse(fulfillmentMapData)

        var hspaUri = fulfillmentMap[fulfillment.id]

        // send post request to HSPA Init
        res = await axios.post(hspaUri + '/confirm', confirmJSON)
        // console.log(res.data);
        await sleep(hitDelaySeconds)

        //read bill
        let confirmsData = fs.readFileSync(path.join(__dirname, '..', 'db', 'confirm', transaction_id + '.json'))
        let confirms = JSON.parse(confirmsData)

        return { payment: confirms.message.order.payment }
    } catch (err) {
        return { err }
    }
}


exports.onSearch = async (context, message) => {
    try {
        //write to DB
        const { fulfillments, items } = message.catalog;
        
        const fulfillmentMapPath = path.join(__dirname, '..', 'db', 'fm', context.transaction_id + '.json')
        const itemFilePath = path.join(__dirname, '..', 'db', 'items', context.transaction_id + '.json')
        const fulfillmentsFilePath = path.join(__dirname, '..', 'db', 'fulfillments', context.transaction_id + '.json')

        if (fs.existsSync(itemFilePath)) {
            let fmData = fs.readFileSync(fulfillmentMapPath)
            fulfillmentMap = JSON.parse(fmData)

            for (var i = 0; i < fulfillments.length; i++) {
                fulfillmentMap[fulfillments[i].id] = context.provider_uri
            }
            fs.writeFile(fulfillmentMapPath, JSON.stringify(fulfillmentMap), function (err) {
                if (err) throw err;
                // console.log("It's saved!");
                // file written successfully
            });

            let itemData = fs.readFileSync(itemFilePath)
            existsingItems = JSON.parse(itemData)
            newItems = existsingItems.concat(items)
            const itemsString = JSON.stringify(newItems)
            fs.writeFile(itemFilePath, itemsString, function (err) {
                if (err) throw err;
                // console.log("It's saved!");
                // file written successfully
            });

            let fulfillmentData = fs.readFileSync(fulfillmentsFilePath)
            existsingfulfillments = JSON.parse(fulfillmentData)
            newFulfillments = existsingfulfillments.concat(fulfillments)
            const fulfillmentsString = JSON.stringify(newFulfillments)
            fs.writeFile(fulfillmentsFilePath, fulfillmentsString, function (err) {
                if (err) throw err;
                // console.log("It's saved!");
                // file written successfully
            });
        } else {
            const itemsString = JSON.stringify(items)
            fs.writeFile(itemFilePath, itemsString, function (err) {
                if (err) throw err;
                // console.log("It's saved!");
                // file written successfully
            });

            const fulfillmentsString = JSON.stringify(fulfillments)
            fs.writeFile(fulfillmentsFilePath, fulfillmentsString, function (err) {
                if (err) throw err;
                // console.log("It's saved!");
                // file written successfully
            });

            fulfillmentMap = {}
            for (var i = 0; i < fulfillments.length; i++) {
                fulfillmentMap[fulfillments[i].id] = context.provider_uri
            }
            fs.writeFile(fulfillmentMapPath, JSON.stringify(fulfillmentMap), function (err) {
                if (err) throw err;
                // console.log("It's saved!");
                // file written successfully
            });
        }
        return { response: "success" }
    } catch (err) {
        return { err }
    }
}

exports.onInit = async (context, message) => {
    try {
        const initFilePath = path.join(__dirname, '..', 'db', 'init', context.transaction_id + '.json')
        const initString = JSON.stringify({ context, message })
        fs.writeFile(initFilePath, initString, function (err) {
            if (err) throw err;
            // console.log("It's saved!");
            // file written successfully
        });
        return { success: "true" }
    } catch (err) {
        return { err }
    }
}


exports.onConfirm = async (context, message) => {
    try {
        const confirmFilePath = path.join(__dirname, '..', 'db', 'confirm', context.transaction_id + '.json')
        const confirmString = JSON.stringify({ context, message })
        fs.writeFile(confirmFilePath, confirmString, function (err) {
            if (err) throw err;
            // console.log("It's saved!");
            // file written successfully
        });
        return { success: "true" }
    } catch (err) {
        return { err }
    }
}

exports.confirmedBookings = async () => {
    var bookings = []
    const confirmDirPath = path.join(__dirname, '..', 'db', 'confirm')
    fs.readdirSync(confirmDirPath).forEach(file => {
        let rawdata = fs.readFileSync(confirmDirPath + '/' + file);
        let confirmedBooking = JSON.parse(rawdata);
        bookings.push({
            fulfillment: confirmedBooking.message.order.fulfillment,
            payment: confirmedBooking.message.order.fulfillment,
        })
    })

    return { status: "success", bookings }
}
