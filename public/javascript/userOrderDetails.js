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
