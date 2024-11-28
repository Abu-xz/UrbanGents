import Category from "../../models/categoryModel.js";

export const loadCategory = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;
  const categories = await Category.find().skip(skip).limit(limit);
  const totalCategories = await Category.countDocuments();
  const totalPages = Math.ceil(totalCategories / limit);

  if (page > totalPages) {
    res
      .status(200)
      .redirect(`/admin/category?page=${totalPages}&limit=${limit}`);
  }
  if (!categories) {
    res.status(404).render('admin/category')
  } else {
    res.status(200).render("admin/category", {
      categories,
      currentPage: page,
      totalCategories,
      limit,
      totalPages,
    });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) {
      return res
        .status(400)
        .json({ success: false, message: "Oops! Category name is required" });
    }
    if (!/^[a-zA-Z]+$/.test(categoryName)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Category Name!" });
    }

    const isExist = await Category.findOne({ categoryName: categoryName });

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
      await category.save();
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occurred while category editing !" });
  }
};
