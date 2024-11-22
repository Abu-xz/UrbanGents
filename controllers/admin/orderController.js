import Order from "../../models/orderModel.js";
import PdfDocument from "pdfkit";

export const loadOrders = async (req, res) => {
  try {
    console.log("Order page request received");
    const orders = await Order.find()
      .populate("customerId")
      .populate("items.productId");
    if (!orders) {
      res.status(404).render("admin/order", { success: false }); //create a sweet alert for this
    }
    console.log(orders);
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
    console.log("Order status update request received");

    const { itemId, newStatus, orderId } = req.body;
    console.log(req.body);

    console.log(orderId.length);
    console.log(
      `Item ID: ${itemId}, New Status: ${newStatus}, Order ID: ${orderId}`
    );
    // Finding the order by its ID
    const order = await Order.findById(orderId);
    //   console.log(order)

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Finding the item in the order by its item ID
    const item = order.items.find((item) => item._id.equals(itemId));
    //   console.log(item);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found  order" });
    }

    // If the status is the same as the current one, no update needed
    if (item.status === newStatus) {
      return res.status(400).json({
        success: false,
        message: "No change detected in the order status",
      });
    }

    const statusOrder = [
      "pending",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ];
    const currentIndex = statusOrder.indexOf(item.status);
    const newIndex = statusOrder.indexOf(newStatus);

    if (newIndex < currentIndex) {
      return res.status(400).json({
        success: false,
        message: "Reverting to a previous status is not allowed",
      });
    }

    // Updating the item's status
    item.status = newStatus;

    // Saving the updated order
    await order.save();
    console.log(`Order updated successfully. New status: ${newStatus}`);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


//invoice download here
export const downloadInvoice = async (req, res) => {
  try {
    console.log("invoice download route reached");
    const { orderId } = req.query;
    console.log(orderId);
    

    const order = await Order.findById(orderId).populate('customerId').populate('items.productId')
    if (!order) {
      res.status(404).json("Order not found!");
    }
    console.log(order)
    const doc = new PdfDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');

    // Pipe the PDF document to the response
    doc.pipe(res);

    doc.fontSize(18).font('Helvetica-Bold').text(`Invoice for Order #${orderId}`, { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica').text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('Customer Details:');
    doc.fontSize(12).font('Helvetica').text(`Name: ${order.address.firstName} ${order.address.lastName}`);
    doc.text(`Phone: ${order.address.number}`);
    doc.text(`Address: ${order.address.address}`);
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('Items Purchased:');
    doc.moveDown(0.5);
    
    // Add a table-like structure for items
    order.items.forEach((item, index) => {
        doc.fontSize(12).font('Helvetica').text(`${index + 1}. ${item.productId.productName} - Qty: ${item.quantity} - Price: RS ${item.subDiscount}`);
    });
    
    doc.moveDown();
    
    if(order.couponApplied){
      doc.fontSize(14).text(`Applied coupon : "${order.couponApplied}"`)
      doc.fontSize(14).text(`Applied coupon : ${order.couponDiscount}%`)
    }
    doc.moveDown();

    doc.text(`Total: RS ${order.totalDiscount}`, { align: 'right' });
    doc.moveDown();
    
    doc.fontSize(10).font('Helvetica').text('Thank you for your purchase!', { align: 'center' });
    doc.text('If you have any questions regarding this invoice, please contact our support team.', { align: 'center' });
    

   
    // Finalize the PDF and send it to the client
    doc.end();
  } catch (error) {}
};
