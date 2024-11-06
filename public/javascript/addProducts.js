const imageInput = document.getElementById("image-input");
const imagePreview = document.getElementById("image-preview");
const cropButton = document.getElementById("crop-button");
const cancelButton = document.getElementById("cancel-button");
const productForm = document.getElementById("product-form");
const croppedImageData1 = document.getElementById("cropped-image-data1");
const croppedImageData2 = document.getElementById("cropped-image-data2");
const croppedImageData3 = document.getElementById("cropped-image-data3");
let uploadedImages = [];
let cropper;



productForm.addEventListener("submit", (e) => {
  const name = document.getElementById("product-name").value.trim();
  const price = document.getElementById("price").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value.trim();
  const discount = document.getElementById("discount").value.trim();
  
  const sizeSelect = document.querySelectorAll('.size-select');
  const stockInput = document.querySelectorAll('.stock-input');

  // Collect values for sizes and stocks
  const sizes = Array.from(sizeSelect).map(input => input.value.trim());
  const stocks = Array.from(stockInput).map(input => input.value.trim());

  if (!name || !price || !description || !category || !discount || sizes.includes("") || stocks.includes("")) {
    Swal.fire("All fields are required!");
    e.preventDefault();
    return;
  }

  if (typeof name !== "string" || name.length < 3 || name.length > 100) {
    Swal.fire("Product name must be between 3 and 100 characters.");
    e.preventDefault();
    return;
  }

  if (isNaN(price) || price <= 0) {
    Swal.fire("Invalid Product Price");
    e.preventDefault();
    return;
  }

  if (isNaN(discount) || discount < 0) {
    Swal.fire("Invalid Product Discount");
    e.preventDefault();
    return;
  }

  if (typeof description !== "string" || description.length < 10 || description.length > 300) {
    Swal.fire("Description must be between 10 and 300 characters.");
    e.preventDefault();
    return;
  }

  // Ensure sizes and stocks are properly filled
  if (sizes.length === 0 || stocks.length === 0) {
    Swal.fire("Please add at least one size and stock value.");
    e.preventDefault();
    return;
  }

  const hasDuplicates = sizes.length !== new Set(sizes).size;

if (hasDuplicates) {
  Swal.fire("Invalid size, Please remove Duplicate size");
  e.preventDefault();
  return;
}

  // Check image uploads
  if (uploadedImages.length === 0) {
    Swal.fire("Please upload images.");
    e.preventDefault();
    return;
  }

  if (uploadedImages.length < 3) {
    Swal.fire("Please upload at least 3 images.");
    e.preventDefault();
    return;
  }

  
});


// Handle image input change
imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.classList.remove("hidden");
      cropButton.classList.remove("hidden");
      cancelButton.classList.remove("hidden");

      // Initialize Cropper.js for the new image
      if (cropper) {
        cropper.destroy(); // Destroy the previous cropper instance
      }
      cropper = new Cropper(imagePreview, {
        aspectRatio: 1,
        viewMode: 2,
      });
    };
    reader.readAsDataURL(file);
  }
});

cancelButton.addEventListener("click", () => {
  cropper.destroy();
  document.getElementById("image-input").value = "";
  document.getElementById("image-preview").classList.add("hidden");
  document.getElementById("crop-button").classList.add("hidden");
  document.getElementById("cancel-button").classList.add("hidden");
});

// Handle crop button click
cropButton.addEventListener("click", () => {
  if (!cropper) {
    Swal.fire({
      icon: "error",
      title: "No cropper initialized",
      text: "Please upload an image first.",
    });
    return;
  }
  if (uploadedImages.length >= 3) {
    Swal.fire({
      icon: "error",
      text: "You can only upload a maximum of 3 images.",
      title: "Limit Reached",
    });
    imagePreview.classList.add("hidden");
    cropButton.classList.add("hidden");
    cancelButton.classList.add('hidden');
    cropper.destroy();
    return;
  }

  const canvas = cropper.getCroppedCanvas();
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "product-image");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/de5vavykz/image/upload",
        formData
      );
      const imageUrl = response.data.secure_url; // The response is image URL from Cloudinary
      uploadedImages.push(imageUrl);

      // Display the uploaded image in the preview section
      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.alt = "Uploaded Image";
      imgElement.style.maxWidth = "150px"; // Set a max width for the preview
      imgElement.style.marginRight = "20px"; // Add some spacing
      document
        .getElementById("image-preview-container")
        .appendChild(imgElement);
      if (uploadedImages.length >= 1) {
        croppedImageData1.value = uploadedImages[0];
      }
      if (uploadedImages.length >= 2) {
        croppedImageData2.value = uploadedImages[1];
      }
      if (uploadedImages.length >= 3) {
        croppedImageData3.value = uploadedImages[2];
      }
      Swal.fire({
        title: "Image Uploaded!",
        text: "Your image has been uploaded successfully.",
        icon: "success",
      });

      // Clear the input and preview for the next image
      imageInput.value = "";
      imagePreview.classList.add("hidden");
      cropButton.classList.add("hidden");
    cancelButton.classList.add('hidden');

      cropper.destroy(); // Destroy the cropper instance
    } catch (error) {
      console.error(error); // Log the error for debugging
      // let errorMessage = "There was an error uploading your image.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error.message; // Get specific error message from Cloudinary
      }
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "There was an error uploading your image.",
      });
    }
  });
});


 // Function to add a new size-quantity field
 let variantCount = 2; //balance here
 function addSizeField() {
  // console.log(variantCount)
  if(variantCount == 4){
   return Swal.fire('Maximum variants reached')
  }
  const container = document.getElementById('size-quantity-container');
  const newSizeField = document.createElement('div');
  newSizeField.className = 'flex items-center mt-2 space-x-5';
  newSizeField.innerHTML = `
    <select
      name="size[]"
      id ="size-${variantCount}"
      class="mr-2 w-1/3 rounded p-2 size-select"
      required
    >
      <option value="" disabled selected>Select a size</option>
      <option value="S">Small (S)</option>
      <option value="M">Medium (M)</option>
      <option value="L">Large (L)</option>
    </select>
    <input
      type="number"
      name="stock[]"
      id = "stock-${variantCount}"
      class="w-1/3 rounded p-2 stock-input"
      placeholder="stock"
      min="0"
      value= '30'
      required
    />
    <button type="button" onclick="removeSize(this)" class="ml-2 text-white rounded bg-red-600 p-2">Remove</button>
  `;
  container.appendChild(newSizeField);
  variantCount++
 }


  // Function to remove a size-quantity field
  function removeSize(button) {
    button.parentElement.remove();
  }