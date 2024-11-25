import Category from "../../models/categoryModel.js";
import Product from "../../models/productModel.js";
import Offer from "../../models/offerModel.js";

export const loadAllProduct = async (req, res) => {
  try {
    console.log("all product route reached");

    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    if (page > totalPages) {
      return res.status(200).redirect(`/user/all-products?page=${totalPages}`);
    }

    const { search, category, sort } = req.query;
    console.log("Search value:", search);
    console.log("Category value:", category);
    console.log("Sort value:", sort);

    let query = {};
    let sortOption = {};

    if (search) {
      query.productName = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (sort) {
      switch (sort) {
        case "priceLowHigh":
          sortOption.price = 1;
          break;
        case "priceHighLow":
          sortOption.price = -1;
          break;
        case "smallToLarge":
          sortOption.productName = 1;
          break;
        case "largeToSmall":
          sortOption.productName = -1;
          break;
        default:
          break;
      }
    }

    const allProduct = await Product.find(query)
      .collation({ locale: "en", strength: 1 })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    let productNotFound = false;
    if (!allProduct || allProduct.length === 0) {
      productNotFound = true;
    }

    const categories = await Category.find();

    res.status(200).render("user/userAllProducts", {
      allProduct,
      categories,
      productNotFound,
      sort,
      category,
      search,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
};

export const loadProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate("category");

    const activeOffers = await Offer.find({}).sort({ discountPercentage: -1 });

    console.log(activeOffers);
    // console.log(product);
    const offer = activeOffers.find(
      (offer) => offer.category === product.category.categoryName
    );
    // console.log(offer);
    const offerDiscount = offer?.discountPercentage;
    console.log(offerDiscount);

    const relatedProduct = await Product.find({ isActive: true }).limit(4);
    if (product) {
      res.status(200).render("user/productDetails", {
        product,
        relatedProduct,
        offerDiscount,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
