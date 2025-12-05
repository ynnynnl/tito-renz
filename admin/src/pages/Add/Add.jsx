import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from "axios";
import { toast } from 'react-toastify';

const Add = ({url}) => {
  
  const [image, setImage] = useState(null); // Use null instead of false
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Rice"
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Rice"
        });
        setImage(null); // Reset to null after submission
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while adding the product.");
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Upload" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' required />
        </div>
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required />
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
            <option value="Rice">Rice</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Vegetable">Vegetable</option>
                    <option value="Sizzling">Sizzling</option>
                    <option value="Goat">Goat</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Pork">Pork</option>
                    <option value="Beef">Beef</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Noodles">Noodles</option>
                    <option value="Soup">Soup</option>
                    <option value="Kakanin">Kakanin</option>
                    <option value="Salad">Salad</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Fresh Fruit Shake">Fresh Fruit Shake</option>
                    <option value="Hot Drinks">Hot Drinks</option>
                    <option value="Drink Juices">Drink Juices</option>
                    <option value="Fruit Series">Fruit Series</option>
                    <option value="Milktea">Milktea</option>
                    <option value="Drinks Soda">Drinks Soda</option>
                    <option value="Packages">Packages</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='₱0.00' required />
          </div>
        </div>
        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  );
}

export default Add;
