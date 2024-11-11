import Cart from "../../models/cartModel.js";
import Users from "../../models/userModel.js";
import Product from "../../models/productModel.js";

export const loadCart = async (req, res) => {
  try {
    const userData = req.session.user.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });
    if (!user) {
      return res.status(302).redirect("/user/home");
    }
    // console.log("user data here : ", user);

    const cart = await Cart.findOne({ userId: user._id }).populate(
      "items.productId"
    );

    console.log("Cart data here in loadAdd toCart", cart);

    if (!cart) {
      return res.status(200).render("user/cart");
    }

    res.status(200).render("user/cart", { cart });
  } catch (error) {
    console.log(error.message);
  }
};

// Add to cart
export const addItemToCart = async (req, res) => {
  try {
    console.log("add to cart route reached");
    const userData = req.session.user.email || req.session.user;
    const { productId, variantSize } = req.body;
    // console.log(productId, variantSize)
    const product = await Product.findById(productId);
    // console.log(product);
    if (!product) {
      return res
        .status(500)
        .json({ success: false, message: "Product Unavailable!" });
    }

    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });

    // console.log(user);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not Exists!" });
    }

    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id, items: [] });
    }

    const itemExists = cart.items.find((item) =>
      item.selectedSize === variantSize
    );
    // console.log(variantSize);
    const selectedVariant = product.variant.find((v) => v.size === variantSize);
    // console.log(selectedVariant);

    if (selectedVariant.stock === 0) {
      return res
        .status(200)
        .json({ success: false, message: "Product is Out of Stock!" });
    }
    const selectedSize = variantSize || selectedVariant.size;
    console.log(selectedSize);

    if (itemExists) {
      console.log("already exists item :", itemExists);
      return res
        .status(400)
        .json({ success: false, message: "Item already in Cart!" });
    }

    console.log("cart product push here");

    const subDiscount = Math.trunc(
      product.price - (product.price * product.discount) / 100
    );

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
    console.log("Patch route reached");

    const userData = req.session.user.email || req.session.user;
    const { productId, variantSize } = req.body;
    // console.log(productId, variantSize);
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
    console.error("Error updating size:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error, please try again" });
  }
};

//axios route to update quantity along with other data
export const updateQuantity = async (req, res) => {
  try {
    console.log("quantity update route reached");
    const { itemId, quantity, selectedSize } = req.body;
    console.log(itemId, quantity, selectedSize);
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
    // console.log(cart);
    const item = cart.items.find((obj) => obj._id.equals(itemId));
    // console.log(item);

    const product = await Product.findById(item.productId);
    if (!product) {
      return res
        .status(500)
        .json({ success: false, message: "Product Not Found!" });
    }
    // console.log('here product variant',product.variant);

    const variant = product.variant.find((v) => v.size === selectedSize);
    console.log("this is selected size variant", variant);

    if (variant.stock < quantity) {
      return res.status(409).json({
        success: false,
        message: `Out of Stock`,
      });
    }

    // console.log(product)
    item.quantity = quantity;
    item.subTotal = product.price * item.quantity;
    item.subDiscount =
      Math.trunc(product.price - (product.price * product.discount) / 100) *
      item.quantity;
    // console.log('item find',item);
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
    cart.totalDiscount = cart.items.reduce(
      (acc, item) => acc + item.subDiscount,
      0
    );
    const updatedCart = await cart.save();
    // console.log(updatedCart);
    return res
      .status(200)
      .json({ success: true, message: "cart quantity updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    console.log("delete axios route reached");
    const { itemId, cartId } = req.body;
    // there is an alternative way :just find the item using id and pull from the array
    const cart = await Cart.findById(cartId);
    if (!cartId) {
      return res
        .status(500)
        .json({ success: false, message: "Cart Not Found!" });
    }

    // console.log(cart);
    //this will remove that specific item and return an array !
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    //recalculate the totalPrice and totalDiscount here...
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
    cart.totalDiscount = cart.items.reduce(
      (acc, item) => acc + item.subDiscount,
      0
    );
    await cart.save();
    // console.log(cart);
    res.status(200).json({ success: true, message: "Item Removed From Cart!" });
  } catch (error) {
    console.log("Error", error);
  }
};

export const checkStock = async (req, res) => {
  try {
    const { cartId } = req.body;
    console.log(cartId);
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
      
        return res
          .status(200)
          .json({
            success: false,
            message: `The product ${item.productId.productName} is Out Of Stock`,
          });
      }
    }

    res.status(200).json({ success: true, message: "proceed to checkout" });
  } catch (error) {
    console.log("Error ", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error. Please try again later.",
      });
  }
};
