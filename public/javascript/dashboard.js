
 // Function to fetch data from the backend
 async function fetchDashboardData() {
    const filter = document.getElementById("timeFilter").value || 'daily';
    const response = await axios.get(`/admin/dashboard/fetchData?filter=${filter}`);
    const data = response.data
    // Display the sales, revenue, and user count on dashboard cards
    const dashboardCards = document.getElementById("dashboardCards");
    dashboardCards.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">Today's Sales</h3>
        <p class="mt-2 text-xl">₹${data.sales}</p>
        <p class="text-gray-500 text-sm">We have sold ${data.itemsSold} items</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">Total Revenue</h3>
        <p class="mt-2 text-xl">₹${data.revenue}</p>
        <p class="text-gray-500 text-sm">Profit made so far</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">Users Count</h3>
        <p class="mt-2 text-xl">${data.usersCount}</p>
        <p class="text-gray-500 text-sm">Total users signed up</p>
      </div>
    `;

    // Update Sales Chart
    
    updateSalesChart(data.salesData, data.salesDates);

    // Update Top Products Chart
    updateTopProductsChart(data.topProducts);

    // Update Top Categories Chart
    updateTopCategoriesChart(data.topCategories);
  }

  // Sales chart update function
  function updateSalesChart(salesData, salesDates) {
    const options = {
      series: [{
        name: 'Sales',
        data: salesData
      }],
      chart: {
        type: 'line',
        height: 350 
      },
      colors:["#ff0000"],
      xaxis: {
        categories: salesDates
      },
    };

    const chart = new ApexCharts(document.querySelector("#sales-chart"), options);
    chart.render();
  }

  // Top Products chart update function
  function updateTopProductsChart(topProducts) {
    const options = {
      series: [{
        name: 'Sales',
        data: topProducts.map(product => product.totalSales || 0)
      }],
      chart: {
        type: 'bar',
        height: 350
      },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000', '#000000'], 
      xaxis: {
        categories: topProducts.map(product => product.productName || 'Unknown')
      },
    };

    const chart = new ApexCharts(document.querySelector("#product-chart"), options);
    chart.render();
  }

  // Top Categories chart update function
  function updateTopCategoriesChart(topCategories) {
    const options = {
      series: topCategories.map(category => category.totalSales || 0),
      chart: {
        type: 'pie',
        height: 350
      },
     colors: ["#ffff00", '#00ff00', '#0000ff', '#f00f00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000', '#000000'],
      labels: topCategories.map(category => category.categoryName || 'Unknown')
    };

    const chart = new ApexCharts(document.querySelector("#category-chart"), options);
    chart.render();
  }

  // Event listener for filter change
  document.getElementById("timeFilter").addEventListener("change", fetchDashboardData);

  // Initial fetch
 document.addEventListener('DOMContentLoaded', fetchDashboardData) 

