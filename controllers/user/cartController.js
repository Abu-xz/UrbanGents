import Cart from "../../models/cartModel.js";
import Users from "../../models/userModel.js";
import Product from "../../models/productModel.js";
import Offer from "../../models/offerModel.js";

export const loadCart = async (req, res) => {
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
      return res.status(200).render("user/cart");
    }

    res.status(200).render("user/cart", { cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Add to cart
export const addItemToCart = async (req, res) => {
  try {
    const userData = req.session.user.email || req.session.user;
    const { productId, variantSize } = req.body;
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return res
        .status(500)
        .json({ success: false, message: "Product Unavailable!" });
    }
    const offers = await Offer.find();
    const categoryOffer = offers.find(
      (offer) => offer.category === product.category.categoryName
    );
    const offerDiscount = categoryOffer?.discountPercentage;
    product.offerDiscount = offerDiscount;

    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });

    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not Exists!" });
    }

    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id, items: [] });
    }

    // check the item is already in the cart, but can add same item with different size !
    const itemExists = cart.items.find(
      (item) =>
        item.productId.equals(productId) && item.selectedSize === variantSize
    );
    const selectedVariant = product.variant.find((v) => v.size === variantSize);

    if (selectedVariant.stock === 0) {
      return res
        .status(200)
        .json({ success: false, message: "Product is Out of Stock!" });
    }
    const selectedSize = variantSize || selectedVariant.size;

    if (itemExists) {
      return res
        .status(400)
        .json({ success: false, message: "Item already in Cart!" });
    }

    let subDiscount;

    subDiscount = (
      product.price -
      (product.price * product.discount) / 100
    ).toFixed();

    // Here adding offer amount to subTotal
    if (offerDiscount) {
      subDiscount = (
        Number(subDiscount) -
        (Number(subDiscount) * Number(offerDiscount)) / 100
      ).toFixed();
    }

    // why i add the product price? here only one product added
    cart.items.push({
      productId,
      subTotal: product.price,
      subDiscount,
      selectedSize,
    });

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
    cart.totalDiscount = cart.items.reduce(
      (acc, item) => acc + item.subDiscount,
      0
    );

    await cart.save();
    await product.save();
    res.status(200).json({ success: true, message: "Item Added To Cart !" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error please try again" });
  }
};

//axios route to update cart product Size
export const updateSize = async (req, res) => {
  try {
    const userData = req.session.user.email || req.session.user;
    const { productId, variantSize } = req.body;
    // Find product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(500)
        .json({ success: false, message: "Product Unavailable!" });
    }

    // Find user
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User does not exist!" });
    }

    // Find or create cart for the user
    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id, items: [] });
    }

    // Check if selected variant is available and in stock
    const selectedVariant = product.variant.find((v) => v.size === variantSize);
    if (!selectedVariant || selectedVariant.stock === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Product is Out of Stock!" });
    }

    // Locate the item in the cart that matches the productId
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    // If item not found, return an error
    if (itemIndex === -1) {
      return res
        .status(500)
        .json({ success: false, message: "Product not in cart!" });
    }

    // Update the item's selectedSize in the cart
    cart.items[itemIndex].selectedSize = variantSize;
    await cart.save();

    res
      .status(200)
      .json({ success: true, message: "Item size updated successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error, please try again" });
  }
};

//axios route to update quantity along with other data
export const updateQuantity = async (req, res) => {
  try {
    const { itemId, quantity, selectedSize } = req.body;
    const userData = req.session.user.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
    }
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      res.status(500).json({ message: "Cart Not Find!" });
    }
    const item = cart.items.find((obj) => obj._id.equals(itemId));

    const product = await Product.findById(item.productId);
    if (!product) {
      return res
        .status(500)
        .json({ success: false, message: "Product Not Found!" });
    }

    const variant = product.variant.find((v) => v.size === selectedSize);

    if (variant.stock < quantity) {
      return res.status(409).json({
        success: false,
        message: `Out of Stock`,
      });
    }

    item.quantity = quantity;
    item.subTotal = product.price * item.quantity;
    item.subDiscount = (
      (product.price - (product.price * product.discount) / 100) *
      item.quantity
    ).toFixed();
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
    cart.totalDiscount = cart.items.reduce(
      (acc, item) => acc + item.subDiscount,
      0
    );
    const updatedCart = await cart.save();
    return res
      .status(200)
      .json({ success: true, message: "cart quantity updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId, cartId } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cartId) {
      return res
        .status(500)
        .json({ success: false, message: "Cart Not Found!" });
    }

    //this will remove that specific item and return an array !
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    //recalculate the totalPrice and totalDiscount here...
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
    cart.totalDiscount = cart.items.reduce(
      (acc, item) => acc + item.subDiscount,
      0
    );
    await cart.save();
    res.status(200).json({ success: true, message: "Item Removed From Cart!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const checkStock = async (req, res) => {
  try {
    const { cartId } = req.body;
    const cart = await Cart.findById(cartId).populate("items.productId");
    if (!cart) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
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

    res.status(200).json({ success: true, message: "proceed to checkout" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
