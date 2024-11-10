const returnButtons = document.querySelectorAll(".return-button");
const viewDetailButtons = document.querySelectorAll('.view-details');

returnButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const orderId = button.getAttribute("data-orderId");
    console.log(typeof orderId);
    const itemId = button.getAttribute("data-itemId");
    console.log(itemId);
    const newStatus = 'returned';
    Swal.fire({
        title: 'Return Order',
        text: 'Are you sure you want to return this order?',
        icon: 'warning',
        input: 'text',
        inputLabel: 'Reason for Return',
        inputPlaceholder: 'Write your reason here...',
        showCancelButton: true,
        confirmButtonText: 'Yes, return it',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write a reason for the return!';
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // If the user confirms and provides a reason, proceed with the return
          const reason = result.value;
          console.log('Return confirmed with reason:', reason);
          axios.put("/admin/orders",{itemId, newStatus, orderId })
              .then(response => {
                  if(response.data.success){
                    //   Swal.fire('Returned!', 'The order has been marked for return.', 'success')
                      window.location.reload()
                  }
              })
              .catch((error) => {
                  Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: error.response.data.message ||"An error occurred while updating the order status. Please try again.",
                    }).then((result) => {
                      if(result.isConfirmed){
                          window.location.reload()
                      }
                    })
              })
        }
      });
      
  });
});

viewDetailButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        const orderId = button.getAttribute('data-orderId');
        console.log(orderId);
        window.location.href = `/user/profile/order-details?orderId=${orderId}`;
    })
})



