function displayError(message) {
  const errorContainer = document.getElementById("error-container");
  const errorMessage = document.getElementById("error-message");
  errorContainer.classList.remove("hidden");
  errorMessage.textContent = message;
  setTimeout(() => {
    errorContainer.classList.add("hidden");
    errorMessage.textContent = "";
  }, 3000);
}


document.getElementById("otp-form").addEventListener("submit", (e) => {
  const otpInputs = document.querySelectorAll('input[name="otp"]');
  let otp = "";
  otpInputs.forEach((input) => {
    otp += input.value;
  });

  axios
    .post("/user/otp", { otp })
    .then((response) => {
      console.log(response.data);

      if (response.data.success) {
        //This will redirect to user login
        window.location.href = "/user/login";
      } else {
        displayError(response.data.message);
      }
    })
    .catch((err) => {
      console.log("Error sending OTP, err");
    });
});



