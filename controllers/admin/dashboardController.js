import Order from "../../models/orderModel.js";
import Users from "../../models/userModel.js";

//dashboard routes
export const loadDashboard = (req, res) => {
  try {
    res.render("admin/dashboard");
  } catch (error) {
    console.log("error while load dashboard");
  }
};

export const fetchDashboardData = async (req, res) => {
  try {
    console.log("dashboard data fetch route reached");
    const { filter } = req.query;
    console.log(filter)
    let filterCondition = {};

    //  adjust date filtering based on the selected filter
    if (filter === "daily") {
      filterCondition.createdAt = { $gte: new Date().setHours(0, 0, 0, 0) };
    } else if (filter === "monthly") {
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      filterCondition.createdAt = { $gte: start };
    } else if (filter === "yearly") {
      const start = new Date();
      start.setFullYear(start.getFullYear() - 1);
      filterCondition.createdAt = { $gte: start };
    }

    // Get orders data based on filter
    const orders = await Order.find(filterCondition);
    console.log(orders)

    const sales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const revenue = orders.reduce((acc, order) => acc + order.totalPrice - order.totalDiscount, 0);
    const itemsSold = orders.reduce((acc, order) => acc + order.items.length, 0);

     // Get top products and categories 
     const topProducts = await Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            totalSales: { $sum: '$items.subTotal' },
          },
        },
        { $sort: { totalSales: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'products', // The name of your products collection
            localField: '_id',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        { $unwind: '$productDetails' }, // Unwind the productDetails array to access the product
        {
          $project: {
            _id: 0, // Hide the default _id field
            productName: '$productDetails.productName',
            totalSales: 1,
          },
        },
      ]);
      

      const topCategories = await Order.aggregate([
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        { $unwind: '$productDetails' }, // Unwind product details
        {
          $group: {
            _id: '$productDetails.category', // Group by category ID
            totalSales: { $sum: '$items.subTotal' },
          },
        },
        {
          $lookup: {
            from: 'categories', // Assuming you have a categories collection
            localField: '_id',
            foreignField: '_id',
            as: 'categoryDetails',
          },
        },
        { $unwind: '$categoryDetails' }, // Unwind category details
        {
          $project: {
            _id: 0, // Hide the default _id field
            categoryName: '$categoryDetails.categoryName',
            totalSales: 1,
          },
        },
        { $sort: { totalSales: -1 } },
      ]);

      

  const salesData = orders.map(order => order.totalPrice); // Replace with actual sales data for the chart
  const salesDates = orders.map(order => order.createdAt.toISOString().split('T')[0]);
  const usersCount = await Users.find().countDocuments();

      console.log(salesData)

 const data = {
    sales,
    revenue,
    itemsSold,
    usersCount, // Get total users from the database
    salesData,
    salesDates,
    topProducts,
    topCategories,
  }
  // console.log(data)
  res.json(data)

  } catch (error) {
    console.log('Error', error);
    res.status(500).json({success: false})
  }
};
