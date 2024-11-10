const checkoutBtn = document.getElementById("place-order-button");

checkoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const addressInput = document.querySelectorAll(".address-input");
  let addressSelected = false;
  let addressId = null;
  addressInput.forEach((input) => {
    if (input.checked) {
      addressSelected = true;
      addressId = input.getAttribute("data-addressId");
    }
  });

  if (!addressSelected) {
    Swal.fire({
      icon: "warning",
      text: "Please select a delivery address!",
      title: "Field Missing!",
    });
  }

  const paymentMethod = document.querySelector('input[name="payment"]:checked');
  if (!paymentMethod) {
    Swal.fire({
      icon: "warning",
      text: "Please select a payment method",
      title: "Field Missing",
    });
  }
  const payment = paymentMethod.getAttribute("id");

  console.log(payment);
  console.log(addressId);
  axios
    .post("/user/checkout", { addressId, payment })
    .then((response) => {
      if (response.data.success) {
        window.location.href = `/user/order-placed?orderId=${response.data.orderId}`;
      } else {
        Swal.fire({
          text:
            response.data.message ||
            "Error while place order. please try again",
          title: "Out Of Stock",
          icon: "warning",
        });  
      }
    })
    .catch((error) => {
      Swal.fire({
        text:
          error.response.data.message ||
          "Error while place order. please try again",
        title: "Error",
        icon: "error",
      });
    });
});
