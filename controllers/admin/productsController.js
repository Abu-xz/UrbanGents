import Category from "../../models/categoryModel.js";
import Product from "../../models/productModel.js";

export const loadProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");

    // console.log('populated product -',products);
    if (!products) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(200).render("admin/products", { products });
    }
  } catch (error) {
    console.log(error);
  }
};

export const loadAddProducts = async (req, res) => {
  const category = await Category.find({isActive:true});
  if (!category) {
    res.status(400).redirect("/admin/products");
  }
  res.status(200).render("admin/addProducts", { category });
};

export const addProducts = async (req, res) => {
  try {
    console.log("body parts ====", req.body);
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

    console.log("all field are here");
    const categoryDetails = await Category.findOne({
      categoryName: new RegExp(`^${category}$`, "i"),
    });

    if (!categoryDetails) {
      return res.status(400).render("admin/addProducts", {
        success: false,
        errorMessage: "Invalid category.",
      });
    }
    console.log("category available");

    const categoryId = categoryDetails._id;

    const newProduct = new Product({
      productName,
      category: categoryId,
      price,
      discount,
      stock,
      images: croppedImages,
      description,
      isActive: true,
      size,
    });

    await newProduct.save();
    console.log("product created ");
    console.log(newProduct);
    res.status(200).render("admin/addProducts", { success: true });
  } catch (error) {
    console.error(error);
    res.status(500).render("admin/addProducts", {
      success: false,
      errorMessage: "Failed to add product. Please try again.",
    });
  }
};

export const productBlockUnblock = async (req, res) => {
  try {
    console.log("product block axios reached");
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
      // console.log(product.isActive);
      const message = product.isActive
      ? "Product Unblocked successfully"
      : "Product blocked successfully";
      return res.status(200).json({ status: true, message: message });
    }
  } catch (error) {
    console.log(error);
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
    console.log(product);
    res.status(200).render("admin/editProducts", { product, category });
  } else {
    res.status(500).redirect("/admin/products");
  }

};



export const updateProduct = async (req, res) => {
  try {
    console.log("body parts ====", req.body);
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
    console.log(croppedImages);
    if (
      !productId||
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
    console.log("category available");

    const categoryId = categoryDetails._id;
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      productName: productName,
      category:categoryId,
      price:price,
      discount:discount,
      stock:stock,
      images:croppedImages,
      description:description,
      size:size,
    },{
      new:true
    });

    updatedProduct.save();
    console.log(" product updated");
    console.log(updatedProduct);
    res.status(200).render("admin/addProducts", { success: true });
  } catch (error) {
    console.error(error);
    res.status(500).render("admin/addProducts", {
      success: false,
      errorMessage: "Failed to add product. Please try again.",
    });
  }

}