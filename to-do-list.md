 <script src="https://cdn.tailwindcss.com"></script> 
 <link href="https://cdn.jsdelivr.net/npm/tailwindcss@latest/dist/tailwind.min.css" rel="stylesheet">

 <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script> 
 <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

Button color
bg-rose-500 //wishlist
bg-sky-900 //add to cart


//========================= Week 8 Project 1 task ============================//

Admin Sign-In:  [X]
Set up the admin sign-in page.

User Sign-Up and Login: [X]
Set up user sign-up and login forms with validation.
forgot password
Implement OTP functionality for sign-up with timer and resend OTP feature.

User Management [X]
Create a user management page for listing users.
Implement functionality to block/unblock users.

Category Management: [X] 
Build the category management page.
Implement add, edit, and soft delete functionality for categories.

Product Management: [X]
Create the product management page
Implement add, block, edit, and soft delete functionality for products.
Ensure the products have a minimum of 3 images and handle image uploads.
form validation when adding and editing products

Single Sign-On (Google): [x]
Integrate Google for login/sign-up.

[IMP]
List Products on User Side: [X]
Implement the product listing page that fetches products from the backend.
Ensure that the products display relevant information.

[IMP]
Product Details View:[]
Create the product details page with features like
image zoom feature [x]
Ratings [x]
Breadcrumbs [x]
Price [x]
Discounts/Coupons applied [x]
Reviews [x]
Stock availability [x]
Proper error handling for sold out/unavailable items []
pagination [x]
Highlights/specs of the product [x]
Related product recommendations [x]
Implement image zoom functionality. [x]
Test the product details view


//===================================================================//
Last Week Pending & Code to change: []
Google auth code explanation [x]
Home [X]
session management [x]
admin login error message displayed [x]
session secret key replace with env variable later [x]
Display some random product in product details page like similar products [x]
if the category is blocked don't show it on category selection [x]
update product sweet-alert fix [x]
add slug [x]
admin aside fix design [x]
Home page add link to all product page [x]
Remove tempData and add the user data actual collection and set a field like verified true/false []
user side ui when hover add text under the logo  with line animation []
color options []
brand ? option []
product model size field change to enum like s , m , l , xl  []
product management delete action change with confirm button []
stock management hide 'add to cart ' button for out of stock products []
google sign-in full name store to db [] 
create input for gender when sign-up male, female, other with respective image[]
dynamic image for google and normal user [] 
edit product page og price to next line instead of all in oneline



//================== Doubt ========================//



//========================= Week 9 Project 2 task ============================//

October 25-26: Complete Pending Tasks + Basic User Profile Setup [x] ------------//

Set up User Profile page structure: Show details, address, and orders.
Implement View/Edit Profile CRUD operations.


October 27-28: Address Management + Basic Cart Setup [] ---------------//

Address Management in Profile: [x]
Implement multiple address functionality: Add, Edit, and Delete.

Cart Management: []
Implement Add to Cart and List Products in Cart.
Control qty based on stock availability.
Set maximum quantity per user for each product.


October 29-30: Advanced Cart and Search Functionality [] ---------------//
Out-of-Stock Handling: []
Display/hide out-of-stock products with a filter toggle.

Advanced Search and Sorting: []
Implement search functionality with sorting:
Popularity, Price (low-high, high-low), Average ratings, Featured, New Arrivals, A-Z, Z-A.


October 31: Inventory, Checkout, and Order Placement [] ---------------[]

Inventory and Stock Management: []
Manage stock levels and display them in listings and product details.

Checkout Page: []
Implement checkout with address selection and edit options.

Order Placement (COD) : []
Complete COD-based order placement with address selection.


November 1: Finalize User and Admin Order Management [] ---------------//

Order Management - User Side: []
Enable order history, status tracking, and cancellation options.

Order Management - Admin Side: []
List orders, update order status, and manage cancellations.
Display remaining stock on product listing and details pages.
