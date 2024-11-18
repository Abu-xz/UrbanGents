import Coupon from "../../models/couponModel.js";

export const loadCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    console.log(coupons);
    // console.log(coupons.forEach((coupon, index) => console.log(index)));
    res.status(200).render("admin/coupon", { coupons });
  } catch (error) {}
};

// edit coupon page loads here
export const loadEditCoupon = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    console.log(couponId);
    const coupon = await Coupon.findOne({ _id: couponId });
    console.log(coupon);
    res.status(200).render("admin/editCoupon", { coupon });
  } catch (error) {}
};

export const addCoupon = async (req, res) => {
  try {
    console.log("coupon add route reached ");
    const { code, discount, expiry, start, usageLimit, id } = req.body;

    console.log(code);
    console.log(discount);
    console.log(start);
    console.log(expiry);
    console.log(usageLimit);

    if (!code || !discount || !start || !expiry || !usageLimit) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid field values!" });
    }

    //Add more validation here if needed
    const couponData = {
      code,
      discountPercentage: discount,
      expiryDate: expiry,
      startDate: start,
      usageLimit,
    };
    const newCoupon = new Coupon(couponData);
    await newCoupon.save();
    console.log(newCoupon);
    res.status(201).json({ success: true, message: "Coupon Created" });
  } catch (error) {
    console.log("error occurred", error);
  }
};

// edit coupon logic here
export const editCoupon = async (req, res) => {
  try {
    console.log("coupon edit route reached ");
    const { code, discount, expiry, start, usageLimit, id } = req.body;
    console.log(id);

    if (!code || !discount || !start || !expiry || !usageLimit) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid field values!" });
    }

    const couponData = {
      code,
      discountPercentage: discount,
      expiryDate: expiry,
      startDate: start,
      usageLimit,
    };
    // Find the coupon by ID and update it with new data
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, couponData, {
      new: true,
    });
    res
      .status(200)
      .json({ success: true, message: "Coupon updated", data: updatedCoupon });
  } catch (error) {
    console.log("error occurred", error);
    res
      .status(500)
      .json({ success: false, message: "An error occurred", error });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    console.log("coupon delete route reached");
    const { couponId } = req.body;
    console.log(couponId);
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      { isActive: false },
      { new: true }
    );

     // Check if the coupon was found and updated
     if (!updatedCoupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found!" });
    };
    console.log(updatedCoupon)
    res.status(200).json({ success: true, message: "Coupon deactivated"});

  } catch (error) {
    console.log("error occurred", error);
    res
      .status(500)
      .json({ success: false, message: "An error occurred", error });
  }
};
