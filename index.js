const express = require('express');
const multer = require('multer');
const hspaRoutes = require('./routes/hspaRoutes');
const euRoutes = require('./routes/euaRoutes');

const app = express();
// for parsing application/json
app.use(express.json());

const upload = multer();

// for parsing multipart/form-data
app.use(upload.array());

// for parsing application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  }), 
);

app.use('/hspa', hspaRoutes);

app.use('/eua', euRoutes);

port = 8080

const server = app.listen(port, (err) => {
    if (err) {
      console.log(`Error while starting the app -  ${err}`);
    }
    console.log(`Running server on port - ${port}`);
});

module.exports = app;
