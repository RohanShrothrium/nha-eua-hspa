const express = require('express');
const hspaService = require('../controllers/hspaController')

const app = express();

app.post('/search', async (req, resp) => {
    const { message, context } = req.body
    hspaService.Search(context, message.intent)
        .then(result => resp.status(200).json(result))
});

app.post('/init', async (req, resp) => {
    const { message, context } = req.body
    hspaService.Init(context, message.order)
        .then(result => resp.status(200).json(result))
})

app.post('/confirm', async (req, resp) => {
    const { message, context } = req.body
    hspaService.Confirm(context, message.order)
        .then(result => resp.status(200).json(result))
})

app.post('/registerDoctor', async (req, resp) => {
    const { id, name, gender, startTime, endTime, type } = req.body
    hspaService.Register(id, name, gender, startTime, endTime, type)
        .then(result => resp.status(200).json(result))
})

app.post('/getDoctors', async (req, resp) => {
    hspaService.GetAppointments()
        .then(result => resp.status(200).json(result))
})

module.exports = app;
