import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, food_list, cartItems, url } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    const subtotal = getTotalCartAmount();  // Get the total in pesos
    const deliveryFee = 2;  // Delivery fee in pesos
    let totalAmountInPesos = subtotal + deliveryFee;  // Total amount in pesos

    // Check for minimum amount
    const MINIMUM_AMOUNT = 100;
    if (totalAmountInPesos < MINIMUM_AMOUNT) {
      totalAmountInPesos = MINIMUM_AMOUNT; // Set to minimum amount
    }

    let orderData = {
      address: data,
      items: orderItems,
      amount: totalAmountInPesos,  // Send amount directly in pesos
      email: data.email
    };

    try {
      // Call your server to create the PayMongo payment link
      const response = await axios.post(`${url}/api/paymongo/create-payment-link`, {
        amount: orderData.amount,
        email: orderData.email,
        description: "Order Payment",
        items: orderData.items, // Include items and address in the request
        address: orderData.address
      });

      if (response.data.success) {
        const { payment_link_url } = response.data;
        window.location.replace(payment_link_url); // Redirect to PayMongo checkout page
      } else {
        alert("Error creating payment link");
      }
    } catch (error) {
      console.error("Error in payment", error.response ? error.response.data : error.message);
      alert("Error placing order: " + (error.response ? error.response.data.message : error.message));
    }
  };

  // Define deliveryFee here
  const deliveryFee = 2;  // Delivery fee in pesos

  return (
    <div>
      <form onSubmit={placeOrder} className='place-order' target="_blank">
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input required name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First Name' />
            <input required name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last Name' />
          </div>
          <input required name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' />
          <input required name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' />
          <div className="multi-fields">
            <input required name='city' onChange={onChangeHandler} value={data.city} placeholder='City' />
            <input required name='state' onChange={onChangeHandler} value={data.state} placeholder='State' />
          </div>
          <div className="multi-fields">
            <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' />
            <input required name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' />
          </div>
          <input required name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' />
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>₱{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>₱{deliveryFee}</p> {/* Use deliveryFee here */}
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>₱{getTotalCartAmount() + deliveryFee}</b> {/* Use deliveryFee here */}
              </div>
            </div>
            <button type='submit' >PROCEED TO PAYMENT</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
