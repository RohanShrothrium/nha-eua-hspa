const express = require('express');
const hspaService = require('../controllers/hspaController')

const app = express();

app.post('/search', async (req, resp) => {
    const { message, context } = req.body
    hspaService.Search(context, message?.intent)
        .then(result => resp.status(200).json(result))
});

app.post('/service/search', async (req, resp) => {
    const { message, context } = req.body
    hspaService.Search(context, message?.intent)
        .then(result => resp.status(200).json(result))
});

app.post('/service/init', async (req, resp) => {
    const { message, context } = req.body
    hspaService.Init(context, message?.order)
        .then(result => resp.status(200).json(result))
})

app.post('/service/confirm', async (req, resp) => {
    const { message, context } = req.body
    hspaService.Confirm(context, message?.order)
        .then(result => resp.status(200).json(result))
})

app.post('/registerDoctor', async (req, resp) => {
    const { id, name, gender, startTime, endTime, type } = req.body
    hspaService.Register(id, name, gender, startTime, endTime, type)
        .then(result => resp.status(200).json(result))
})

app.post('/registerLabTest', async (req, resp) => {
    const { id, name, gender, startTime, endTime, type } = req.body
    hspaService.RegisterLabTest(startTime, endTime, type)
        .then(result => resp.status(200).json(result))
})

app.post('/registerAmbulance', async (req, resp) => {
    const { vehicleNumber } = req.body
    hspaService.RegisterAmbulance(vehicleNumber)
        .then(result => resp.status(200).json(result))
})

app.post('/getDoctors', async (req, resp) => {
    hspaService.GetAppointments()
        .then(result => resp.status(200).json(result))
})

app.post('/getLabTests', async (req, resp) => {
    hspaService.GetLabBookings()
        .then(result => resp.status(200).json(result))
})

app.post('/getAmbulances', async (req, resp) => {
    hspaService.GetAmbulances()
        .then(result => resp.status(200).json(result))
})

module.exports = app;
