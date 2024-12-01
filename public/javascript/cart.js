function updateQuantity(itemId, quantity, selectedSize) {
  axios
    .put("/user/cart", { itemId, quantity, selectedSize })
    .then((response) => {
      if (response.data.success) {
        window.location.reload();
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "warning",
        text: error.response.data.message || "Internal Server Error!",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    });
}

//
function updateSize(productId, variantSize) {
  axios
    .patch("/user/cart/add", { productId, variantSize })
    .then((response) => {
      if (response.data.success) {
        window.location.reload();
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "warning",
        text: error.response.data.message || "Internal Server Error!",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    });
}

const removeButtons = document.querySelectorAll(".remove-btn");
removeButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    //create a sweet alert are sure to continue like

    const itemId = button.getAttribute("data-itemId");
    const cartId = button.getAttribute("data-cartId");
    swal
      .fire({
        title: "Are you sure ?",
        text: "Do you want to remove this item from the cart?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "No Keep It",
        confirmButtonText: "Yes, remove It!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete("/user/cart", { data: { itemId, cartId } }) //just find the item with id and pull that item from items array!
            .then((response) => {
              if (response.data.success) {
                window.location.reload(); // else just remove the item from ui by access it without reload
              }
            })
            .catch((error) => {
              swal.fire("Something Happened , Please try again later");
            });
        }
      })
      .catch((error) => {
        swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message || "Internal Server Error",
        });
      });
  });
});

// To prevent the out of stock product for checkout
const checkoutBtn = document.getElementById("checkout-btn");
checkoutBtn.addEventListener("click", (e) => {
  const cartId = checkoutBtn.getAttribute("data-cartId");
  axios
    .post("/user/cart/check-stock", { cartId })
    .then((response) => {
      if (response.data.success) {
        window.location.href = "/user/checkout";
      } else {
        Swal.fire({
          title: "OUT OF STOCK",
          icon: "warning",
          text:
            response.data.message ||
            "One or more products are out of stock. Please remove them from the cart.",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    })
    .catch((error) => {
      error("An error occurred while checking stock:", error);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Unable to check stock at this time. Please try again later.",
      });
    });
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
