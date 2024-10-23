const imageInput = document.getElementById("image-input");
const imagePreview = document.getElementById("image-preview");
const cropButton = document.getElementById("crop-button");
const cancelButton = document.getElementById("cancel-button");
const productForm = document.getElementById("product-form");
const croppedImageData1 = document.getElementById("cropped-image-data1");
const croppedImageData2 = document.getElementById("cropped-image-data2");
const croppedImageData3 = document.getElementById("cropped-image-data3");
// const prevImageData1 = document.getElementById("prev-image-data1").value;
// const prevImageData2 = document.getElementById("prev-image-data2").value;
// const prevImageData3 = document.getElementById("prev-image-data3").value;

let uploadedImages = [];
let cropper;
//user for loop when area is empty in future ! //

// console.log(uploadedImages)
// console.log(prevImageData1,prevImageData2,prevImageData3);

//this is from top
uploadedImages[0] = croppedImageData1.value;
uploadedImages[1] = croppedImageData2.value;
uploadedImages[2] = croppedImageData3.value;

// croppedImageData1.value = prevImageData1
// croppedImageData2.value = prevImageData2
// croppedImageData3.value = prevImageData3

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
        viewMode: 1,
        autoCropArea: 1,

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
    cancelButton.classList.add("hidden");
    imageInput.value = "";

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

      // Create a new div to wrap the image and the remove button
      const div = document.createElement("div");

      // Create the remove button
      const removeBtn = document.createElement("button");
      removeBtn.id = "remove-button";
      removeBtn.onclick = () => {
        removeImage(imageUrl);
      };
      removeBtn.textContent = "Remove";
      removeBtn.classList.add(
        "bg-red-500",
        "text-white",
        "px-2",
        "py-1",
        "rounded",
        "hover:bg-red-700",
        "transition",
        "duration-200"
      );

      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.alt = "Uploaded Image";
      imgElement.style.maxWidth = "150px";
      imgElement.style.maxHeight = "150px";
      imgElement.style.marginRight = "20px";

      const inputElement = document.createElement("input");
      inputElement.type = "hidden";
      inputElement.value = imageUrl;
      inputElement.name = "croppedImages";

      div.appendChild(imgElement);
      div.appendChild(removeBtn);
      div.appendChild(inputElement);

      const container = document.getElementById("image-preview-container");
      container.appendChild(div);

      if (uploadedImages.length >= 1) {
        croppedImageData1.value = uploadedImages[0];
      }
      if (uploadedImages.length >= 2) {
        croppedImageData2.value = uploadedImages[1];
      }
      console.log("image 3 here start");
      if (uploadedImages.length >= 3) {
        croppedImageData3.value = uploadedImages[2];
      }
      console.log("image 3 here ends");
      console.log(uploadedImages);
      Swal.fire({
        title: "Image Uploaded!",
        text: "Your image has been uploaded successfully.",
        icon: "success",
      });

      // Clear the input and preview for the next image
      imageInput.value = "";
      imagePreview.classList.add("hidden");
      cropButton.classList.add("hidden");
      cancelButton.classList.add("hidden");
      cropper.destroy(); // Destroy the cropper instance
    } catch (error) {
      console.error(error); // Log the error for debugging
      let errorMessage = "There was an error uploading your image.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error.message; // Get specific error message from Cloudinary
      }
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: errorMessage || "There was an error uploading your image.",
      });
    }
  });
});

productForm.addEventListener("submit", (e) => {
  const name = document.getElementById("product-name").value.trim();
  const price = document.getElementById("price").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value.trim();
  const size = document.getElementById("size").value.trim();
  const stock = document.getElementById("stock").value.trim();
  const discount = document.getElementById("discount").value.trim();
  // console.log(uploadedImages);

  if (
    !name ||
    !price ||
    !description ||
    !category ||
    !stock ||
    !size ||
    !discount
  ) {
    Swal.fire("All field required!");
    e.preventDefault();
    return;
  }

  if (typeof name !== "string" || name.length < 3 || name.length > 100) {
    Swal.fire("Product name  must be between 3 and 100 characters.");
    e.preventDefault();
    return;
  }

  if (isNaN(price) || price <= 0) {
    Swal.fire("Invalid Product Price");
    e.preventDefault();
    return;
  }
  if (isNaN(discount) || discount < 0 || discount > 100) {
    Swal.fire("Invalid Product discount");
    e.preventDefault();
    return;
  }

  if (!Number.isInteger(Number(stock))) {
    Swal.fire("Invalid stock quantity");
    e.preventDefault();
    return;
  }

  // if (typeof size !== "string" || size.length < 1) {
  //   Swal.fire("Invalid size !");
  //   e.preventDefault();
  //   return;
  // }

  if (
    typeof description !== "string" ||
    description.length < 10 ||
    description.length > 300
  ) {
    Swal.fire("Description must be between 10 and 300 characters.");
    e.preventDefault();
    return;
  }

  // console.log(category);

  if (uploadedImages.length === 0) {
    Swal.fire({
      icon: "error",
      title: "No images uploaded",
      text: "Please upload images.",
    });
    e.preventDefault();
  }
  if (uploadedImages.length < 3) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please upload 3 images !",
    });
    e.preventDefault();
    return;
  }
});

function removeImage(imageUrl) {
  console.log(imageUrl);
  uploadedImages = uploadedImages.filter((val) => val !== imageUrl);
  const imageElements = document.querySelectorAll(
    "#image-preview-container img"
  );
  imageElements.forEach((imgElement) => {
    if (imgElement.src === imageUrl) {
      imgElement.parentElement.remove();
    }
    console.log(uploadedImages);
  });

  console.log("removed");
}
