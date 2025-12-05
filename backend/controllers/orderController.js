import { response } from "express";
import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import axios from "axios"; // Import axios for handling requests to PayMongo API

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        // Ensure req.body contains necessary data
        const { userId, items, amount, address } = req.body;

        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.user._id, { cartData: {} }); // Clear the user's cart after order

        const line_items = items.map((item) => ({
            price_data: {
                currency: "php",  // Changed currency to PHP
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100  // Ensure price is in cents
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "php",  // Changed currency to PHP
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 80 // Adjust this value based on your delivery charge
            },
            quantity: 1
        });

        const session = await axios.post('https://api.paymongo.com/v1/checkout/sessions', {
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        }, {
            headers: {
                Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString('base64')}`
            }
        });

        // Save the payment session ID to the order model
        newOrder.paymentSessionId = session.data.id; // Assuming session.data.id holds the PayMongo session ID
        await newOrder.save(); // Save the session ID to the order
        
        res.json({ success_url: true, session_url: session.data.url });
    } catch (error) {
        console.error("Error placing order:", error); // Log the error for debugging
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
}

const verifyOrder = async (req, res) => {
    try {
        const { orderId } = req.query;

        // Find the order
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Query PayMongo API to get payment status
        const paymentStatus = await axios.get(`https://api.paymongo.com/v1/checkout/sessions/${order.paymentSessionId}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString('base64')}`
            }
        });

        if (paymentStatus.data.data.attributes.status === 'paid') { // Adjusted to match expected response format
            // Update order status to "completed" in the database
            order.status = "completed";
            await order.save();
            res.json({ success: true, message: "Order verified and completed" });
        } else {
            res.json({ success: false, message: "Order not paid or still pending" });
        }

    } catch (error) {
        console.error("Error verifying order:", error); // Log the error for debugging
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
}

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.user._id });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
}

export { placeOrder, verifyOrder, userOrders };
