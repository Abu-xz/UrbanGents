import Category from "../../models/categoryModel.js";
import Offer from "../../models/offerModel.js";

export const loadOffer = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 7;
    const skip = (page - 1) * limit;
    const totalOffers = await Offer.countDocuments();
    const totalPages = Math.ceil(totalOffers / limit);
    const offers = await Offer.find({ isActive: true }).skip(skip).limit(limit);
    const categories = await Category.find({ isActive: true });
    if (offers.length === 0) {
      return res.status(404).render("admin/offer", {categories});
    }
    if (page > totalPages) {
      return res.status(200).redirect(`/admin/offers?page=${totalPages}`);
    }
    res
      .status(200)
      .render("admin/offer", { categories, offers, page, totalPages });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const createOffer = async (req, res) => {
  try {
    const { category, discount, validFrom, offerName, validUntil } = req.body;

    if (!category || !discount || !offerName || !validFrom || !validUntil) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (discount <= 0 || discount > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount percentage must be between 1 and 100.",
      });
    }

    if (new Date(validUntil) < new Date(validFrom)) {
      return res.status(400).json({
        success: false,
        message: "'Valid Until' date must be later than 'Valid From' date.",
      });
    }

    const newOffer = new Offer({
      category,
      discountPercentage: discount,
      offerName,
      validFrom,
      validUntil,
    });

    // Save the offer to the database
    await newOffer.save();
    res.json({ success: true, message: "Offer created successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const loadEditOffer = async (req, res) => {
  try {
    const { offerId } = req.query;

    const offer = await Offer.findById(offerId);
    const categories = await Category.find({ isActive: true });
    const selectedCategory = offer.category;
    res.status(200).render("admin/editOffer", {
      offer,
      offerId,
      categories,
      selectedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const { offerId, category, discount, offerName, validFrom, validUntil } =
      req.body;

    const offer = await Offer.findById(offerId);

    if (!category || !discount || !offerName || !validFrom || !validUntil) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (discount <= 0 || discount > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount percentage must be between 1 and 100.",
      });
    }

    if (new Date(validUntil) < new Date(validFrom)) {
      return res.status(400).json({
        success: false,
        message: "'Valid Until' date must be later than 'Valid From' date.",
      });
    }

    offer.category = category;
    offer.discountPercentage = discount;
    offer.offerName = offerName;
    offer.validFrom = validFrom;
    offer.validUntil = validUntil;
    await offer.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const { offerId } = req.body;
    const offer = await Offer.findById(offerId);

    offer.isActive = !offer.isActive;
    await offer.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};



