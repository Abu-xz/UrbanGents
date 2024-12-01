const returnButtons = document.querySelectorAll(".return-button");
const cancelButtons = document.querySelectorAll(".cancel-button");
const viewDetailButtons = document.querySelectorAll(".view-details");

returnButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const orderId = button.getAttribute("data-orderId");
    const itemId = button.getAttribute("data-itemId");
    const newStatus = "returned";
    Swal.fire({
      title: "Return Order",
      text: "Are you sure you want to return this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, return it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put("/admin/orders", { itemId, newStatus, orderId })
          .then((response) => {
            if (response.data.success) {
              //   Swal.fire('Returned!', 'The order has been marked for return.', 'success')
              window.location.reload();
            }
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text:
                error.response.data.message ||
                "An error occurred while updating the order status. Please try again.",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          });
      }
    });
  });
});

cancelButtons.forEach((button) => {
  const itemId = button.getAttribute("data-itemId");
  const orderId = button.getAttribute("data-orderId");

  button.addEventListener("click", () => {
    Swal.fire({
      icon: "warning",
      text: "Are you sure to cancel order?",
      confirmButtonText: "Yes, cancel order",
      showCancelButton: true,
    })

      .then((result) => {
        if (result.isConfirmed) {
          axios
            .put("/user/profile/orders", { itemId, orderId })
            .then((response) => {
              if (response.data.success) {
                window.location.reload();
              } else {
                Swal.fire("Error occurred, Please try again");
              }
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                text: error.response.data.message || "Internal Server Error",
                title: "Error",
              });
            });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response.data.message ||
            "An error occurred while updating the order status. Please try again.",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      });
  });
});

viewDetailButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const orderId = button.getAttribute("data-orderId");
    window.location.href = `/user/profile/order-details?orderId=${orderId}`;
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
