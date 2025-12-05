import userModel from "../models/userModel.js"; // Corrected the path

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = userData.cartData || {}; // Ensure cartData is initialized
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Remove items from user cart
const removeFromCart = async (req, res) => {
    // Implementation here
}

// Fetch user cart data
const getCart = async (req, res) => {
    // Implementation here
}

export { addToCart, removeFromCart, getCart };
