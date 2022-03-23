const express = require('express');
const app = express();

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');

const saucesRoutes = require('./routes/saucesRoutes');
const authRoutes = require('./routes/authRoutes');

const path = require('path');
const mongoose = require('mongoose');

//Connects to MongoDB database by using credentials from the .env file
mongoose.connect(`mongodb+srv://${process.env.MONGOOSE_USER}:${process.env.MONGOOSE_PWD}@${process.env.MONGOOSE_CLUSTER}.mongodb.net/${process.env.MONGOOSE_DATABASE}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedtopology: true
    })
    .then(() => {
        console.log('Connecté à MongoDB avec succès !');
    })

    .catch((error) => {
        console.log('Echec de connexion à MongoDB ! ', error);
    });

//Defines http headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // From all origins
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Parses JSON content in requests
app.use(express.json());

//Sanitizes request header keys and set some http headers
app.use(helmet());

//Filters user inputs to prevent XSS attacks
app.use(xss());

//Sanitizes object keys begining with '$' or containing a '.', protects against injection attacks
app.use(mongoSanitize({
    onSanitize: ({
        req,
        key
    }) => {
        console.log(`This request [${key}] is sanitized`, req);
    }
}));

//Defines a static folder for serving images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', authRoutes);
app.use('/api/sauces', saucesRoutes);

module.exports = app;