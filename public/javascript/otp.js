function displayError(message) {
  const errorContainer = document.getElementById("error-container");
  const errorMessage = document.getElementById("error-message");
  errorContainer.classList.remove("hidden");
  errorMessage.textContent = `${message}`;
  setTimeout(() => {
    errorContainer.classList.add("hidden");
    errorMessage.textContent = "";
  }, 3000);
}

document.getElementById("otp-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const otpInputs = document.querySelectorAll('input[name="otp"]');
  let userOtp = "";
  otpInputs.forEach((input) => {
    userOtp += input.value;
  });

  axios
    .post("/user/otp", { userOtp })
    .then((response) => {
      if (response.data.success) {
        //This will redirect to user login
        window.location.href = "/user/login";
      }
    }) // if any error occurs in this route catch will catch the error ok!
    .catch((err) => {
      if (err.response.data.redirect) {
        return (window.location.href = "/user/signup");
      }
      if (err.response && err.response.data && err.response.data.message) {
        displayError(err.response.data.message);
      } else {
        displayError("An unexpected error occurred.");
      }
    });
});

let timerDisplay = document.getElementById("timer");
let resendBtn = document.getElementById("resend-btn");
let otpTimeOut = 60;
let timer;

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  // returning mm:ss
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

window.onload = () => startCountDown();

const startCountDown = () => {
  resendBtn.classList.add("hidden");
  timer = setInterval(() => {
    otpTimeOut--;
    timerDisplay.textContent = formatTime(otpTimeOut); // update the timer by count down

    if (otpTimeOut <= 0) {
      clearInterval(timer);
      resendBtn.classList.remove("hidden");
      timerDisplay.textContent = "00:00";
    }
  }, 1000);
};
