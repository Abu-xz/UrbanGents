import Category from "../../models/categoryModel.js";
import Product from "../../models/productModel.js";

export const loadProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find()
      .populate("category")
      .skip(skip)
      .limit(limit);
    if (!products) {
      return res.render("admin/product");
    } else {
      return res.status(200).render("admin/products", {
        products,
        currentPage: page,
        totalPages,
        limit,
      });
    }
  } catch (error) {
    return res.status(200).json({ message: error.message });
  }
};

export const loadAddProducts = async (req, res) => {
  const category = await Category.find({ isActive: true });
  if (!category) {
    res.status(400).redirect("/admin/products");
  }
  res.status(200).render("admin/addProducts", { category });
};

export const addProducts = async (req, res) => {
  try {
    const {
      productName,
      category,
      price,
      stock,
      discount,
      description,
      size,
      croppedImages,
    } = req.body;
    if (
      !productName ||
      !category ||
      !price ||
      !discount ||
      !stock ||
      !description ||
      !croppedImages ||
      !size
    ) {
      return res.status(400).render("admin/addProducts", {
        success: false,
        errorMessage: "All fields are required.",
      });
    }

    const categoryDetails = await Category.findOne({
      categoryName: new RegExp(`^${category}$`, "i"),
    });

    if (!categoryDetails) {
      return res.status(400).render("admin/addProducts", {
        success: false,
        errorMessage: "Invalid category.",
      });
    }

    //create an object for the size and stock array
    const arrayOfObjects = size.map((size, index) => ({
      size: size,
      stock: stock[index],
    }));

    const categoryId = categoryDetails._id;

    const newProduct = new Product({
      productName,
      category: categoryId,
      price,
      discount,
      variant: arrayOfObjects,
      images: croppedImages,
      description,
      isActive: true,
    });

    await newProduct.save();
    res.status(200).render("admin/addProducts", { success: true });
  } catch (error) {
    res.status(500).render("admin/addProducts", {
      success: false,
      errorMessage: "Failed to add product. Please try again.",
    });
  }
};

export const productBlockUnblock = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res
        .status(400)
        .json({ status: true, message: "Invalid product Id!" });
    }

    const product = await Product.findById(productId);
    if (product) {
      product.isActive = !product.isActive;
      await product.save();
      const message = product.isActive
        ? "Product Unblocked successfully"
        : "Product blocked successfully";
      return res.status(200).json({ status: true, message: message });
    }
  } catch (error) {
    return res.status(200).json({ message: error.message });
  }
};
export const loadEditProduct = async (req, res) => {
  const { id } = req.params;
  const category = await Category.find();
  const product = await Product.findById(id).populate("category");
  if (!category) {
    res.status(400).redirect("/admin/products");
  }

  if (product) {
    res.status(200).render("admin/editProducts", { product, category });
  } else {
    res.status(500).redirect("/admin/products");
  }
};

export const updateProduct = async (req, res) => {
  try {
      const {
      productId,
      productName,
      category,
      price,
      stock,
      discount,
      description,
      size,
      croppedImages,
    } = req.body;
    if (
      !productId ||
      !productName ||
      !category ||
      !price ||
      !discount ||
      !stock ||
      !description ||
      !croppedImages ||
      !size
    ) {
      return res.status(400).render("admin/products/edit", {
        success: false,
        errorMessage: "All fields are required.",
      });
    }

    const categoryDetails = await Category.findOne({
      categoryName: new RegExp(`^${category}$`, "i"),
    });

    if (!categoryDetails) {
      return res.status(400).render("admin/products/edit", {
        success: false,
        errorMessage: "Invalid category.",
      });
    }
    const arrayOfObjects = size.map((size, index) => ({
      size: size,
      stock: stock[index],
    }));

    const categoryId = categoryDetails._id;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        productName: productName,
        category: categoryId,
        price: price,
        discount: discount,
        images: croppedImages,
        description: description,
        variant: arrayOfObjects,
      },
      {
        new: true,
      }
    );

    updatedProduct.save();
    res.status(200).render("admin/products", { success: true });
  } catch (error) {
    res.status(500).render("admin/products", {
      success: false,
      errorMessage: "Failed to add product. Please try again.",
    });
  }
};
