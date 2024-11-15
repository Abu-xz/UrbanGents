import Cart from "../../models/cartModel.js";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import Users from "../../models/userModel.js";
import crypto from "crypto";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_SECRET_ID,
}); //continue here

export const loadCheckout = async (req, res) => {
  try {
    console.log("cart page page reached! ");

    const userData = req.session.user.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });
    if (!user) {
      return res.status(302).redirect("/user/home");
    }
    const cart = await Cart.findOne({ userId: user._id }).populate(
      "items.productId"
    );
    // console.log("Cart data here in load checkout", cart);
    if (!cart) {
      return res.status(200).render("user/cart");
    }

    // console.log(user);

    res.status(200).render("user/checkout", { cart, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal sever error, Please try again" });
  }
};

export const placeOrder = async (req, res) => {
  try {
    console.log("check out post page reached");

    const userData = req.session.user.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const { addressId, payment } = req.body;
    console.log(addressId, payment);

    if (!addressId || !payment) {
      return res.status(400).json({
        success: false,
        message: "Address or payment method missing.",
      });
    }

    const address = user.addresses.find((add) => add._id.equals(addressId));
    // console.log(address);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found!" });
    }

    const cart = await Cart.findOne({ userId: user._id }).populate(
      "items.productId"
    );
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found!" });
    }

    for (let item of cart.items) {
      const selectedVariant = item.productId.variant.find(
        (v) => v.size === item.selectedSize
      );
      if (
        !selectedVariant ||
        selectedVariant.stock === 0 ||
        selectedVariant.stock < item.quantity
      ) {
        return res.status(200).json({
          success: false,
          message: `The product ${item.productId.productName} is Out Of Stock`,
        });
      }
    }

    console.log("cart items :", cart.items);

    const orderData = {
      customerId: user._id,
      address: address,
      items: cart.items,
      status: "pending",
      totalPrice: cart.totalPrice,
      totalDiscount: cart.totalDiscount,
      paymentMethod: payment,
    };

    const newOrder = await Order.create(orderData);

    // update the stock for respective orders
    const updateStockOnOrder = async () => {
      try {
        for (const product of cart.items) {
          const productUpdate = await Product.findById(product.productId);
          if (!productUpdate) {
            // console.log(`Product not found for ID: ${product.productId}`);
            continue;
          }
          const variant = productUpdate.variant.find(
            (v) => v.size === product.selectedSize
          );

          if (variant) {
            // Update the stock for the correct variant by reducing the stock
            const updatedVariant = await Product.updateOne(
              { _id: product.productId, "variant._id": variant._id },
              { $inc: { "variant.$.stock": -product.quantity } }
            );

            console.log(
              `Updated stock for product ID: ${product.productId}, size: ${
                variant.size
              }, new stock: ${variant.stock - product.quantity}`
            );
          } else {
            // console.log(`Variant not found for size: ${product.selectedSize}`);
          }
        }
      } catch (error) {
        console.error("Error updating stock:", error);
      }
    };

    // Call the function to update stock
    updateStockOnOrder();
    //clear cart items
    cart.items = [];
    cart.totalDiscount = 0;
    cart.totalPrice = 0;
    await cart.save();

    await newOrder.save();

    // console.log("saved order list ", savedOrder);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loadOrderPlaced = async (req, res) => {
  try {
    console.log("place order detailed page reached");

    const userData = req.session.user.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });

    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not found!" });
    }
    const orderId = req.query.orderId;
    // console.log(orderId);
    const orderDetails = await Order.findById(orderId);
    if (!orderDetails) {
      res.status(500).redirect("/user/cart");
    }
    // console.log('order details', orderDetails);

    res.status(200).render("user/orderPlaced", { orderDetails });
  } catch (error) {
    console.log(error);
  }
};

export const createRazorPayOrder = async (req, res) => {
  console.log("create razor pay route reached");
  const userData = req.session.user.email || req.session.user;
  const user = await Users.findOne({
    $or: [{ email: userData }, { googleId: userData }],
  });

  if (!user) {
    return res.status(500).json({ success: false, message: "User not found!" });
  }
  // console.log(user)
  const cartItems = await Cart.findOne({ userId: user._id });
  console.log(cartItems);
  const amount = cartItems.totalDiscount;
  console.log("total in cartItems", amount);
  console.log("cartItems in razor pay", cartItems);

  try {
    const orderOptions = {
      amount: amount * 100, // Amount in smallest currency unit (e.g., 1000 for ₹10)
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(orderOptions);
    console.log("order after order creation ", order);
    if (!order) {
      throw new Error("Failed to create Razorpay order");
    }
    return res.json({ order: order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create Razorpay order." });
  }
};

export const verifyPayment = async (req, res) => {
  console.log("verify payment working");

  const { paymentId, orderId, signature, addressId, payment } = req.body;

  try {
    // Verifying the signature
    const hmac = crypto.createHmac("sha256", "bcOjtnHN19lrbqBWdS35Ee7J");
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== signature) {
      return res.json({ success: false });
    }

    const userData = req.session.user.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    if (!addressId || !payment) {
      return res.status(400).json({
        success: false,
        message: "Address or payment method missing.",
      });
    }
    const address = user.addresses.find((add) => add._id.equals(addressId));
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found!" });
    }

    const cart = await Cart.findOne({ userId: user._id }).populate(
      "items.productId"
    );
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found!" });
    }
    for (let item of cart.items) {
      const selectedVariant = item.productId.variant.find(
        (v) => v.size === item.selectedSize
      );
      if (
        !selectedVariant ||
        selectedVariant.stock === 0 ||
        selectedVariant.stock < item.quantity
      ) {
        return res.status(200).json({
          success: false,
          message: `The product ${item.productId.productName} is Out Of Stock`,
        });
      }
    }

    const orderData = {
      customerId: user._id,
      address: address,
      items: cart.items,
      status: "pending",
      totalPrice: cart.totalPrice,
      totalDiscount: cart.totalDiscount,
      paymentMethod: payment,
      paymentStatus: "paid"
    };
    const newOrder = await Order.create(orderData);

    // update the stock for respective orders
    const updateStockOnOrder = async () => {
      try {
        for (const product of cart.items) {
          const productUpdate = await Product.findById(product.productId);
          if (!productUpdate) {
            // console.log(`Product not found for ID: ${product.productId}`);
            continue;
          }
          const variant = productUpdate.variant.find(
            (v) => v.size === product.selectedSize
          );

          if (variant) {
            // Update the stock for the correct variant by reducing the stock
            const updatedVariant = await Product.updateOne(
              { _id: product.productId, "variant._id": variant._id },
              { $inc: { "variant.$.stock": -product.quantity } }
            );

            console.log(
              `Updated stock for product ID: ${product.productId}, size: ${
                variant.size
              }, new stock: ${variant.stock - product.quantity}`
            );
          } else {
            // console.log(`Variant not found for size: ${product.selectedSize}`);
          }
        }
      } catch (error) {
        console.error("Error updating stock:", error);
      }
    };

    // Call the function to update stock
    updateStockOnOrder();
    //clear cart items
    cart.items = [];
    cart.totalDiscount = 0;
    cart.totalPrice = 0;
    await cart.save();

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to verify payment." });
  }
};
