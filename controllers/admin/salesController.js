import Order from "../../models/orderModel.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

export const loadSalesReport = async (req, res) => {
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
          totalOrderAmount: { $sum: "$totalPrice" }, // Total price of all orders
          totalDiscount: { $sum: "$totalDiscount" }, // Total discount applied to all orders
        },
      },
    ]);

    return res
      .status(200)
      .render("admin/salesReport", { salesData: salesData[0] });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the sales report.",
    });
  }
};

export const fetchReport = async (req, res) => {
  try {
    const { reportType, startDate, endDate } = req.query;
    let matchCriteria = {};

    if (reportType === "daily") {
      matchCriteria.createdAt = {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      };
    } else if (reportType === "weekly") {
      const currentDate = new Date();
      const startOfWeek = new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay())
      );
      matchCriteria.createdAt = { $gte: startOfWeek };
    } else if (reportType === "yearly") {
      matchCriteria.createdAt = {
        $gte: new Date(new Date().getFullYear(), 0, 1),
      };
    } else if (reportType === "custom") {
      if (startDate && endDate) {
        matchCriteria.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else {
        return res.status(400).json({
          success: false,
          message: "Start and end date are required for custom reports.",
        });
      }
    }

    const salesData = await Order.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: null,
          totalSalesCount: { $sum: 1 },
          totalOrderAmount: { $sum: "$totalPrice" }, // Total price of all orders
          totalDiscount: { $sum: "$totalDiscount" }, // Total discount applied to all orders
        },
      },
    ]);

    if (!salesData.length) {
      return res.status(200).json({
        success: false,
        message: "No sales data found for the selected criteria.",
      });
    }
    return res.status(200).json({ success: true, salesData: salesData[0] });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the sales report.",
    });
  }
};

export const downloadSalesPdf = async (req, res) => {
  try {
    const { totalSalesCount, totalOrderAmount, totalDiscount } = req.query;

    const doc = new PDFDocument();

    // Set the response headers to download the file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="sales_report.pdf"'
    );

    doc.pipe(res);

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Sales Report", { underline: true, align: "left" })
      .moveDown();

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Total Items Sold:`, { continued: true })
      .font("Helvetica-Bold")
      .text(` ${totalSalesCount}`, { align: "right" });

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Total Order Amount:`, { continued: true })
      .font("Helvetica-Bold")
      .text(` ${totalOrderAmount}`, { align: "right" });

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Total Discount:`, { continued: true })
      .font("Helvetica-Bold")
      .text(` ${totalDiscount}`, { align: "right" });

    doc.moveDown();

    doc
      .fontSize(10)
      .font("Helvetica-Oblique")
      .text("Thank you for your business!", { align: "center" });
    doc.text("If you have any questions, please contact our support team.", {
      align: "center",
    });

    // Finalize the PDF
    doc.end();
  } catch (error) {
    res.status(500).redirect("/admin/sales");
  }
};
export const downloadSalesExcel = async (req, res) => {
  try {
    const { totalSalesCount, totalOrderAmount, totalDiscount } = req.query;
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales_Report");

    // Add column headers with styles
    worksheet.columns = [
      { header: "Metric", key: "metric", width: 40 },
      { header: "Value", key: "value", width: 30 },
    ];

    // Apply styles to header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF007BFF" }, // Blue background
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add rows for the metrics with light styling
    const rows = [
      ["Total Sales Count", totalSalesCount],
      ["Total Order Amount", `₹${totalOrderAmount}`],
      ["Total Discount", `₹${totalDiscount}`],
    ];

    rows.forEach((row, index) => {
      const addedRow = worksheet.addRow({ metric: row[0], value: row[1] });

      // Apply border styling to each cell
      addedRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };

        // Add alternating row background colors for better readability
        if (index % 2 === 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF2F2F2" }, // Light grey background
          };
        }
      });
    });

    // Add a footer row
    const footerRow = worksheet.addRow({
      metric: "Thank you for your business!",
      value: "",
    });
    footerRow.getCell(1).alignment = { horizontal: "center" };
    footerRow.getCell(1).font = { italic: true, bold: true };
    footerRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE7F3FF" }, // Light blue background
    };
    footerRow.getCell(1).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // Set response headers to download the Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="sales_report.xlsx"'
    );

    // Write the file to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).redirect("/admin/sales");
  }
};
