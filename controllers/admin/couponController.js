import Coupon from "../../models/couponModel.js";

export const loadCoupon = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 7;
    const skip = (page - 1) * limit;
    const totalCoupons = await Coupon.countDocuments();
    const totalPages = Math.ceil(totalCoupons / limit);
    if (page > totalPages) {
      return res.status(200).redirect(`/admin/coupons?page=${totalPages}`);
    }

    const coupons = await Coupon.find({ isActive: true })
      .skip(skip)
      .limit(limit);

    res.status(200).render("admin/coupon", { coupons, totalPages, page });
  } catch (error) {
    res.status(500).redirect("/admin/coupons/404");
  }
};

// edit coupon page loads here
export const loadEditCoupon = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    const coupon = await Coupon.findOne({ _id: couponId });
    res.status(200).render("admin/editCoupon", { coupon });
  } catch (error) {}
};

export const addCoupon = async (req, res) => {
  try {
    const { code, discount, expiry, start, usageLimit, id } = req.body;

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
    res.status(201).json({ success: true, message: "Coupon Created" });
  } catch (error) {}
};

// edit coupon logic here
export const editCoupon = async (req, res) => {
  try {
    const { code, discount, expiry, start, usageLimit, id } = req.body;

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
    res
      .status(500)
      .json({ success: false, message: "An error occurred", error });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;
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
    }
    res.status(200).json({ success: true, message: "Coupon deactivated" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "An error occurred", error });
  }
};
