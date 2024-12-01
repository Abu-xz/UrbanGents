const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((cartBtn) => {
  cartBtn.addEventListener("click", (event) => {
    const productId = cartBtn.getAttribute("data-id");
    const variantSize = cartBtn.getAttribute("data-variant");

    axios
      .post("/user/cart/add", { productId, variantSize })
      .then((response) => {
        if (response.data.success) {
          Swal.fire({
            title: response.data.title,
            icon: "success",
            text: response.data.message,
            confirmButtonText: "View Cart",
            showCancelButton: true,
            cancelButtonText: "Continue Shopping!",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/user/cart";
            }
          });
        } else {
          Swal.fire({
            title: "Out of Stock",
            icon: "warning",
            text: response.data.message,
          });
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          Swal.fire({
            title: "Already Exists!",
            icon: "info",
            text: error.response.data.message,
            confirmButtonText: "View Cart",
            showCancelButton: true,
            cancelButtonText: "Continue Shopping!",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/user/cart";
            }
          });
        }
      });
  });
});

const menuToggle = document.getElementById('menu-toggle');
const mobileSidebar = document.getElementById('mobile-sidebar');
const closeSidebar = document.getElementById('close-sidebar');

menuToggle.addEventListener('click', () => {
  mobileSidebar.classList.toggle('hidden'); 
  mobileSidebar.classList.toggle('translate-x-0'); 
  mobileSidebar.classList.toggle('translate-x-full'); 
});

closeSidebar.addEventListener('click', () => {
  mobileSidebar.classList.add('hidden'); 
  mobileSidebar.classList.remove('translate-x-0'); 
  mobileSidebar.classList.add('translate-x-full'); 
});

window.addEventListener('click', (e) => {
  if (!mobileSidebar.contains(e.target) && !menuToggle.contains(e.target)) {
    mobileSidebar.classList.add('hidden');
    mobileSidebar.classList.remove('translate-x-0');
    mobileSidebar.classList.add('translate-x-full');
  }
});

