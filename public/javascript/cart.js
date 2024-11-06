console.log("cart page reached");

function updateQuantity(itemId, quantity, selectedSize) {
  axios
    .put("/user/cart", { itemId, quantity, selectedSize })
    .then((response) => {
      console.log(response);
      if (response.data.success) {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.log(error);
      Swal.fire({
        icon: "warning",
        text: error.response.data.message || "Internal Server Error!",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    });
}

//
function updateSize(productId, variantSize) {
  console.log(variantSize);
  console.log(productId);
  axios
    .patch("/user/cart/add", { productId, variantSize })
    .then((response) => {
      console.log(response);
      if (response.data.success) {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.log(error);
      Swal.fire({
        icon: "warning",
        text: error.response.data.message || "Internal Server Error!",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    });
}

const removeButtons = document.querySelectorAll(".remove-btn");
removeButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    //create a sweet alert are sure to continue like

    const itemId = button.getAttribute("data-itemId");
    const cartId = button.getAttribute("data-cartId");
    console.log(itemId);
    swal
      .fire({
        title: "Are you sure ?",
        text: "Do you want to remove this item from the cart?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "No Keep It",
        confirmButtonText: "Yes, remove It!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          console.log("user click confirm button");
          axios
            .delete("/user/cart", { data: { itemId, cartId } }) //just find the item with id and pull that item from items array!
            .then((response) => {
              if (response.data.success) {
                window.location.reload(); // else just remove the item from ui by access it without reload
              }
            })
            .catch((error) => {
              swal.fire("Something Happened , Please try again later");
            });
        }
      })
      .catch((error) => {
        swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message || "Internal Server Error",
        });
      });
  });
});

// To prevent the out of stock product for checkout
const checkoutBtn = document.getElementById("checkout-btn");
checkoutBtn.addEventListener("click", (e) => {
  const cartId = checkoutBtn.getAttribute("data-cartId");
  axios.post("/user/cart/check-stock", { cartId })
    .then(response => {
        if(response.data.success){
            window.location.href = '/user/checkout'
        }else{
            Swal.fire({
                title: 'OUT OF STOCK',
                icon: 'warning',
                text: response.data.message || "One or more products are out of stock. Please remove them from the cart."
            }).then((result) => {
                if(result.isConfirmed){
                    window.location.reload();
                }
            })
        }
    })
    .catch(error => {
        console.error("An error occurred while checking stock:", error);
        Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Unable to check stock at this time. Please try again later.',
        });
    })
});
