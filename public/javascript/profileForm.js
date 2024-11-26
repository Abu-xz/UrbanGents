const profileForm = document.getElementById("edit-form");
profileForm.addEventListener("submit", (e) => {
  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const firstNameError = document.getElementById("first-name-error");
  const lastNameError = document.getElementById("last-name-error");
  const phoneNumber = document.getElementById("phone-number");
  const phoneNumberError = document.getElementById("phone-number-error");

  
  // Reset error messages
  firstNameError.classList.add("hidden");
  lastNameError.classList.add("hidden");
  if (phoneNumber) phoneNumberError.classList.add("hidden");

  firstNameError.textContent = "";
  lastNameError.textContent = "";
  if (phoneNumberError) phoneNumberError.textContent = "";

  let hasError = false;

  if (
    firstName.length < 2 ||
    firstName.length > 15 ||
    !/^[a-zA-Z]+$/.test(firstName)
  ) {
    firstNameError.textContent = "Invalid first name!\n";
    firstNameError.classList.remove("hidden");
    hasError = true;
  }
  if (
    lastName.length < 2 ||
    lastName.length > 15 ||
    !/^[a-zA-Z]+$/.test(lastName)
  ) {
    lastNameError.textContent = "Invalid last name!\n";
    lastNameError.classList.remove("hidden");
    hasError = true;
  }

  if (phoneNumber) {
    const value = phoneNumber.value.trim();
    if (!/^\d{10}$/.test(value) || value === "" || value.length < 10) {
      phoneNumberError.textContent = "Invalid phone number!";
      phoneNumberError.classList.remove("hidden");
      hasError = true;
    }
  }

  if (hasError) {
    e.preventDefault();
    console.log("error");
  }
});

  // modal script here ...
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");
  const modal = document.getElementById("modal");
  const updatePasswordButton = document.getElementById('update-password-button');


  openModal.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  });

  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });

   // Close modal on outside click
   modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });

  updatePasswordButton.addEventListener('click' , () => {
    const currentPassword = document.getElementById('current-password').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    const currentErrorMessage = document.getElementById('current-error');
    const newErrorMessage = document.getElementById('new-error');
    const confirmErrorMessage = document.getElementById('confirm-error');

    currentErrorMessage.textContent = '';
    newErrorMessage.textContent = '';
    confirmErrorMessage.textContent = '';
    let isValid = true;
    if (currentPassword.length < 6) {
      currentErrorMessage.textContent = "Current Password must be at least 6 character long!";
      isValid = false;
    }
    if (newPassword.length < 6) {
      currentErrorMessage.textContent = "New Password  must be at least 6 character long!";
      isValid = false;
    }
    if (confirmPassword.length < 6 ) {
      currentErrorMessage.textContent = "Confirm Password must be at least 6 character long!";
      isValid = false;
    }

    if(confirmPassword !== newPassword){
      Swal.fire({
        icon:'warning',
        text:'New password and confirm password must be same.',
        title:'Incorrect confirm password!'
      })
    };

    if(isValid){
      axios.put('/user/profile', {currentPassword, newPassword, confirmPassword})
        .then(response => {
          if(response.data.success) {
            location.reload();
          };
        })
        .catch(error => {
          Swal.fire({
            icon:'error',
            text:error.response.data.message || 'Internal Server error!',
          })
        })
    }

  
  })