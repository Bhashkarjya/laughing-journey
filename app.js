const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
require('dotenv').config();

//importing routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
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
app.use(cors());
//cors makes sure that the server listens to different request from various ports.
//For eg our server is running on port 8000, out client will run on port 3001.
//Without cors, we won't be able to serve the client requests running on different ports

//routes middleware
app.use('/api/',authRoutes);
app.use('/api/',userRoutes);
app.use('/api/',categoryRoutes);
app.use('/api/',productRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});