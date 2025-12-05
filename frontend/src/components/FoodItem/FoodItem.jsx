import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart,url } = useContext(StoreContext);

    const isInCart = cartItems[id];
 
    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={url+"/images/"+image} alt={`${name}`} />
                {!isInCart ? (
                    <img 
                        className='add' 
                        onClick={() => addToCart(id)}  
                        src={assets.add_icon_white} 
                        alt={`Add ${name} to cart`} 
                    />
                ) : (
                    <div className='food-item-counter'>
                        <img 
                            onClick={() => removeFromCart(id)} 
                            src={assets.remove_icon_red} 
                            alt={`Remove ${name} from cart`} 
                        />
                        <p>{cartItems[id]}</p>
                        <img 
                            onClick={() => addToCart(id)} 
                            src={assets.add_icon_green} 
                            alt={`Add another ${name} to cart`} 
                        />
                    </div>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">₱{price}</p>
            </div>
        </div>
    );
};

export default FoodItem;
