const addressForm = document.getElementById("address-form");
const addAddressBtn = document.getElementById("add-address-btn");
const addAddressForm = document.getElementById("add-address-form");
const cancelBtn = document.getElementById("cancel-btn");

addressForm.addEventListener("submit", (event) => {
  event.preventDefault();
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

addAddressBtn.addEventListener("click", (e) => {
  addAddressForm.classList.remove("hidden");
});

cancelBtn.addEventListener("click", (e) => {
  addAddressForm.classList.add("hidden");
});

const deleteButtons = document.querySelectorAll(".delete-address-btn");

deleteButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const addressId = document.getElementById("addressId").value;

    Swal.fire({
      title: "Are you sure!",
      icon: "info",
      text: "Do you want to delete this address?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, Keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("/user/profile/address/delete", { data: { addressId } })
          .then((response) => {
            if (response.data.success) {
              Swal.fire({
                icon: "success",
                text: response.data.message,
                title: "Address Deleted!",
              }).then(() => {
                window.location.reload();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: response.data.message || "Failed to delete address.",
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to delete address",
            });
          });
      }
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