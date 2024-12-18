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

  if (phoneNumber) {
    const value = phoneNumber.value.trim();
    if (!/^\d{10}$/.test(value) || value === "" || value.length < 10) {
      phoneNumberError.textContent = "Invalid phone number!";
      phoneNumberError.classList.remove("hidden");
      hasError = true;
    }
  }

  if (hasError) {
    e.preventDefault();
  }
});

// modal script here ...
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const updatePasswordButton = document.getElementById("update-password-button");

openModal.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

// Close modal on outside click
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
});

updatePasswordButton.addEventListener("click", () => {
  const currentPassword = document
    .getElementById("current-password")
    .value.trim();
  const newPassword = document.getElementById("new-password").value.trim();
  const confirmPassword = document
    .getElementById("confirm-password")
    .value.trim();

  const currentErrorMessage = document.getElementById("current-error");
  const newErrorMessage = document.getElementById("new-error");
  const confirmErrorMessage = document.getElementById("confirm-error");

  // Clear previous error messages
  currentErrorMessage.textContent = "";
  newErrorMessage.textContent = "";
  confirmErrorMessage.textContent = "";

  let isValid = true;

  // Validate passwords
  if (currentPassword.length < 6) {
    currentErrorMessage.textContent =
      "Current Password must be at least 6 characters long!";
    isValid = false;
  }
  if (newPassword.length < 6) {
    newErrorMessage.textContent =
      "New Password must be at least 6 characters long!";
    isValid = false;
  }
  if (confirmPassword.length < 6) {
    confirmErrorMessage.textContent =
      "Confirm Password must be at least 6 characters long!";
    isValid = false;
  }
  if (newPassword !== confirmPassword) {
    Swal.fire({
      icon: "warning",
      text: "New password and confirm password must be the same.",
      title: "Incorrect confirm password!",
    });
    return;
  }

  if (!isValid) return; // Exit if validation fails

  axios
    .put("/user/profile/update-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    })
    .then((response) => {
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          text: response.data.message,
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        text: error.response?.data?.message || "Internal Server error!",
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
