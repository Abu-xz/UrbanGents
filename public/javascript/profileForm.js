const profileForm = document.getElementById("edit-form");
profileForm.addEventListener("submit", (e) => {
  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const firstNameError = document.getElementById("first-name-error");
  const lastNameError = document.getElementById("last-name-error");
  const phoneNumber = document.getElementById("phone-number");
  const phoneNumberError = document.getElementById("phone-number-error");

  // Reset error messages
  firstNameError.classList.add("hidden");
  lastNameError.classList.add("hidden");
  if (phoneNumber) phoneNumberError.classList.add("hidden");

  firstNameError.textContent = "";
  lastNameError.textContent = "";
  if (phoneNumberError) phoneNumberError.textContent = "";

  let hasError = false;

  if (
    firstName.length < 2 ||
    firstName.length > 15 ||
    !/^[a-zA-Z]+$/.test(firstName)
  ) {
    firstNameError.textContent = "Invalid first name!\n";
    firstNameError.classList.remove("hidden");
    hasError = true;
  }
  if (
    lastName.length < 2 ||
    lastName.length > 15 ||
    !/^[a-zA-Z]+$/.test(lastName)
  ) {
    lastNameError.textContent = "Invalid last name!\n";
    lastNameError.classList.remove("hidden");
    hasError = true;
  }


  if(phoneNumber){
    const value = phoneNumber.value.trim();
    if (!/^\d{10}$/.test(value) || value === '' || value.length <10) {
        phoneNumberError.textContent = 'Invalid phone number!';
        phoneNumberError.classList.remove('hidden');
        hasError = true;
      }
  }

  if (hasError) {
    e.preventDefault();
    console.log("error");
  }
});
