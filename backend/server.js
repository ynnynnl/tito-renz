import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import axios from 'axios';
import 'dotenv/config';
import Order from './models/orderModel.js'; // Adjust the path according to your file structure

// App config
const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// PayMongo payment link creation endpoint
app.post('/api/paymongo/create-payment-link', async (req, res) => {
  try {
    const { amount, email, description, items, address } = req.body;

    // Validate incoming data
    if (!amount || !email || !Array.isArray(items) || items.length === 0 || !address) {
      return res.status(400).json({ success: false, message: 'Amount, email, items, and address are required.' });
    }

    // Request body for PayMongo
    const paymentLinkData = {
      data: {
        attributes: {
          amount: amount * 100, // PayMongo accepts amounts in centavos
          description: description || 'Order payment',
          remarks: `Payment for ${email}`,
        },
      },
    };

    // PayMongo API request
    const response = await axios.post('https://api.paymongo.com/v1/links', paymentLinkData, {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    // Get the payment link
    const paymentLink = response.data.data;

    // Create the order in your database
    const orderData = {
      items: items, // Ensure this is an array of items with relevant data
      amount: amount,
      address: address,
      status: 'pending', // Set the order status as needed
      userId: 'exampleUserId' // Replace with the actual user ID as appropriate
    };

    const newOrder = await Order.create(orderData); // Save order in the database

    // Send the payment link URL and order ID back to the client
    res.json({
      success: true,
      payment_link_url: paymentLink.attributes.checkout_url,
      orderId: newOrder._id, // Include the new order ID for reference
    });
  } catch (error) {
    console.error("Error creating payment link or saving order:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: 'Error creating payment link or saving order' });
  }
});

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
