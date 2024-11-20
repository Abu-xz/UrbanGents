import Order from "../../models/orderModel.js";

export const loadSalesReport = async (req, res ) => {
    try {
        let matchCriteria = {};
    
            matchCriteria.createdAt = {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lte: new Date(new Date().setHours(23, 59, 59, 999)),
            };
    
    
        const salesData = await Order.aggregate([
            { $match: matchCriteria },
            {
                $group: {
                    _id: null,
                    totalSalesCount: { $sum: 1 },
                    totalOrderAmount: { $sum: '$totalPrice' }, // Total price of all orders
                    totalDiscount: { $sum: '$totalDiscount' }, // Total discount applied to all orders
                    totalCouponsDeduction: { $sum: '$couponDiscount' }, // Total amount deducted using coupons
                },
            },
        ]);
    
        console.log(salesData)
        res.status(200).render('admin/salesReport', {salesData: salesData[0]})
    } catch (error) {
        console.error('Error fetching sales report:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching the sales report.' });
    }
    
    
}


export const fetchReport = async (req, res ) => {
    try {
        console.log('fetch data')
        const { reportType, startDate, endDate } = req.query;
        let matchCriteria = {};
        console.log(reportType)
    
        if (reportType === 'daily') {
            matchCriteria.createdAt = {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lte: new Date(new Date().setHours(23, 59, 59, 999)),
            };
        } else if (reportType === 'weekly') {
            const currentDate = new Date();
            const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
            matchCriteria.createdAt = { $gte: startOfWeek };
        } else if (reportType === 'yearly') {
            matchCriteria.createdAt = { $gte: new Date(new Date().getFullYear(), 0, 1) };
        } else if (reportType === 'custom') {
            if (startDate && endDate) {
                matchCriteria.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
            } else {
                return res.status(400).json({ success: false, message: 'Start and end date are required for custom reports.' });
            }
        }
    
        const salesData = await Order.aggregate([
            { $match: matchCriteria },
            {
                $group: {
                    _id: null,
                    totalSalesCount: { $sum: 1 },
                    totalOrderAmount: { $sum: '$totalPrice' }, // Total price of all orders
                    totalDiscount: { $sum: '$totalDiscount' }, // Total discount applied to all orders
                    totalCouponsDeduction: { $sum: '$couponDiscount' }, // Total amount deducted using coupons
                },
            },
        ]);
    
        if (!salesData.length) {
            return res.status(404).json({ success: false, message: 'No sales data found for the selected criteria.' });
        }
        console.log(salesData)
        res.status(200).json({ success: true, salesData: salesData[0]});
    } catch (error) {
        console.error('Error fetching sales report:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching the sales report.' });
    }
    
    
}