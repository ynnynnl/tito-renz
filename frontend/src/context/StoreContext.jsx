// StoreContext.js
import React, { createContext, useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : {};
    });

    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track errors

    const addToCart = (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
            localStorage.setItem("cartItems", JSON.stringify(newCart));
            return newCart;
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev, [itemId]: Math.max((prev[itemId] || 1) - 1, 0) };
            if (newCart[itemId] === 0) {
                delete newCart[itemId];
            }
            localStorage.setItem("cartItems", JSON.stringify(newCart));
            return newCart;
        });
    };

    const clearCart = () => {
        setCartItems({});
        localStorage.removeItem("cartItems");
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoodList(response.data.data);
            console.log("Fetched Food List:", response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
            setError("Failed to load food list.");
        } finally {
            setLoading(false); // Stop loading once request is complete
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
            }
        };
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    // Fallbacks for loading and errors
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
