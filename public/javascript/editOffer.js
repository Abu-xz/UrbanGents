const cancelButton = document.getElementById("cancel-button");
const editOfferForm = document.getElementById("edit-offer-form");

editOfferForm.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("form submit");
  // Collect form values
  const category = document.getElementById("category").value.trim();
  const discount = document.getElementById("discount").value.trim();
  const offerName = document.getElementById("offer-name").value.trim();
  const validFrom = document.getElementById("validFrom").value.trim();
  const validUntil = document.getElementById("validUntil").value.trim();
  const offerId = document.getElementById("offerId").value;

  // Validate form fields
  if (!category) {
    Swal.fire("Please select a category.");
    return;
  }
  if (!discount || discount <= 0 || discount > 100) {
    Swal.fire("Please enter a valid discount percentage (1-100).");
    return;
  }
  if (!offerName) {
    Swal.fire("Please enter a valid offer Name");
    return;
  }
  if (!validFrom) {
    Swal.fire("Please select a valid 'Valid From' date.");
    return;
  }
  if (!validUntil || new Date(validUntil) < new Date(validFrom)) {
    Swal.fire("'Valid Until' date must be later than 'Valid From' date.");
    return;
  }

  const submitButton = editOfferForm.querySelector("button[type='submit']");
  submitButton.disabled = true;

  // Send data to the backend using axios
  axios
    .put("/admin/offers", {
      offerId,
      category,
      discount,
      offerName,
      validFrom,
      validUntil,
    })
    .then((response) => {
      if (response.data.success) {
        window.location.href = "/admin/offers";
      } else {
        Swal.fire(response.data.message || "Failed to create the offer.");
        submitButton.disabled = false; // Re-enable the button
      }
    })
    .catch((error) => {
      console.error("Error creating the offer:", error);
      Swal.fire("An error occurred while creating the offer.");
      submitButton.disabled = false; // Re-enable the button
    });
});
