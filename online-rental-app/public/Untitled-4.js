require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/rentalDB", { useNewUrlParser: true, useUnifiedTopology: true });

// **User Schema**
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = mongoose.model("User", UserSchema);

// **Product Schema**
const ProductSchema = new mongoose.Schema({
    id: String,
    name: String,
    status: String,
    price: Number
});
const Product = mongoose.model("Product", ProductSchema);

const products = [
    { id: "101", name: "Laptop", status: "Available", price: 50 },
    { id: "102", name: "Bike", status: "Rented", price: 20 },
    { id: "103", name: "Camera", status: "Available", price: 30 }
];

Product.insertMany(products).catch(() => {});

// **JWT Authentication**
const secretKey = "yourSecretKey";
function authenticateToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).send("Access Denied");
    
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).send("Invalid Token");
        req.user = user;
        next();
    });
}

// **Signup Route**
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered successfully" });
});

// **Login Route**
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });
    res.json({ token });
});

// **Product Tracking**
app.get("/track/:id", (req, res) => {
    Product.findOne({ id: req.params.id }).then(product => {
        res.json({ message: product ? `Status: ${product.status}` : "Product not found" });
    });
});

// **Payment Integration (Stripe)**
app.post("/create-payment", async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: "usd"
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// **AI Chatbot (OpenAI)**
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        });

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Chatbot error" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
