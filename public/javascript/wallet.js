const addMoneyButton = document.getElementById("add-money-button");
const addMoneyContainer = document.getElementById("add-money-container");
const addButton = document.getElementById("add-button");
const cancelButton = document.getElementById("cancel-button");
const addMoneyInput = document.getElementById("add-money-input");

addMoneyButton.addEventListener("click", () => {
  addMoneyButton.classList.add("hidden");
  addMoneyContainer.classList.remove("hidden");
});

cancelButton.addEventListener("click", () => {
  addMoneyContainer.classList.add("hidden");
  addMoneyButton.classList.remove("hidden");
});

addButton.addEventListener("click", () => {
  const value = addMoneyInput.value.trim();
  axios
    .put("/user/profile/wallet", { value })
    .then((response) => {
      if (response.data.success) {
        location.reload();
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error occurred while adding money to wallet",
        text: error.response.data.message,
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
