// User signup form validation here!..

document.getElementById("user-sign-up").addEventListener("submit", (e) => {
  let isValid = true;
  const email = document.getElementById("email").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const password = document.getElementById("password").value.trim();
  const firstName = document.getElementById("first-name").value.trim();
  const phoneNumber = document.getElementById("phone-number").value.trim();
  const toastContainer = document.getElementById("toast-container");
  const errorMessage = document.getElementById("error-message");

  if (
    firstName.length < 2 ||
    firstName.length > 20 ||
    !/^[a-zA-Z]+$/.test(firstName)
  ) {
    showToast("Please enter valid First Name");
    isValid = false;
  }
  if (
    lastName.length < 2 ||
    lastName.length > 20 ||
    !/^[a-zA-Z]+$/.test(lastName)
  ) {
    showToast("Please enter a valid last Name");
    isValid = false;
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    showToast("Please enter a valid phone Number");
    isValid = false;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showToast("Please enter a valid email");
    isValid = false;
  }

  // Validation for password (min 6 chars)
  if (password.length < 6) {
    showToast("Password should be at least 6 characters long");
    isValid = false;
  }

  function showToast(message) {
    errorMessage.textContent = message;
    toastContainer.classList.remove("hidden");
    setTimeout(() => {
      toastContainer.classList.add("hidden");
    }, 3000);
  }

  // To avoid unnecessary form submits
  if (!isValid) {
    e.preventDefault();
  }
});
