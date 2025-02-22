const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const products = [
    { id: "101", name: "Laptop", status: "Available" },
    { id: "102", name: "Bike", status: "Rented" },
    { id: "103", name: "Camera", status: "Available" }
];

app.get("/track/:id", (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    res.json({ message: product ? `Status: ${product.status}` : "Product not found" });
});

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    
    // Simulating AI Chatbot (replace with OpenAI API in real case)
    const aiResponses = {
        "available products": "Currently available: Laptop, Camera.",
        "track my product": "Please provide the product ID to track it."
    };

    const reply = aiResponses[userMessage.toLowerCase()] || "I'm not sure. Please ask again.";
    res.json({ reply });
});

app.listen(3000, () => console.log("Server running on port 3000"));
