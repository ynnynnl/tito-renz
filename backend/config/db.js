import mongoose from "mongoose";

export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://titorenz:000123456@cluster0.etoob.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}