import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    categoryName : {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: false
    }
},
{timestamps: true});


const Category = mongoose.model('categories', categorySchema);

export default Category;