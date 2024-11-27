

const createCouponButton = document.querySelector(".create-coupon-btn");
const couponForm = document.querySelector(".coupon-form");
const cancelButton = document.querySelector(".cancel-form");
const mainContainer = document.getElementById("main-container");
// input values

couponForm.addEventListener("submit", (e) => {
  const code = document.getElementById("code").value.trim();
  const discount = document.getElementById("discount").value.trim();
  const expiry = document.getElementById("expiry").value.trim();
  const start = document.getElementById("start").value.trim();
  const usageLimit = document.getElementById("limit").value.trim();

  const expiryDate = new Date(expiry);

  e.preventDefault();
  let isValid = true;
  const codePattern = /^[A-Za-z0-9]+$/; // Only allow letters and numbers

  if (!code || !discount || !start || !expiry || !usageLimit) {
    isValid = false;
    Swal.fire({
      icon: "warning",
      title: "Field Required",
      text: "Fill the form first!",
    });
  }

  if (!codePattern.test(code)) {
    isValid = false;
    Swal.fire("Coupon code must be alphanumeric");
  }

  if (code.length > 10) {
    isValid = false;
    Swal.fire("Coupon code length must between 1 and 15");
  }

  if (isNaN(discount) || discount <= 0 || discount > 100) {
    isValid = false;
    Swal.fire("Enter a valid discount percentage between 1 and 100.");
  }

  if (isNaN(usageLimit) || usageLimit > 100) {
    isValid = false;
    Swal.fire("Enter a limit between 0 and 100.");
  }

  // Expiry Date Validation: Must be a future date
  const today = new Date();
  if (!expiryDate || expiryDate <= today) {
    isValid = false;
    Swal.fire("Expiry date must be in the future.");
  }

  if (isValid) {
    const couponData = {
      code,
      discount,
      expiry,
      start,
      usageLimit,
    };

    axios
      .post("/admin/coupons", couponData)
      .then((response) => {
        if (response.data.success) {
          window.location.reload();
        }
      })
      .catch((error) => {
        Swal.fire("Error when adding coupon");
      });
  }
});

createCouponButton.addEventListener("click", () => {
  couponForm.classList.remove("hidden");
  mainContainer.classList.remove("h-screen");
});

cancelButton.addEventListener("click", () => {
  couponForm.classList.add("hidden");
  mainContainer.classList.add("h-screen");
});


// Edit & Delete button here....
const editButtons = document.querySelectorAll(".edit-button");
const deleteButtons = document.querySelectorAll(".delete-button");

editButtons.forEach((button) => {
  button.addEventListener("click", () => {
     const couponId = button.getAttribute('data-id');
     window.location.href = `/admin/coupons/${couponId}`
  });
});


deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const couponId = button.getAttribute('data-id');
    Swal.fire({
      icon: 'warning',
      title: "Are you sure !",
      showCancelButton: true,
      confirmButtonText: 'Delete Coupon'
    })
    .then(result => {
      if(result.isConfirmed){
        axios.put(`/admin/coupons/delete`, {couponId})
          .then((response) => {
            if(response.data.success){
              window.location.reload();
            }
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              text: error.data.message || 'Internal Server Error'
            });
          })
      }
    })
  });
});
