import Cart from "../../models/cartModel.js";
import Coupon from "../../models/couponModel.js";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import Users from "../../models/userModel.js";
import crypto from "crypto";
import Razorpay from "razorpay";

export const loadCheckout = async (req, res) => {
  try {
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
    if (!cart) {
      return res.status(200).json({ message: "Cart not Found!" });
    }
    const coupon = await Coupon.find({
      $and: [{ isActive: true }, { usageLimit: { $gt: 0 } }],
    });

    res.status(200).render("user/checkout", { cart, user, coupon });
  } catch (error) {
    res.status(500).json({ message: "Internal sever error, Please try again" });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const userData = req.session.user.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const cart = await Cart.findOne({ userId: user._id }).populate(
      "items.productId"
    );
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found!" });
    }

    const { addressId, payment } = req.body;

    if (!addressId || !payment) {
      return res.status(400).json({
        success: false,
        message: "Address or payment method missing.",
      });
    }

    if (payment === "wallet") {
      const walletAmount = user.walletAmount;

      if (walletAmount < cart.totalDiscount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient Wallet balance!",
          icon: "warning",
        });
      }
    }

    const address = user.addresses.find((add) => add._id.equals(addressId));

    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found!" });
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

    if (cart.couponDiscount) {
      cart.totalDiscount = (
        cart.totalDiscount -
        (cart.totalDiscount * cart.couponDiscount) / 100
      ).toFixed();
    }

    let paymentStatus;

    if (payment === "wallet") {
      paymentStatus = "paid";
    } else {
      paymentStatus = "pending";
    }

    const orderData = {
      customerId: user._id,
      address: address,
      items: cart.items,
      status: "pending",
      paymentStatus,
      totalPrice: cart.totalPrice,
      totalDiscount: cart.totalDiscount,
      paymentMethod: payment,
      couponApplied: cart.couponApplied,
      couponDiscount: cart.couponDiscount,
    };

    const newOrder = await Order.create(orderData);
    if(payment === 'wallet'){
      user.walletAmount -= cart.totalDiscount;
    }
    // update the stock for respective orders
    const updateStockOnOrder = async () => {
      try {
        for (const product of cart.items) {
          const productUpdate = await Product.findById(product.productId);
          if (!productUpdate) {
            continue;
          }
          const variant = productUpdate.variant.find(
            (v) => v.size === product.selectedSize
          );

          if (variant) {
               await Product.updateOne(
              { _id: product.productId, "variant._id": variant._id },
              { $inc: { "variant.$.stock": -product.quantity } }
            );
          }
        }
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error while stock updating, Please try again" });
      }
    };

    // Call the function to update stock
    updateStockOnOrder();

    const order = await newOrder.save();
    const transaction = {
      amount: cart.totalDiscount,
      orderId: order._id,
      transactionType: "Debit",
    };

    cart.items = [];
    cart.totalDiscount = 0;
    cart.totalPrice = 0;
    cart.couponApplied = "";
    cart.couponDiscount = 0;

    user.transaction.push(transaction);
    await cart.save();
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loadOrderPlaced = async (req, res) => {
  try {
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

    const orderDetails = await Order.findById(orderId);
    if (!orderDetails) {
      res.status(500).redirect("/user/cart");
    }

    res.status(200).render("user/orderPlaced", { orderDetails });
  } catch (error) {
    res.status(500).json({ message: "Internal sever error, Please try again" });
  }
};

// Razorpay route here
export const createRazorPayOrder = async (req, res) => {
  const userData = req.session.user.email || req.session.user;
  const user = await Users.findOne({
    $or: [{ email: userData }, { googleId: userData }],
  });

  if (!user) {
    return res.status(500).json({ success: false, message: "User not found!" });
  }

  const cartItems = await Cart.findOne({ userId: user._id });

  if (cartItems.couponDiscount) {
    cartItems.totalDiscount = (
      cartItems.totalDiscount -
      (cartItems.totalDiscount * cartItems.couponDiscount) / 100
    ).toFixed();
  }
  const amount = cartItems.totalDiscount;

  try {
    const orderOptions = {
      amount: amount * 100, // Amount in smallest currency unit (e.g., 1000 for ₹10)
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const razorpay = new Razorpay({
      key_id: process.env.RAZOR_KEY_ID,
      key_secret: process.env.RAZOR_SECRET_ID,
    }); //continue here

    const order = await razorpay.orders.create(orderOptions);

    if (!order) {
      throw new Error("Failed to create Razorpay order");
    }
    return res.json({ order: order });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create Razorpay order." });
  }
};

export const verifyPayment = async (req, res) => {
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

    if (cart.couponDiscount) {
      cart.totalDiscount = (
        cart.totalDiscount -
        (cart.totalDiscount * cart.couponDiscount) / 100
      ).toFixed();
    }

    const orderData = {
      customerId: user._id,
      address: address,
      items: cart.items,
      status: "pending",
      totalPrice: cart.totalPrice,
      totalDiscount: cart.totalDiscount,
      paymentMethod: payment,
      paymentStatus: "paid",
      couponApplied: cart.couponApplied,
      couponDiscount: cart.couponDiscount,
    };
    const newOrder = await Order.create(orderData);

    // update the stock for respective orders
    const updateStockOnOrder = async () => {
      try {
        for (const product of cart.items) {
          const productUpdate = await Product.findById(product.productId);
          if (!productUpdate) {
            continue;
          }
          const variant = productUpdate.variant.find(
            (v) => v.size === product.selectedSize
          );

          if (variant) {
            // Update the stock for the correct variant by reducing the stock
            await Product.updateOne(
              { _id: product.productId, "variant._id": variant._id },
              { $inc: { "variant.$.stock": -product.quantity } }
            );
          } else {
            res
              .status(404)
              .json({ message: "Product is not found, Please try again" });
          }
        }
      } catch (error) {
        res
          .status(500)
          .json({ message: "Internal sever error, Please try again" });
      }
    };

    // Call the function to update stock
    updateStockOnOrder();
    //clear cart items
    cart.items = [];
    cart.totalDiscount = 0;
    cart.totalPrice = 0;
    cart.couponApplied = "";
    cart.couponDiscount = 0;
    await cart.save();

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to verify payment." });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { couponId, cartId } = req.body;

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found." });
    }

    const currentDate = new Date();
    if (coupon.expiryDate < currentDate) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon has expired." });
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });
    }

    cart.couponDiscount = coupon.discountPercentage;
    cart.couponApplied = coupon.code;
    await cart.save();
    coupon.usageLimit = coupon.usageLimit - 1;
    await coupon.save();
    res.status(200).json({
      success: true,
      message: "Coupon applied successfully!",
      discount: coupon.discountPercentage,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to apply coupon." });
  }
};

export const removeCoupon = async (req, res) => {
  const { cartId } = req.body;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    const coupon = await Coupon.findOne({ code: cart.couponApplied });
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found." });
    }
    cart.couponDiscount = null;
    cart.couponApplied = "";
    coupon.usageLimit += 1;

    await coupon.save();
    await cart.save();
    res.json({ success: true, message: "Coupon removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Failed Razorpay route here
export const failedRazorPayOrder = async (req, res) => {
  const { amount } = req.body;

  const razorpayNewInstance = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_SECRET_ID,
  });

  try {
    const orderOptions = {
      amount: amount * 100, // Amount in smallest currency unit (e.g., 1000 for ₹10)
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpayNewInstance.orders.create(orderOptions);

    if (!order) {
      throw new Error("Failed to create Razorpay order");
    }
    return res.json({ order });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create Razorpay order." });
  }
};

export const FailedVerifyPayment = async (req, res) => {
  const { paymentId, orderId, signature, id } = req.body;

  try {
    // Verifying the signature
    const hmac = crypto.createHmac("sha256", "bcOjtnHN19lrbqBWdS35Ee7J");
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== signature) {
      return res.json({ success: false });
    }

    const order = await Order.findById(id);
    order.paymentStatus = "paid";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to verify payment." });
  }
};
