const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
require('dotenv').config();

//importing routes
const userRoute = require('./routes/user');
const app = express();

mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology:true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('MongoDB is connected');
});

//midddlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

//routes middleware
app.use('/api/',userRoute);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});