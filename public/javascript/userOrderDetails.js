const invoiceBtn = document.getElementById("downloadPdf");
invoiceBtn.addEventListener("click", () => {
  const orderId = invoiceBtn.getAttribute("data-orderId");

  window.location.href = `/user/order-invoice?orderId=${orderId}`;
});

document.getElementById("retry").addEventListener("click", () => {
  const amount = document.getElementById("retry").getAttribute("data-amount");
  const orderId = document.getElementById("retry").getAttribute("data-orderId");

  axios
    .post("/user/payment-failed/createRazorpay", { amount })
    .then((response) => {
      //here order is the response
      if (response.data.order) {
        const options = {
          key: "rzp_test_KDYrLJHnu3O9Ip", // Razorpay key ID
          amount: response.data.order.amount, // Amount from Razorpay order
          currency: "INR",
          name: "URBANGENTS",
          description: "Order Payment",
          order_id: response.data.order.id,
          handler: async function (response) {
            // Successful payment handler
            await Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              text: `Payment ID: ${response.razorpay_payment_id}`,
              showConfirmButton: true,
            });

            // Send payment confirmation to the backend
            axios
              .post("/user/payment-failed/verifyPayment", {
                orderId: response.razorpay_order_id,
                id: orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              })
              .then((result) => {
                if (result.data.success) {
                  location.reload();
                }
              });
          },
          prefill: {
            name: "username",
            email: "user@example.com", // Use the logged-in user's email
            contact: 2315469877,
          },
          theme: {
            color: "#FF8C00",
          },
          modal: {
            ondismiss: function () {},
          },
        };

        const razorpay = new Razorpay(options);

        // Open Razorpay modal
        razorpay.open();
      }
    })
    .catch((error) => {
      Swal.fire(
        "An error occurred while processing the payment. Please try again later."
      );
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
