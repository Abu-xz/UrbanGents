import Category from "../../models/categoryModel.js";
import Offer from "../../models/offerModel.js";
import Product from "../../models/productModel.js";

export const loadOffer = async (req, res) => {
  try {
    const offers = await Offer.find({isActive: true});
    const categories = await Category.find({ isActive: true });
    res.status(200).render("admin/offer", { categories, offers });
  } catch (error) {
    console.log("Error occurred in loadOffer", error);
  }
};


export const createOffer = async (req, res) => {
  try {
    console.log('create offer route reached')
    const { category, discount, validFrom, offerName, validUntil } = req.body;

    if (!category || !discount || !offerName || !validFrom || !validUntil) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (discount <= 0 || discount > 100) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Discount percentage must be between 1 and 100.",
        });
    }

    if (new Date(validUntil) < new Date(validFrom)) {
      return res
        .status(400)
        .json({
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
    console.error("Error creating offer:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error. Please try again later.",
      });
  }
};
