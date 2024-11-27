const generateBtn = document.getElementById("generate-button");
const downloadPdfButton = document.getElementById("pdf-button");
const downloadExcelButton = document.getElementById("excel-button");
const totalSalesCount =
  document.getElementById("totalSalesCount").textContent || 0;
const totalOrderAmount =
  document.getElementById("totalOrderAmount").textContent || 0;
const totalDiscount = document.getElementById("totalDiscount").textContent || 0;

async function fetchSalesReport() {
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

    if (data.success) {
      const salesData = data.salesData;
      document.getElementById("totalSalesCount").textContent =
        salesData.totalSalesCount;
      document.getElementById("totalOrderAmount").textContent =
        salesData.totalOrderAmount;
      document.getElementById("totalDiscount").textContent =
        salesData.totalDiscount;
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
    Swal.fire({
      title: "Error",
      text: "An error occurred while fetching the sales report. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}

generateBtn.addEventListener("click", fetchSalesReport);

downloadPdfButton.addEventListener("click", () => {
  const totalSalesCount =
    document.getElementById("totalSalesCount").textContent || 0;
  const totalOrderAmount =
    document.getElementById("totalOrderAmount").textContent || 0;
  const totalDiscount =
    document.getElementById("totalDiscount").textContent || 0;

  window.location.href = `/admin/sales-pdf?totalSalesCount=${totalSalesCount}&totalOrderAmount=${totalOrderAmount}&totalDiscount=${totalDiscount}`;
});

downloadExcelButton.addEventListener("click", () => {
  const totalSalesCount =
    document.getElementById("totalSalesCount").textContent || 0;
  const totalOrderAmount =
    document.getElementById("totalOrderAmount").textContent || 0;
  const totalDiscount =
    document.getElementById("totalDiscount").textContent || 0;
  window.location.href = `/admin/sales-excel?totalSalesCount=${totalSalesCount}&totalOrderAmount=${totalOrderAmount}&totalDiscount=${totalDiscount}`;
});
