import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext"; // Ensure this path is correct based on your folder structure

const MyOrders = () => {
    const { token } = useContext(StoreContext); // Get the token from StoreContext
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // State for loading

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get("http://localhost:4000/api/order/userorders", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setOrders(response.data.data); // Assuming the order data is in response.data.data
                    console.log("Orders fetched:", response.data.data);
                } else {
                    setError("Failed to load orders.");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError(error.response && error.response.data ? error.response.data.message : "Failed to load orders.");
            } finally {
                setLoading(false); // Stop loading
            }
        };

        if (token) {
            fetchOrders();
        } else {
            setError("No token found. Please log in.");
            setLoading(false); // Stop loading if there's no token
        }
    }, [token]);

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>My Orders</h2>
            {orders.length > 0 ? (
                <ul>
                    {orders.map((order) => (
                        <li key={order._id}>
                            <p>Order ID: {order._id}</p>
                            <p>Order Total: ₱{order.amount}</p> {/* Assuming you store total amount in 'amount' */}
                            {/* Add additional order details as needed */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default MyOrders;
