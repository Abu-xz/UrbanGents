
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
    console.log('route in')
    // Handle Razorpay payment flow
    axios.post("/user/createRazorpay")
      .then((response) => { //here order is the response
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
  }else{
    axios.post("/user/checkout", { addressId, payment })
  .then((response) => {
    if (response.data.success) {
      window.location.href = `/user/order-placed?orderId=${response.data.orderId}`;
    } else {
      Swal.fire({
        text:
          response.data.message || "Error while place order. please try again",
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
console.log("address session");
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
