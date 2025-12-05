import mongoose from "mongoose";

// Define the order schema
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now },  // No parentheses here, use the function reference
    payment: { type: Boolean, default: false }
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Use mongoose's built-in functionality to avoid redefinition issues in development
const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
