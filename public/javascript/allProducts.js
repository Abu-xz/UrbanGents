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

// Get the elements
const menuToggle = document.getElementById("menu-toggle");
const mobileSidebar = document.getElementById("mobile-sidebar");
const closeSidebar = document.getElementById("close-sidebar");

// Function to toggle sidebar
function toggleSidebar() {
  if (mobileSidebar.classList.contains("hidden")) {
    // Show the sidebar
    mobileSidebar.classList.remove("hidden");
    setTimeout(() => {
      mobileSidebar.classList.remove("translate-x-full");
      mobileSidebar.classList.add("translate-x-0");
    }, 10); // Slight delay to allow for transition
  } else {
    // Hide the sidebar
    mobileSidebar.classList.remove("translate-x-0");
    mobileSidebar.classList.add("translate-x-full");
    setTimeout(() => {
      mobileSidebar.classList.add("hidden");
    }, 300); // Wait for transition to finish before hiding
  }
}

// Toggle the mobile sidebar when the menu button is clicked
menuToggle.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent the event from closing the sidebar immediately
  toggleSidebar();
});

// Close the sidebar when the close button is clicked
closeSidebar.addEventListener("click", () => {
  toggleSidebar();
});

// Optionally close sidebar if clicking outside (only for mobile)
window.addEventListener("click", (e) => {
  if (!mobileSidebar.contains(e.target) && !menuToggle.contains(e.target)) {
    mobileSidebar.classList.remove("translate-x-0");
    mobileSidebar.classList.add("translate-x-full");
    setTimeout(() => {
      mobileSidebar.classList.add("hidden");
    }, 300);
  }
});


