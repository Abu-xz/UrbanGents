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
