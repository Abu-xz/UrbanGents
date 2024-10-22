import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type:Number, 
        required: true,
    },
    images: [{type: String , required: true}],
    size: {
        type: String, 
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Available', 'Out of Stock'], 
        default: 'Available'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

});


const Product = mongoose.model('product', productSchema);

export default Product;