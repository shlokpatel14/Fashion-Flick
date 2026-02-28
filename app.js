const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

// Middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use(express.static("public"));
app.use('/uploads', express.static('public/uploads'));


// Routes for static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'land.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'index.html'));
});
app.get('/addproduct', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'addproduct.html'));
});
app.get('/new-arrival', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'new-arrival.html'));
});
app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'cart.html'));
});
app.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'order.html'));
});
app.get('/product-details.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'product-details.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'login.html'));
});
app.get('/cart',(req,res)=>{
    res.sendFile(path.join(__dirname,"public/html","cart.html"));
});
app.get('/checkout',(req,res)=>{
    res.sendFile(path.join(__dirname,"public/html","checkout.html"));
});

// Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/orders`, cartRoutes);
app.use(authJwt);
// Error Handler (moved to the end)
app.use(errorHandler);

// Database Connection
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('Database Connection is ready...');
    })
    .catch((err) => {
        console.log(err);
    });

// Server Initialization
app.listen(3000, () => {
    console.log('server is running http://localhost:3000');
});
