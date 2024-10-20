import Category from "../../models/categoryModel.js";
import Product from "../../models/productModel.js";



export const loadProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    // console.log('populated product -',products);
    if(!products){
      return res.status(500).json({message: 'Internal server error'})
    }else{
      return res.status(200).render("admin/products", { products });
    }
  } catch (error) {
    console.log(error);
  }
};


export const loadAddProducts = (req, res) => {
  res.status(200).render("admin/addProducts");
};

export const addProducts = async (req, res) => {
  try {
    console.log('body parts ====',req.body);
    const { productName, category, price, stock, description, size, croppedImages } = req.body;

    if (!productName || !category || !price || !stock || !description || !croppedImages || !size) {
      return res.status(400).render('admin/addProducts', { success: false, errorMessage: 'All fields are required.' });
    }
    const categoryDetails = await Category.findOne({ categoryName: new RegExp(`^${category}$`, 'i')  });
    
    if (!categoryDetails) {
      return res.status(400).render('admin/addProducts', { success: false, errorMessage: 'Invalid category.' });
    }
    const categoryId = categoryDetails._id;

    const newProduct = new Product({
      productName, 
      category: categoryId,  
      price,
      stock,
      images: croppedImages, 
      description,
      isActive: true,
      size
    });

    await newProduct.save();
    console.log(newProduct);
    res.status(200).render('admin/addProducts', { success: true });

  } catch (error) {
    console.error(error);
    res.status(500).render('admin/addProducts', { success: false, errorMessage: 'Failed to add product. Please try again.' });
  }
};
