const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((cartBtn) => {
  cartBtn.addEventListener("click", (event) => {
    const productId = cartBtn.getAttribute("data-id");
    const variantSize = cartBtn.getAttribute("data-variant");
    console.log(productId);
    console.log(variantSize);
    axios.post("/user/cart/add", { productId, variantSize })
    .then((response) => {
      if (response.data.success) {
        Swal.fire({
          title: response.data.title,
          icon: "success",
          text: response.data.message,
          confirmButtonText: "View Cart",
          showCancelButton: true,
          cancelButtonText: 'Continue Shopping!'
        }).then(result => {
          if(result.isConfirmed) {
            window.location.href = '/user/cart'
          }
        })
      }
    })
    .catch((error) => {
      if(!error.response.data.success){
        Swal.fire({
          title: "Already Exists!",
          icon: "info",
          text: error.response.data.message,
          confirmButtonText: "View Cart",
          showCancelButton: true,
          cancelButtonText: 'Continue Shopping!',
        }).then((result) => {
          if(result.isConfirmed){
            window.location.href = '/user/cart'
          }
        })
      }
    }) 
  });
});
