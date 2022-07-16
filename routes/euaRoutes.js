const express = require('express');
const request = require('request');
const axios = require('axios')

const euaService = require('../controllers/euaController')
const app = express();

app.post('/hit_search', async (req, resp) => {
    console.log('Just forward JSON received from Android app to UHI Gateway.')
    const { message } = req.body
    euaService.hitSearch(message)
        .then(result => resp.status(200).json(result))
})

app.post('/on_search', async (req, resp) => {
    console.log("onsearch: receive catalogue from UHI Gateway and pass to Android App.")
    // console.log(req.body.message.catalog.fulfillments)
    const { context, message } = req.body
    euaService.onSearch(context, message)
        .then(result => resp.status(200).json(result))
});


app.post('/hit_init', async (req, resp) => {
    console.log('hit_init:  Chooses from list of catalogues. EUA hits HSPA init with booking data.')
    const { fulfillment, item, transaction_id } = req.body
    euaService.hitInit(fulfillment, item, transaction_id)
        .then(result => resp.status(200).json(result))
});

app.post('/hit_confirm', async (req, resp) => {
    console.log('hit_confirm: ')
    const { fulfillment, item, transaction_id } = req.body
    // euaService.hitInit(fulfillment, item)
        // .then(result => resp.status(200).json(result))
});

app.post('/on_init', async (req, resp) => {
    console.log("on_init: ")
    const { context, message } = req.body
    euaService.onInit(context, message)
        .then(result => resp.status(200).json(result))
});


module.exports = app;
