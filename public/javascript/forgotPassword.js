function displayError(message) {
  const errorMessage = document.getElementById("error-message");
  const errorContainer = document.getElementById('error-container');
  if (message) {
    errorMessage.textContent = message;
    errorContainer.classList.remove("hidden");
  } 
  setTimeout(() => {
    errorMessage.textContent = '';
    errorContainer.classList.add('hidden')
  }, 3500);
}


const forgotForm = document.getElementById("send-btn");
forgotForm.addEventListener('click',(event)=>{
  event.preventDefault()
  let email = document.querySelector("#input-email")?.value;   // find the solution !
  axios
  .post("/user/forgotPassword", { email })
  .then((response) => {
    if (response.data.success) {
      window.location.href = "/user/forgotOtp";
    } else {
      displayError(response.data.message);
    }
  })
  .catch((error) => {
    console.error("Axios error:", error); // Log the error for debugging
    if (error.response && error.response.data) {
      displayError(error.response.data.message);
    } else {
      displayError("An unexpected error occurred.");
      window.location.href = "/user/login";
    }
  });

});


