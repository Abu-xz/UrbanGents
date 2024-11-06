import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  selectedSize: {
    type: String
  },
  quantity: {
    type: Number,
    required: true,
    max:5,
    default: 1
  },
  subTotal: {
    type: Number,
    default: 0
  },
  subDiscount: {
    type: Number,
    default: 0
  }
});


const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true,
        unique:true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      required:  true,
      default: 0
    },
    totalDiscount: {
    type: Number,
    default: 0
  }
})

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;