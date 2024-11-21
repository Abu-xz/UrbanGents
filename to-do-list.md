 <script src="https://cdn.tailwindcss.com"></script>
 <link href="https://cdn.jsdelivr.net/npm/tailwindcss@latest/dist/tailwind.min.css" rel="stylesheet">

 <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
 <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

Button color
bg-rose-500 //wishlist
bg-sky-900 //add to cart

//========================= Week 8 Project 1 task ============================//

Admin Sign-In: [X]
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
Product Details View:[x]
Create the product details page with features like
image zoom feature [x]
Ratings [x]
Breadcrumbs [x]
Price [x]
Discounts/Coupons applied [x]
Reviews [x]
Stock availability [x]
Proper error handling for sold out/unavailable items [x]
pagination [x]
Highlights/specs of the product [x]
Related product recommendations [x]
Implement image zoom functionality. [x]

//================================ Last Week Pending & Need Improvement ===================================//

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
google sign-in full name store to db [x]
USER PROFILE EDIT UPDATE FOR GOOGLE USER TO EDIT [x]
when user log with google ac email there is an issue with bcrypt [x]
product model size field change to enum like s , m , l , xl [x]
product management delete action change with confirm button [x]
stock management hide 'add to cart' button for out of stock products [x]
fix admin edit cropper issue [x]
Add proper zoom for product [x]
image edit control admin side [x]
discount field validate admin side product edit [x]
sign-up issue in first name enter with space validation update []
add different variants with a product [x]
while editing crop is not working [x]
product details page stock error [x];  
variants in edit product [x]
product page complete [x];
breadCrumbs in all product page [x]
image zoom need improvement [x]
Applied filter should be retained [x]
Remove html validations [x]
Check resend timer [x]
Same product with different size is not possible to add to cart [x]
Add address form in checkout page [x]
add Cancel product button with func[x]
Avoid Blocked user login [x]
Add proper comments for all functions [x]
Remove tempData and add the user data actual collection and set a field like verified true/false []
create input for gender when sign-up male, female, other with respective image[]
edit product page og price to next line instead of all in online []
user side ui when hover add text under the logo with line animation []
dynamic image for google and normal user []
make responsive navbar []
IMPLEMENT PASSWORD CHANGE OPTION []
checkout page address edit add []
landing page with all product and product details []
search, sort, filter need improvement []
Need pagination for all grids []
admin side product edit image add button set debouncing []


[IMP]
Add return with an expiry []
landing page []
create 404 page []
admin offer edit and delete []
admin coupon edit and delete [];


//========================= Week 9 Project task ============================//

October 25-26: Complete Pending Tasks + Basic User Profile Setup [x] ------------//

Set up User Profile page structure: Show details, address, and orders. [x]
Implement View/Edit Profile CRUD operations.[x]

October 27-28: Address Management + Basic Cart Setup [x] ---------------//

Address Management in Profile: [x]
Implement multiple address functionality: Add, Edit, and Delete.[x]

Cart Management: [x]
Implement Add to Cart and List Products in Cart.
Control qty based on stock availability.
Set maximum quantity per user for each product.

October 29-30: Advanced Cart and Search Functionality [] ---------------//

Out-of-Stock Handling: [x]
Display/hide out-of-stock products with a filter toggle. [x]

Advanced Search and Sorting: [x]
Implement search functionality with sorting:
Popularity, Price (low-high, high-low), Average ratings, Featured, New Arrivals, A-Z, Z-A.

October 31: Inventory, Checkout, and Order Placement [] ---------------//

Inventory and Stock Management: [x]
Manage stock levels and display them in listings and product details.

Checkout Page: [x]
Implement checkout with address selection and edit options.

Order Placement (COD) : [x]
Complete COD-based order placement with address selection.

November 1: Finalize User and Admin Order Management [x] ---------------//

Order Management - User Side: [x]
Enable order history, status tracking, and cancellation options.

Order Management - Admin Side: [x]
List orders, update order status, and manage cancellations.
Display remaining stock on product listing and details pages.

//========================= Week 10 Project task ============================//

Day 1: Monday
User Side - Core Payment Functionality [x]
Set up and configure Razorpay 
Implement the API for processing payments.
Test the payment flow to ensure it's smooth.
Pending Topics [x]
Retain applied filters (focus on making this functional first)

Day 2: Tuesday
User Side - Order Management   [x]
Implement order status changes cancel [x], return [x]
Test order status functionality to ensure it works for different scenarios.
Pending Topics
Add pagination for product listing and all grids.
Day 3: Wednesday

User Side - Coupon [x] and Wishlist Management []
Implement apply and remove coupon functionality. [x]
Create the wishlist feature (add and remove items).
Test the coupon management to ensure discounts are applied correctly.
Pending Topics
Remove HTML validations and use server-side validation. [x]
Day 4: Thursday

User Side - Search and Filtering [x]
Implement search functionality.
Add category filtering to product listings.
Ensure the search and filter features work together seamlessly.

Admin Side - Offer Module [x]
Develop the offer module (product, category, referral).
Day 5: Friday

Admin Side - Coupon [x] and Sales Report []
Implement coupon management (create and delete coupons). [x]
Start with basic sales report generation (daily, weekly, monthly).
Add the ability to filter reports by date ranges.
Pending Topics
Check the resend timer functionality and debug if necessary.
Day 6: Saturday

Admin Side - Advanced Sales Report Features [x]
Show discounts and coupon deductions in the report.
Calculate and display overall sales count, order amount, and discounts.
Implement download functionality for the sales report (PDF, Excel).
Pending Topics
Resolve the issue of adding the same product with different sizes to the cart.
Day 7: Sunday

Final Touches and Testing
Add the address form to the checkout page.
Fix the product cancellation issue and add return functionality with expiry.
Add proper comments to all functions for better code maintainability.
Make sure all features are bug-free and functional.
Review the code and do a final polish.



//========================= Week 11 Project task ============================//


User Side
Invoice Download (PDF): []

Integrate a library like jsPDF or pdf make for generating invoices.
Design the PDF format (order details, user info, total cost).
Ensure the download functionality works seamlessly from the "My Orders" page.
Order Restriction for COD: []

Add a backend validation to disallow COD for orders above Rs. 1000.
Show a user-friendly error message when COD is selected for restricted orders.
Delivery Charges: []

Decide on the approach: []
Fixed Charges: Define a static value in the backend.
Location-based Charges: Use a lookup table or API for charges by location.
Update the order summary to display delivery charges dynamically.
Admin Side
Admin Dashboard - Chart with Filter: []

Use Chart.js or High charts for the chart.
Implement filters (yearly, monthly, custom range) to update the chart dynamically.
Top 10 Best Selling Metrics: []

Query the database for: []
Best-selling products, categories, and brands.
Display these on the dashboard (table or chart format).
Day 2: Error Handling and Enhancements
User Side
Handle Failed Payments: []

On payment failure, set the order status to "Payment Pending."
Log the failed transaction in the database for future reference.
Continue Payment for Failed Orders: []

Add a "Retry Payment" button on the "My Orders" page.
On click, redirect users to the payment gateway with the pending order details.
Admin Side
Generate Ledger Book (Optional): []
Create a ledger view summarizing transactions.
Use a library like excel js or pdf make to enable downloads in PDF or Excel format.
Day 3: Testing and Final Touches
Thorough Testing: []

Test all user-side features, especially payment failure handling, COD restriction, and invoice download.
Ensure the admin dashboard displays accurate data.
Code Cleanup and Documentation:

Add proper comments for all new functions and modules.
Ensure consistent code formatting and remove any unused code.
Team Review:

If working in a team, have peers review the new functionalities for feedback.


