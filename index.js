const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const cron = require('node-cron');
const axios = require('axios')

const ProductModel = require('./models/Product')
const OrderModel = require('./models/Order');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Successful"))
    .catch((err) => console.log(err));


app.get("/active", async (req, res) => {
    try {
        res.send("Mern Ecommerce Backend")
    }
    catch (err) {
        res.status(500).json(err);
    }
})

app.get('/scheduled-api', (req, res) => {
    // Make the API request to your endpoint
    axios.get('https://joshua-mern-ecommerce-backend-14.onrender.com/active')
        .then(response => {
            console.log(response.data);
            res.send('API request sent successfully');
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Failed to send API request');
        });
});

cron.schedule('*/10 * * * *', () => {
    axios.get('http://localhost:5000/scheduled-api')
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
});



app.get('/', async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json(err);
    }
})
app.post('/addProduct', async (req, res) => {
    const newProduct = new ProductModel({
        "name": req.body.name,
        "price": req.body.price,
        "category": req.body.category,
        "image": req.body.image
    })
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
})

app.get("/product/:id", async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
})

app.post('/addOrder', async (req, res) => {
    const newOrder = new OrderModel({
        "product_Name": req.body.product_Name,
        "quantity": req.body.quantity,
        "price": req.body.price,
        "image": req.body.image,
        "payment_id": req.body.payment_id
    })
    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
})

app.get('/orders', async (req, res) => {
    try {
        const orders = await OrderModel.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
})



app.listen(5000, () => {
    console.log("Backend Server is Running")
})