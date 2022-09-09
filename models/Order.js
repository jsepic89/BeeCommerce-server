import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [{
        productId: String,
        quantity: {
            type: Number,
            default: 1
        }
    }],
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: Object, // Stripe returns this item as an object 
        required: true
    },
    status: {
        type: String,
        default: "Processing payment"
    }
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;