console.log("Edit address");
const addressForm = document.getElementById("address-form");
const addAddressBtn = document.getElementById('add-address-btn');
const cancelBtn = document.getElementById('cancel-btn');


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
  const addressId = document.getElementById('address-id').value;
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
  if (hasError) return 

  console.log(phoneNumber)

  axios
  .post("/user/profile/address/edit", {
    addressId,
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
    Swal.fire("hell world");
    if (response.data.success) {
      console.log("Address added successfully: ", response.data);
      Swal.fire({
        icon: "success",
        text: response.data.message,
        title: "Address Updated",
      }).then((result) => {
        if(result.isConfirmed){
         window.location.href = '/user/profile/address'
        }
      })
    }
  })
  .catch((error) => {
    console.log(error);
    
    Swal.fire({
      icon: "error",
      text:
        "An error occurred while adding the address",
      title: "Error",
    });
  });

});

cancelBtn.addEventListener('click', (e) => {
    window.location.href = '/user/profile/address';
})