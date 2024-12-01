
const productImage = document.getElementById("product-image");
const thumbnail = document.getElementById("thumbnail");

thumbnail.addEventListener("click", (e) => {
  const target = e.target.src;
  productImage.src = target;
});

const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const stockStatusDiv = document.getElementById("stock-status");
    const variantSize = stockStatusDiv
      .querySelector("p")
      .getAttribute("data-variant");
    const productId = button.getAttribute("data-id");
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
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          Swal.fire({
            title: "Already Exists!",
            icon: "info",
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

const cartBtn = document.querySelector(".add-to-cart");

// Function to update stock status and button color
function showStockStatusAndUpdateButton(size, stock, button) {
  const stockStatusDiv = document.getElementById("stock-status");

  // Update stock status display
  if (stock > 10) {
    stockStatusDiv.innerHTML = `<p class="text-lg text-green-600 font-bold mb-4" data-variant="${size}">Size ${size}: In Stock</p>`;
    cartBtn.classList.remove("hidden"); // Show cart button
  } else if (stock > 0) {
    stockStatusDiv.innerHTML = `<p class="text-lg text-red-600 font-bold mb-4" data-variant="${size}">Size ${size}: Only ${stock} left in stock</p>`;
    cartBtn.classList.remove("hidden"); // Show cart button
  } else {
    cartBtn.classList.add("hidden");
    stockStatusDiv.innerHTML = `<p class="text-lg text-red-600 font-bold mb-4">Size ${size}: Stock Unavailable</p>`;
  }


  const buttons = document.querySelectorAll(".variant-button");
  buttons.forEach((btn) => {
    btn.classList.remove("bg-gray-300"); 
  });

  button.classList.add("bg-gray-300"); 
}

// Function to initialize the stock status on page load
function initializeStockStatus() {
  const buttons = document.querySelectorAll(".variant-button");
  if (buttons.length > 0) {
    const firstButton = buttons[0];
    const size = firstButton.innerText; // Get size from button text
    // const variantId = firstButton.getAttribute('data-variant'); // Get variant ID from button data attribute
    const stock = firstButton.getAttribute("data-stock"); // Assuming product variant is available in the scope
    showStockStatusAndUpdateButton(size, stock, firstButton); // Call the function for the first variant
  }
}

// Call the initialization function when the page loads
window.onload = initializeStockStatus;



function addToWishlist (productId){

  axios.post('/user/profile/wishlist', {productId})
    .then((response) => {
      if(response.data.success){
        Swal.fire({
          title: 'Product added to wishlist!',
          icon: 'success'
        })
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'Already in Wishlist'
        })
      }
    })
    .catch(error => {
      Swal.fire('An error occurred while adding wishlist')
    })
}

// Get the elements
const menuToggle = document.getElementById("menu-toggle");
const mobileSidebar = document.getElementById("mobile-sidebar");
const closeSidebar = document.getElementById("close-sidebar");

// Function to toggle sidebar
function toggleSidebar() {
  if (mobileSidebar.classList.contains("hidden")) {
    // Show the sidebar
    mobileSidebar.classList.remove("hidden");
    setTimeout(() => {
      mobileSidebar.classList.remove("translate-x-full");
      mobileSidebar.classList.add("translate-x-0");
    }, 10); // Slight delay to allow for transition
  } else {
    // Hide the sidebar
    mobileSidebar.classList.remove("translate-x-0");
    mobileSidebar.classList.add("translate-x-full");
    setTimeout(() => {
      mobileSidebar.classList.add("hidden");
    }, 300); // Wait for transition to finish before hiding
  }
}

// Toggle the mobile sidebar when the menu button is clicked
menuToggle.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent the event from closing the sidebar immediately
  toggleSidebar();
});

// Close the sidebar when the close button is clicked
closeSidebar.addEventListener("click", () => {
  toggleSidebar();
});

// Optionally close sidebar if clicking outside (only for mobile)
window.addEventListener("click", (e) => {
  if (!mobileSidebar.contains(e.target) && !menuToggle.contains(e.target)) {
    mobileSidebar.classList.remove("translate-x-0");
    mobileSidebar.classList.add("translate-x-full");
    setTimeout(() => {
      mobileSidebar.classList.add("hidden");
    }, 300);
  }
});
