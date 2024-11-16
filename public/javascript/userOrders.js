const returnButtons = document.querySelectorAll(".return-button");
const cancelButtons = document.querySelectorAll('.cancel-button');
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
                console.log('hhe')
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



cancelButtons.forEach((button) => {
  const itemId = button.getAttribute('data-itemId');
  const orderId = button.getAttribute('data-orderId');

  button.addEventListener('click', () => {
    Swal.fire({
      icon: 'warning',
      text: 'Are you sure to cancel order?',
      confirmButtonText: 'Yes, cancel order'
    })
    .then(() => {
      console.log("item id retrieved", itemId)
      console.log('order id retrieved', orderId);

      axios.put('/user/profile/orders', {itemId, orderId})
            .then((response) => {
              if(response.data.success){
                window.location.reload();
              }else{
                Swal.fire("Error occurred, Please try again");
              }
            })
            .catch(error => {
              Swal.fire({
                icon: 'error',
                text: error.response.data.message || 'Internal Server Error',
                title: "Error"
              })
            })
    })

  })
  
})


viewDetailButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        const orderId = button.getAttribute('data-orderId');
        console.log(orderId);
        window.location.href = `/user/profile/order-details?orderId=${orderId}`;
    })
})



