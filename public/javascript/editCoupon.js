const couponForm = document.getElementById("edit-coupon-form");


couponForm.addEventListener("submit", (e) => {
  const couponId = couponForm.getAttribute('data-id');
  const code = document.getElementById("code").value.trim();
  const discount = document.getElementById("discount").value.trim();
  const expiry = document.getElementById("expiry").value.trim();
  const start = document.getElementById("start").value.trim();
  const usageLimit = document.getElementById("limit").value.trim();

  const expiryDate = new Date(expiry);
  console.log(expiryDate);

  console.log("button clicked");
  e.preventDefault();
  let isValid = true;
  const codePattern = /^[A-Za-z0-9]+$/; // Only allow letters and numbers
  console.log(code, discount, start, expiry, usageLimit);

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
  };
console.log(couponId)

  if (isValid) {
    const couponData = {
      code,
      discount,
      expiry,
      start,
      usageLimit,
      id: couponId
    };

    axios
      .put("/admin/coupons", couponData)
      .then((response) => {
        if (response.data.success) {
          console.log("success");
          window.location.href = '/admin/coupons'
        }
      })
      .catch((error) => {
        Swal.fire("Error when adding coupon");
      });
  }
});



