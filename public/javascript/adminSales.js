const generateBtn = document.getElementById("generate-button");
const downloadPdfButton = document.getElementById("pdf-button");
const downloadExcelButton = document.getElementById("excel-button");
const totalSalesCount = document.getElementById("totalSalesCount").textContent||0
const totalOrderAmount = document.getElementById("totalOrderAmount").textContent || 0
const totalDiscount  = document.getElementById("totalDiscount").textContent || 0
const totalCouponAmount  = document.getElementById("totalCouponAmount").textContent || 0



downloadPdfButton.addEventListener("click", () => {
    console.log("pdf button clicked");
    window.location.href = `/admin/sales-pdf?totalSalesCount=${totalSalesCount}&totalOrderAmount=${totalOrderAmount}&totalDiscount=${totalDiscount}&totalCouponAmount=${totalCouponAmount}`;
  });
  
  downloadExcelButton.addEventListener("click", () => {
    console.log("excel button clicked");
    window.location.href = `/admin/sales-excel?totalSalesCount=${totalSalesCount}&totalOrderAmount=${totalOrderAmount}&totalDiscount=${totalDiscount}&totalCouponAmount=${totalCouponAmount}`;
  });


console.log("fetch report ");
async function fetchSalesReport() {
  console.log("button clicked");
  const reportType = document.getElementById("reportType").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  let query = `/admin/sales-report?reportType=${reportType}`;
  if (reportType === "custom" && startDate && endDate) {
    query += `&startDate=${startDate}&endDate=${endDate}`;
  }

  try {
    const response = await axios.get(query);
    const data = response.data;
    console.log("hello admin sales");

    if (data.success) {
      console.log(data);
      const salesData = data.salesData;
      document.getElementById("totalSalesCount").innerText =
        salesData.totalSalesCount;
      document.getElementById("totalOrderAmount").innerText =
        salesData.totalOrderAmount;
      document.getElementById("totalDiscount").innerText =
        salesData.totalDiscount;

      const totalCouponAmount = (
        (salesData.totalOrderAmount * salesData.totalCouponsDeduction) /
        100
      ).toFixed(2);
      document.getElementById("totalCouponAmount").innerText =
        totalCouponAmount;
      Swal.fire({
        title: "Report Generated!",
        text: "Sales report has been successfully fetched.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "No Data",
        text: "No sales data found for the selected criteria.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  } catch (error) {
    // console.error('Error fetching sales report:', error);

    Swal.fire({
      title: "Error",
      text: "An error occurred while fetching the sales report. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}


generateBtn.addEventListener("click", fetchSalesReport);



