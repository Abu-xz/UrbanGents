document.getElementById("login-form").addEventListener("submit", (event) => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  errorMessage.textContent = ""; // clear prev messages

  if (!emailRegex.test(email)) {
    errorMessage.textContent = "Please enter a valid email!";
    event.preventDefault();
    return;
  }

  if (password.length < 6) {
    errorMessage.textContent = "Password must be at least 6 character long!";
    event.preventDefault();
    return;
  }
});
