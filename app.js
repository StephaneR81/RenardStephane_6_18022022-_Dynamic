const express = require('express');
const app = express();

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const saucesRoutes = require('./routes/saucesRoutes');
const authRoutes = require('./routes/authRoutes');

const path = require('path');
const mongoose = require('mongoose');

//CONNECTS TO MongoDB DATABASE
mongoose.connect(`mongodb+srv://${process.env.MONGOOSE_USER}:${process.env.MONGOOSE_PWD}@${process.env.MONGOOSE_CLUSTER}.mongodb.net/${process.env.MONGOOSE_DATABSE}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedtopology: true
    })

    .then(() => {
        console.log('Connecté à MongoDB avec succès !');
    })

    .catch((err) => {
        console.log('Echec de connexion à MongoDB !', err);
    });

//PERMET D AUTORISER LES REQUETES HTTP CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // DEPUIS N IMPORTE QUELLE ORIGINE
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use(helmet());

app.use(mongoSanitize({
    onSanitize: ({
        req,
        key
    }) => {
        console.log(`This request [${key}] is sanitized`, req);
    }
}));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', authRoutes);
app.use('/api/sauces', saucesRoutes);


module.exports = app;