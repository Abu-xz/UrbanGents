import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import Users from "../../models/userModel.js";

export const loadProfile = async (req, res) => {
  try {
    let user;
    const data = req.session?.user?.email || req.session?.user;
    // console.log("data here", data);
    if (req.session.user.email) {
      user = await Users.findOne({ email: data });
      //   console.log("normal user :", user);
    } else if (req.session.user) {
      user = await Users.findOne({ googleId: data });
      //   console.log("google User  :", user);
    }

    if (!user) {
      return res.status(500).render("user/userHome", { success: false });
    }
    console.log(user);

    const successMessage = req.session.successMessage;
    const errorMessage = req.session.errorMessage;

    res
      .status(200)
      .render("user/profile", { user, successMessage, errorMessage });
    // clear session message after rendering
    req.session.successMessage = null;
    req.session.errorMessage = null;
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: 'Error , user profile can"t access' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("update profile route reached");
    const userData = req.session.user.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });

    if (!user) {
      res.status(500).redirect("/user/profile");
    }

    if (user.googleId) {
      const { firstName, lastName } = req.body;

      // if (!firstName || !lastName) {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: "All field are required!" });
      // }

      user.firstName = firstName;
      user.lastName = lastName;
      user.save();
      return res.status(200).redirect("/user/profile");
    } else {
      const { firstName, lastName, phoneNumber } = req.body;
      // console.log(firstName, lastName, phoneNumber);

      // if (!firstName || !lastName || !phoneNumber) {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: "All field are required!" });
      // }

      user.firstName = firstName;
      user.lastName = lastName;
      await user.save();
      return res.status(200).redirect("/user/profile");
    }
  } catch (error) {
    console.log("Error", error);
    res.redirect("/user/profile");
  }
};

export const loadAddress = async (req, res) => {
  try {
    let user;
    //check the user is google or normal
    const data = req.session?.user?.email || req.session?.user;
    // console.log("data here", data);
    if (req.session.user.email) {
      user = await Users.findOne({ email: data });
      // console.log("normal user :", user);
    } else if (req.session.user) {
      user = await Users.findOne({ googleId: data });
      // console.log("google User  :", user);
    }

    if (!user) {
      return res.status(500).render("user/home", { success: false });
    } else {
      res.status(200).render("user/userAddress", { user });
    }
  } catch (error) {
    console.log("Error", error.message);
  }
};

export const addAddress = async (req, res) => {
  try {
    console.log("axios address route reached");

    let user;
    const userData = req.session?.user?.email || req.session?.user;
    console.log("data here", userData);

    if (req.session.user.email) {
      user = await Users.findOne({ email: userData });
      console.log("normal user :", userData);
    } else if (req.session.user) {
      user = await Users.findOne({ googleId: userData });
      console.log("google User  :", userData);
    }

    if (!user)
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });

    const {
      firstName,
      lastName,
      pincode,
      addressType,
      state,
      phoneNumber,
      city,
      landmark,
      district,
      address,
      setDefault,
    } = req.body;
    console.log(req.body);

    const newAddress = {
      firstName,
      lastName,
      pincode,
      addressType,
      state,
      number: phoneNumber,
      city,
      landmark,
      district,
      address,
      setDefault,
    };

    if (setDefault) {
      const defaultAddress = user.addresses.find((addr) => addr.isDefault);
      console.log(defaultAddress);
      if (defaultAddress) {
        defaultAddress.isDefault = false;
      }
    }

    user.addresses.push(newAddress);
    await user.save();
    console.log(user);
    res
      .status(200)
      .json({ success: true, message: "Address added successfully!" });
  } catch (error) {
    console.log("Error", error.message);
  }
};

export const loadEditAddress = async (req, res) => {
  try {
    console.log("edit address route reached ");
    let user;
    const addressId = req.query.id;
    const userData = req.session.user.email || req.session.user;
    if (req.session.user.email) {
      user = await Users.findOne({ email: userData });
    } else if (req.session.user) {
      user = await Users.findOne({ googleId: userData });
    }
    if (!user) {
      return res.status(500).redirect("/user/profile/address");
    } else {
      const address = user.addresses.id(addressId);
      res.status(200).render("user/editAddress", { user, address });
    }
  } catch (error) {
    console.log("Error", error.message);
  }
};

export const editAddress = async (req, res) => {
  try {
    console.log("axios address route reached");

    let user;
    const userData = req.session?.user?.email || req.session?.user;
    console.log("data here", userData);

    if (req.session.user.email) {
      user = await Users.findOne({ email: userData });
      // console.log("normal user :", userData);
    } else if (req.session.user) {
      user = await Users.findOne({ googleId: userData });
      // console.log("google User  :", userData);
    }

    if (!user)
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });

    const {
      addressId,
      firstName,
      lastName,
      pincode,
      addressType,
      state,
      phoneNumber,
      city,
      landmark,
      district,
      address,
      setDefault,
    } = req.body;
    console.log(req.body);

    const newAddress = {
      firstName,
      lastName,
      pincode,
      addressType,
      state,
      number: phoneNumber,
      city,
      landmark,
      district,
      address,
      isDefault: setDefault,
    };

    if (setDefault) {
      const defaultAddress = user.addresses.find(
        (addr) => addr.isDefault && addr._id.toString() !== addressId
      );
      console.log(defaultAddress);
      if (defaultAddress) {
        defaultAddress.isDefault = false;
      }
    }

    const addressToUpdate = user.addresses.id(addressId);
    if (addressToUpdate) {
      addressToUpdate.set(newAddress);
      await user.save();
      console.log(user.addresses.id(addressId));

      return res
        .status(200)
        .json({ success: true, message: "Address updated successfully!" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Address not found" });
  } catch (error) {
    console.log("Error", error.message);
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    console.log(addressId);

    let user;
    const userData = req.session?.user?.email || req.session?.user;
    // console.log("data here", userData);

    if (req.session.user.email) {
      user = await Users.findOneAndUpdate(
        { email: userData },
        { $pull: { addresses: { _id: addressId } } },
        { new: true }
      );
      user.save();

      // console.log("normal user :", userData);
    } else if (req.session.user) {
      user = await Users.findOneAndUpdate(
        { googleId: userData },
        { $pull: { addresses: { _id: addressId } } },
        { new: true }
      );
      user.save();
    }

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Internal Server Error!" });

    return res
      .status(200)
      .json({ success: true, message: "Address deleted Successfully!" });
  } catch (error) {
    console.log(error);
  }
};

export const loadOrders = async (req, res) => {
  try {
    console.log("profile order route reached");
    const userData = req.session.user.email || req.session.user;

    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });

    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not Exists!" });
    }

    const orders = await Order.find({ customerId: user._id })
      .populate("items.productId")
      .sort({ createdAt: -1 });
    // console.log("User order ", orders);
    // console.log(orders[0]?.items);

    // console.log(user);

    res.status(200).render("user/userOrders", { orders, user });
  } catch (error) {
    console.log(error);
  }
};

export const orderDetails = async (req, res) => {
  try {
    console.log("User order details page reached");
    const orderId = req.query.orderId;
    console.log(orderId);
    const orderDetails = await Order.findById(orderId).populate(
      "items.productId"
    );
    if (!orderDetails) {
      return res.status(404).redirect("/user/profile/orders");
    }
    console.log(orderDetails);
    let displayInvoice = false;
    displayInvoice = orderDetails.items.every(item => item.status === 'delivered');
    console.log(displayInvoice);
    if(orderDetails.paymentStatus !== 'paid'){
      displayInvoice = false
    }

    res.status(200).render("user/userOrderDetails", { orderDetails, displayInvoice });
  } catch (error) {
    console.log(error);
  }
};

export const cancelOrder = async (req, res) => {
  try {
    console.log("cancel order route reached");
    const userData = req.session.user.email || req.session.user;
    const { itemId, orderId } = req.body;

    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });

    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not Exists!" });
    }

    // console.log("item id :", itemId);
    // console.log("order id :", orderId);

    const order = await Order.findById(orderId);
    // console.log(order);
    const item = order.items.find((item) => item._id.toString() === itemId);
    // console.log(item);

    if (order.paymentMethod == "razorpay") {
      // console.log(order.paymentMethod)
      item.status = "cancelled";
      user.walletAmount += item.subDiscount;

      const transaction = {
        amount :item.subDiscount,
        orderId,
        transactionType: 'Credit',
      }
      user.transaction.push(transaction);

      await user.save();
      await order.save();
      // console.log(user.walletAmount)
      // console.log(user.transaction)
      return res.status(200).json({ success: true });
    } else {
      item.status = "cancelled";
      await order.save();
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log("Error occurred when cancel order", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

// wishlist route logic here

export const loadWishlist = async (req, res) => {
  try {
    const userData = req.session.user.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    }).populate("wishlist");

    const wishlist = user.wishlist;
    console.log(wishlist);

    res.status(200).render("user/userWishlist", { wishlist , user});
  } catch (error) {
    console.log("Error occurred when cancel order", error.message);
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userData = req.session.user.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });

    if (!user) {
      return res.status(302).json({ message: "User Not found" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(500).json({ message: "Product Not found" });
    }

    // console.log(product);

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
      return res
        .status(201)
        .json({ success: true, message: "Product added to wishlist" });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Product Already exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeItemFromWishlist = async (req, res) => {
  try {
    console.log("remove item from wishlist route reached");
    const { productId } = req.body;
    const userData = req.session.user.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });

    if (!user) {
      return res.status(302).json({ message: "User Not found" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(500).json({ message: "Product Not found" });
    }

    // This will Remove the product ID from the wishlist...
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();
    res.json({ success: true, message: "Product removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loadWallet = async (req, res) => {
  try {
    const userData = req.session.user.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });

    if (!user) {
      return res.status(302).json({ message: "User Not found" });
    }

    console.log("wallet route reached");
    res.status(200).render("user/userWallet", { user });
  } catch (error) {}
};
