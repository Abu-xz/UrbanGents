document
  .getElementById("form-resetPassword")
  .addEventListener("submit", (e) => {
    const errorMessage = document.getElementById("error-message");
    const newPassword = document.getElementById("new-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    errorMessage.textContent = "";
    
    if (!newPassword || !confirmPassword) {
      (errorMessage.textContent = "Please enter new password");
      e.preventDefault();
      return
    }
    
    if (newPassword.length < 6) {
      errorMessage.textContent = "Password should be at least 6 character long";
      e.preventDefault();
      return
    }
    
    if (newPassword.length > 15) {
      errorMessage.textContent = "Password is too long";;
      e.preventDefault();
      return
    }
    
    if (newPassword !== confirmPassword) {
      errorMessage.textContent = "Password doesn't match";
      e.preventDefault();
      return;
    };


  });
