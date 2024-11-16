import Order from "../../models/orderModel.js";

export const loadOrders = async (req, res) => {
  try {
      console.log('Order page request received');
    const orders = await Order.find()
      .populate("customerId")
      .populate("items.productId");
    if (!orders) {
      res.status(404).render("admin/order", { success: false }); //create a sweet alert for this
    }
    console.log(orders)
    res.status(200).render("admin/order", { orders });
  } catch (error) {
    console.log(error);
  }
};

export const loadOrderDetails = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const orderDetails = await Order.findById(orderId)
      .populate("customerId")
      .populate("items.productId");
    if (!orderDetails) {
      res.status(404).render("admin/order", { success: false }); //create a sweet alert for this
    }
    // console.log(orderDetails);
    
    res.status(200).render("admin/orderDetails", { orderDetails });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
    try {
      console.log('Order status update request received');
      
      const { itemId, newStatus, orderId } = req.body;
      console.log(req.body);
      
    console.log( orderId.length)
      console.log(`Item ID: ${itemId}, New Status: ${newStatus}, Order ID: ${orderId}`);
      // Finding the order by its ID
      const order = await Order.findById(orderId);
    //   console.log(order)
      
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
  
      // Finding the item in the order by its item ID
      const item = order.items.find(item => item._id.equals(itemId));
    //   console.log(item);
      
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found  order' });
      }
  
      // If the status is the same as the current one, no update needed
      if (item.status === newStatus) {
        return res.status(400).json({
          success: false,
          message: 'No change detected in the order status'
        });
      }
  
      const statusOrder = ['pending', 'shipped', 'delivered', 'cancelled', "returned"];
      const currentIndex = statusOrder.indexOf(item.status);
      const newIndex = statusOrder.indexOf(newStatus);
  
      if (newIndex < currentIndex) {
        return res.status(400).json({
          success: false,
          message: 'Reverting to a previous status is not allowed'
        });
      }
  
      // Updating the item's status
      item.status = newStatus;
  
      // Saving the updated order
      await order.save();
      console.log(`Order updated successfully. New status: ${newStatus}`);
  
      return res.status(200).json({
        success: true,
        message: 'Order status updated successfully'
      });
  
    } catch (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    }
  };
  