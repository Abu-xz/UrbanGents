
import Product from "../../models/productModel.js";

export const loadProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const relatedProduct = await Product.find({ isActive: true }) 
      .limit(4);

    // console.log(productId)
    const product = await Product.findById(productId);
    if (product) {
      res
        .status(200)
        .render("user/productDetails", { product, relatedProduct });
    }
  } catch (error) {
    console.log(error);
  }
};

export const loadAllProduct = async (req, res) => {
  try {
    console.log('all product route reached')
    const allProduct = await Product.find({ isActive: true, isDeleted: false });
    if (!allProduct) {
      return res.status(200).redirect("/user/home");
    }
    console.log(allProduct);
    res.status(200).render('user/userAllProducts', {allProduct});
  } catch (error) {
    console.log(error);
  }
};
