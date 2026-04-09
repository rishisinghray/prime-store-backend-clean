const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.log("Mongo Error ❌", err);
    process.exit(1); // crash if DB not connected
  });

// Test Route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// Product Schema
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  link: String,
});

const Product = mongoose.model("Product", productSchema);

// Add Product
app.post("/add-product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: "Product Added ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Product
app.delete("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
