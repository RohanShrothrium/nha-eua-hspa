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

module.exports = app;
