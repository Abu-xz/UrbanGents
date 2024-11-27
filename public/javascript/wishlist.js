function removeItem(productId) {
  axios
    .put("/user/profile/wishlist", { productId })
    .then((response) => {
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Product Remove From wishlist",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    })
    .catch((error) => {
      Swal.fire("Something Went Wrong");
    });
}
