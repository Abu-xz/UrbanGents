const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((cartBtn) => {
  cartBtn.addEventListener("click", (event) => {
    const productId = cartBtn.getAttribute("data-id");
    const variantSize = cartBtn.getAttribute("data-variant");

    axios
      .post("/user/cart/add", { productId, variantSize })
      .then((response) => {
        if (response.data.success) {
          Swal.fire({
            title: response.data.title,
            icon: "success",
            text: response.data.message,
            confirmButtonText: "View Cart",
            showCancelButton: true,
            cancelButtonText: "Continue Shopping!",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/user/cart";
            }
          });
        } else {
          Swal.fire({
            title: "Out of Stock",
            icon: "warning",
            text: response.data.message,
          });
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          Swal.fire({
            title: "Already Exists!",
            icon: "info",
            text: error.response.data.message,
            confirmButtonText: "View Cart",
            showCancelButton: true,
            cancelButtonText: "Continue Shopping!",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/user/cart";
            }
          });
        }
      });
  });
});
// Get the elements
const menuToggle = document.getElementById('menu-toggle');
const mobileSidebar = document.getElementById('mobile-sidebar');
const closeSidebar = document.getElementById('close-sidebar');
const contentSection = document.getElementById('content-section');

// Function to toggle sidebar
function toggleSidebar() {
  if (mobileSidebar.classList.contains('hidden')) {
    // Show the sidebar
    mobileSidebar.classList.remove('hidden');
    setTimeout(() => {
      mobileSidebar.classList.remove('translate-x-full');
      mobileSidebar.classList.add('translate-x-0');
    }, 10); // Slight delay to allow for transition
  } else {
    // Hide the sidebar
    mobileSidebar.classList.remove('translate-x-0');
    mobileSidebar.classList.add('translate-x-full');
    setTimeout(() => {
      mobileSidebar.classList.add('hidden');
    }, 300); // Wait for transition to finish before hiding
  }
}

// Toggle the mobile sidebar when the menu button is clicked
menuToggle.addEventListener('click', (e) => {
  contentSection.classList.add('hidden');
  e.stopPropagation();  // Prevent the event from closing the sidebar immediately
  toggleSidebar();
});

// Close the sidebar when the close button is clicked
closeSidebar.addEventListener('click', () => {
  toggleSidebar();
  contentSection.classList.remove('hidden');

});

// Optionally close sidebar if clicking outside (only for mobile)
window.addEventListener('click', (e) => {
  if (!mobileSidebar.contains(e.target) && !menuToggle.contains(e.target)) {
    mobileSidebar.classList.remove('translate-x-0');
    mobileSidebar.classList.add('translate-x-full');
    setTimeout(() => {
      mobileSidebar.classList.add('hidden');
    }, 300);
  }
});
