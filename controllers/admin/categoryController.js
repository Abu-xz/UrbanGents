import Category from "../../models/categoryModel.js";

export const loadCategory = async (req, res) => {
  const categories = await Category.find();
  //   console.log(categories);
  res.status(200).render("admin/category", { categories });
};

export const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    // console.log("axios route reached for add category");
    if (!categoryName) {
      return res
        .status(400)
        .json({ success: false, message: "Oops! Category name is required" });
    }
    const isExist = await Category.findOne({ categoryName: categoryName });
    // console.log(isExist)
    if (!isExist) {
      const newCategory = new Category({
        categoryName,
        isActive: true,
      });
      await newCategory.save();
      res
        .status(200)
        .json({ success: true, message: "Category added successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Oops! Category already exists!" });
    }
  } catch (error) {
    console.log("Error adding category :-", error);
    res
      .status(500)
      .json({ success: false, message: "Server error! Try again" });
  }
};

export const blockCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (category) {
      category.isActive = false;
      await category.save();
      res
        .status(200)
        .json({ success: true, message: "Category blocked successfully" });
    } else {
      res.status(400).json({ success: false, message: "Category not found!" });
    }
  } catch (error) {
    console.log("Error blocking category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const unblockCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (category) {
      category.isActive = true;
      await category.save();
      res
        .status(200)
        .json({ success: true, message: "Category unblocked successfully" });
    } else {
      res.status(400).json({ success: false, message: "Category not found!" });
    }
  } catch (error) {
    console.log("Error unblocking category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { categoryId, newCategoryName } = req.body;
    
    if (!categoryId || !newCategoryName) {
      return res
        .status(400)
        .json({ success: false, message: "Category name/id required!" });
    }
    const category = await Category.findById(categoryId);
    if (category) {
      category.categoryName = newCategoryName;
      console.log("hello");
      await category.save();
      console.log(category.categoryName);
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Category not found" });
    }
  } catch (error) {}
};
