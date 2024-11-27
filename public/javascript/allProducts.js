// Elements
const searchInput = document.getElementById("search-input");
const filterSelect = document.getElementById("filter-select");
const sortSelect = document.getElementById("sort-select");

// Search Functionality
searchInput.addEventListener("change", () => {
  const searchValue = searchInput.value.trim();
  const queryParams = new URLSearchParams(window.location.search);

  // Update search parameter
  if (searchValue) {
    queryParams.set("search", searchValue);
  } else {
    queryParams.delete("search");
  }

  // Redirect with updated query
  window.location.href = `/user/all-products?${queryParams.toString()}`;
});

// Filter Functionality
filterSelect.addEventListener("change", (e) => {
  const category = filterSelect.value;
  const queryParams = new URLSearchParams(window.location.search);
  e.preventDefault;
  // Update category parameter
  if (category && category !== "all") {
    queryParams.set("category", category);
  } else {
    queryParams.delete("category");
  }

  // Redirect with updated query
  window.location.href = `/user/all-products?${queryParams.toString()}`;
});

// Sort Functionality
sortSelect.addEventListener("change", () => {
  const sortValue = sortSelect.value;
  const queryParams = new URLSearchParams(window.location.search);

  // Update sort parameter
  if (sortValue && sortValue !== "default") {
    queryParams.set("sort", sortValue);
  } else {
    queryParams.delete("sort");
  }

  // Redirect with updated query
  window.location.href = `/user/all-products?${queryParams.toString()}`;
});
