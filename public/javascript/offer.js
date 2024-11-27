const createButton = document.getElementById("create-button");
const cancelButton = document.getElementById("cancel-button");
const editButtons = document.querySelectorAll(".edit-offer");
const deleteButtons = document.querySelectorAll(".delete-offer");
const offerForm = document.getElementById("offer-form");
const offerTableContainer = document.getElementById("offer-table-container");

createButton.addEventListener("click", () => {
  offerForm.classList.remove("hidden");
  offerTableContainer.classList.add("hidden");
});

offerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Collect form values
  const category = document.getElementById("category").value.trim();
  const discount = document.getElementById("discount").value.trim();
  const offerName = document.getElementById("offer-name").value.trim();
  const validFrom = document.getElementById("validFrom").value.trim();
  const validUntil = document.getElementById("validUntil").value.trim();

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

  const submitButton = offerForm.querySelector("button[type='submit']");
  submitButton.disabled = true;

  // Send data to the backend using axios
  axios
    .post("/admin/offers", {
      category,
      discount,
      offerName,
      validFrom,
      validUntil,
    })
    .then((response) => {
      if (response.data.success) {
        // Swal.fire("Offer created successfully!");
        window.location.reload();
      } else {
        Swal.fire(response.data.message || "Failed to create the offer.");
        submitButton.disabled = false; // Re-enable the button
      }
    })
    .catch((error) => {
      Swal.fire("An error occurred while creating the offer.");
      submitButton.disabled = false; // Re-enable the button
    });
});

editButtons.forEach(editButton => {
  editButton.addEventListener("click", () => {
    const offerId = editButton.getAttribute("data-offerId");
    window.location.href = `/admin/edit-offer?offerId=${offerId}`;
  });

})

deleteButtons.forEach(deleteButton => {
  deleteButton.addEventListener("click", () => {
    const offerId = deleteButton.getAttribute("data-offerId");
  
    Swal.fire({
      icon: "warning",
      title: "Are you sure you want to delete this offer",
      showCancelButton: true,
      confirmButtonText:'Delete'
    })
      .then((result) => {
        if (result.isConfirmed) {
          axios.post("/admin/offers/delete", { offerId }).then((response) => {
            if (response.data.success) {
              location.reload();
            }
          });
        }
      })
      .catch((error) => {
        Swal.fire("An error occurred while deleting the offer.");
      });
  });

})
