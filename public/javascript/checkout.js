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

  if (payment === "razorpay") {
    console.log("route in");
    // Handle Razorpay payment flow
    axios
      .post("/user/createRazorpay")
      .then((response) => {
        //here order is the response
        console.log(`data -- ${response.data.order}`);
        if (response.data.order) {
          const options = {
            key: "rzp_test_KDYrLJHnu3O9Ip", // Razorpay key ID
            amount: response.data.order.amount, // Amount from Razorpay order
            currency: "INR",
            name: "URBANGENTS",
            description: "Order Payment",
            order_id: response.data.order.id,
            handler: async function (response) {
              // Handle successful payment
              console.log("response", response);
              await Swal.fire({
                icon: "success",
                title: "Payment successful!",
                text: `Payment ID: ${response.razorpay_payment_id}`,
                showConfirmButton: true,
              });
              // Send payment confirmation to backend
              axios
                .post("/user/verifyPayment", {
                  addressId: addressId,
                  payment: payment,
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                })
                .then((response) => {
                  if (response.data.success) {
                    window.location.href = `/user/order-placed?orderId=${response.data.orderId}`;
                  } else {
                    Swal.fire({
                      icon: "error",
                      text: "Failed to place the order.",
                      showConfirmButton: true,
                    });
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
          };

          const razorpay = new Razorpay(options);
          razorpay.open();
        } else {
          Swal.fire({
            icon: "error",
            text: "Failed to create Razorpay order.",
            showConfirmButton: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error creating Razorpay order:", error);
        alert(
          "An error occurred while processing the payment. Please try again later."
        );
      });
  } else {
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
  }
});

// address form submission

const addressForm = document.getElementById("address-form");
const addAddressBtn = document.getElementById("add-address-btn");
const addAddressForm = document.getElementById("add-address-form");
const cancelBtn = document.getElementById("cancel-btn");

addressForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("form submitted");
  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const state = document.getElementById("state").value.trim();
  const phoneNumber = document.getElementById("phone-number").value.trim();
  const city = document.getElementById("city").value.trim();
  const district = document.getElementById("district").value.trim();
  const landmark = document.getElementById("landmark").value.trim();
  const address = document.getElementById("address").value;
  const addressType = document.querySelector(
    'input[name="addressType"]:checked'
  ).value;
  const setDefault = document.getElementById("setDefault").checked;
  console.log(setDefault);

  console.log(addressType);
  const firstNameError = document.getElementById("first-name-error");
  const lastNameError = document.getElementById("last-name-error");
  const phoneNumberError = document.getElementById("phone-number-error");
  const pincodeError = document.getElementById("pincode-error");
  const stateError = document.getElementById("state-error");
  const landmarkError = document.getElementById("landmark-error");

  const cityError = document.getElementById("city-error");
  const districtError = document.getElementById("district-error");
  const addressError = document.getElementById("address-error");

  firstNameError.textContent = "";
  lastNameError.textContent = "";
  phoneNumberError.textContent = "";
  pincodeError.textContent = "";
  stateError.textContent = "";
  cityError.textContent = "";
  districtError.textContent = "";
  addressError.textContent = "";
  landmarkError.textContent = "";

  let hasError = false;

  if (
    !firstName ||
    !lastName ||
    !pincode ||
    !state ||
    !phoneNumber ||
    !city ||
    !district ||
    !landmark ||
    !address ||
    !addressType
  ) {
    Swal.fire({
      icon: "error",
      title: "All Field Required",
      text: "Please fill the address form first!",
    });
  }

  if (
    firstName.length < 2 ||
    firstName.length > 15 ||
    !/^[a-zA-Z]+$/.test(firstName)
  ) {
    firstNameError.textContent = "Invalid firstName";
    hasError = true;
  }

  if (
    lastName.length < 2 ||
    lastName.length > 15 ||
    !/^[a-zA-Z]+$/.test(lastName)
  ) {
    lastNameError.textContent = "Invalid last name!\n";
    hasError = true;
  }

  if (pincode.length < 6 || pincode.length > 6) {
    pincodeError.textContent = "Invalid pincode";
    hasError = true;
  }

  if (state.length <= 0) {
    stateError.textContent = "Invalid state!";
    hasError = true;
  }

  if (
    !/^\d{10}$/.test(phoneNumber) ||
    phoneNumber === "" ||
    phoneNumber.length < 10
  ) {
    phoneNumberError.textContent = "Invalid phone number!";
    hasError = true;
  }

  if (district.length <= 0) {
    districtError.textContent = "Invalid district!";
    hasError = true;
  }

  if (city.length <= 0 || !/^[a-zA-Z]+$/.test(city)) {
    cityError.textContent = "Invalid city!";
    hasError = true;
  }

  if (landmark.length <= 0) {
    landmarkError.textContent = "Invalid landmark!";
    hasError = true;
  }

  if (address.length <= 0) {
    addressError.textContent = "Invalid address";
    hasError = true;
  }
  if (hasError) return;

  //check there is any default address exists before setting isDefault is true ;

  axios
    .post("/user/profile/address/add", {
      firstName,
      lastName,
      pincode,
      state,
      district,
      phoneNumber,
      city,
      landmark,
      addressType,
      address,
      setDefault,
    })
    .then((response) => {
      // Swal.fire("hell world");
      if (response.data.success) {
        // console.log("Address added successfully: ", response.data);
        Swal.fire({
          icon: "success",
          text: response.data.message,
          title: "Address Added",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        text:
          error.response.data.message ||
          "An error occurred while adding the address",
        title: "Error",
      });
    });
});

addAddressBtn.addEventListener("click", () => {
  addAddressForm.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  addAddressForm.classList.add("hidden");
});


document.addEventListener('DOMContentLoaded', () => {
  const couponSelect = document.getElementById('coupon');
  const applyBtn = document.getElementById('applyBtn');
  const removeBtn = document.getElementById('removeBtn');

  let selectedCoupon = null;

  // Apply coupon logic
  applyBtn.addEventListener('click', () => {
    let selectedValue = couponSelect.value;
    const cartId = couponSelect.getAttribute('data-cartId');

    if (selectedValue && cartId) {
      selectedCoupon = selectedValue;

      // Disable the dropdown and apply button to prevent repeated submissions
      couponSelect.disabled = true;
      applyBtn.disabled = true;

      // Make an API call to apply the coupon
      axios.post('/user/checkout/apply-coupon', { cartId, couponId: selectedValue })
        .then(response => {
          if (response.data.success) {
            // Show success message
            Swal.fire({
              title: 'Success!',
              text: 'Coupon applied successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              window.location.reload(); // Reload to reflect changes in the cart
            });
          } else {
            // Show error message
            Swal.fire({
              title: 'Failed!',
              text: response.data.message || 'Failed to apply coupon.',
              icon: 'error',
              confirmButtonText: 'OK'
            });

            // Re-enable if application fails
            couponSelect.disabled = false;
            applyBtn.disabled = false;
          }
        })
        .catch(error => {
          console.error('Error applying coupon:', error);

          // Show error message
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while applying the coupon.',
            icon: 'error',
            confirmButtonText: 'OK'
          });

          // Re-enable in case of an error
          couponSelect.disabled = false;
          applyBtn.disabled = false;
        });
    } else {
      // Show warning if no valid coupon is selected
      Swal.fire({
        title: 'Warning!',
        text: 'Please select a valid coupon.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  });

  // Remove coupon logic
  removeBtn.addEventListener('click', () => {
    const cartId = couponSelect.getAttribute('data-cartId');
    console.log(selectedCoupon)
    if (cartId) {
      // Make an API call to remove the coupon
      axios.post('/user/checkout/remove-coupon', { cartId, })
        .then(response => {
          if (response.data.success) {
            // Show success message 
            Swal.fire({
              title: 'Success!',
              text: 'Coupon removed successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              window.location.reload(); // Reload to reflect changes in the cart
            });
          } else {
            // Show error message
            Swal.fire({
              title: 'Failed!',
              text: response.data.message || 'Failed to remove coupon.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        })
        .catch(error => {
          console.error('Error removing coupon:', error);

          // Show error message
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while removing the coupon.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    } else {
      // Show warning if no coupon is available to remove
      Swal.fire({
        title: 'Warning!',
        text: 'No coupon to remove.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  });
});
