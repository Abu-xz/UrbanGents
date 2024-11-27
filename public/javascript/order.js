const viewDetailsButtons = document.querySelectorAll(".view-details");

viewDetailsButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const orderId = button.getAttribute("data-orderId");
    window.location.href = `/admin/order-details?orderId=${orderId}`;
  });
});

async function updateStatus(itemId, selectedElement, orderId) {
  try {
    const newStatus = selectedElement.value;
    if (newStatus === previousSelections[itemId]) {
      Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "The status is the same as before. No update needed.",
      });
      return;
    }

    disablePreviousOption(itemId, selectedElement);

    const response = await axios.put("/admin/orders", {
      itemId,
      newStatus,
      orderId,
    });

    if (response.data.success) {
      previousSelections[itemId] = newStatus;
      window.location.reload();
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: response.data.message,
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response.data.message ||
        "An error occurred while updating the order status. Please try again.",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }
}

let previousSelections = {};

function disablePreviousOption(itemId, selectedElement) {
  const selectElement = document.getElementById(`status-select-${itemId}`);
  const options = selectElement.querySelectorAll("option");

  options.forEach((option) => {
    option.disabled = false;
  });

  // Disable the previously selected option
  const currentSelection = selectedElement.value;
  options.forEach((option) => {
    if (
      option.value === previousSelections[itemId] &&
      option.value !== currentSelection
    ) {
      option.disabled = true;
    }
  });
}
