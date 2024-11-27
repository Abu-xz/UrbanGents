const addCategoryBtn = document.getElementById("add-category-btn");
const blockBtn = document.getElementById("block-btn");
// const editBtn = document.getElementById("edit-btn");
// const deleteBtn = document.getElementById("delete-btn");

// ============ Category ADD ================//

addCategoryBtn.addEventListener("click", (e) => {
  Swal.fire({
    title: "Enter new category",
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Add Category",
    preConfirm: (CategoryName) => {
      if (!CategoryName) {
        Swal.showValidationMessage("Oops! enter a category name...");
      }
      return CategoryName;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const categoryName = result.value;
      axios
        .post("/admin/addCategory", { categoryName })
        .then((response) => {
          if (response.data?.success) {
            Swal.fire("Success!", "Category added successfully!", "success");
            setTimeout(() => window.location.reload(), 1000);
          } else {
            Swal.fire("Error!", "There was an error adding category");
          }
        })
        .catch((error) => {
          Swal.fire(
            "Error!",
            error.response?.data?.message || "Something went wrong.",
            "error"
          );
        });
    }
  });
});
// ============ Category ADD ================//


// ============ Category Unblock ================//

function confirmUnblockCategory(categoryId, categoryName) {
  Swal.fire({
    title: `Unblock category "${categoryName}"`,
    text: "Are you sure you want to unblock this category?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Unblock it!",
    cancelButtonText: "No, Cancel",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      unblockCategory(categoryId);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Category is not Unblocked", "info");
    }
  });
}

function unblockCategory(categoryId) {
  axios
    .post("/admin/unblockCategory", { categoryId })
    .then((response) => {
      if (response.data.success) {
        Swal.fire("Unblocked", "The category has been unblocked", "success");
        setTimeout(() => location.reload(), 1000);
      } else {
        Swal.fire("Error!", "Failed to Unblock category.", "error");
      }
    })
    .catch((error) => {
      Swal.fire("Error!", "Something went wrong.", "error");
    });
}

// ============ Category Unblock ================//


// ============ Category Block ================//
function confirmBlockCategory(categoryId, categoryName) {
  Swal.fire({
    title: `Block category "${categoryName}"`,
    text: "Are you sure you want to block this category?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Block it!",
    cancelButtonText: "No, Cancel",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      blockCategory(categoryId);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Category is not blocked", "info");
    }
  });
}

function blockCategory(categoryId) {
  axios
    .post("/admin/blockCategory", { categoryId })
    .then((response) => {
      if (response.data.success) {
        Swal.fire("Blocked", "The category has been blocked", "success");
        setTimeout(() => location.reload(), 1000);
      } else {
        Swal.fire("Error!", "Failed to Block category.", "error");
      }
    })
    .catch((error) => {
      Swal.fire("Error!", "Something went wrong.", "error");
    });
}


// ============ Category Block ================//


// ============ Category Edit ================//

function editCategory(categoryId, categoryName) {
    Swal.fire({
        title: "Edit category",
        input: "text",
        inputLabel: `Edit category name for ${categoryName}`,
        inputValue:categoryName,
        showCancelButton: true,
        confirmButtonText: "Save changes",
        cancelButtonText:'Cancel',
        inputValidator: (value) => {
          if (!value) {
           return Swal.showValidationMessage("Oops! Category name can't empty.");
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const newCategoryName = result.value;
          if(categoryName === newCategoryName){
            return  Swal.fire("Error", "Oops! Category name can't be same.", "error");
          }
          axios
            .post("/admin/editCategory", { categoryId, newCategoryName })
            .then((response) => {
              if (response.data?.success) {
                Swal.fire("Success!", "Category name updated successfully!", "success");
                setTimeout(() => window.location.reload(), 1000);
              } else {
                Swal.fire("Error!", response.data?.message || "There was an error updating category", 'error');
              }
            })
            .catch((error) => {
              Swal.fire(
                "Error!",
                error.response?.data?.message || "Something went wrong.",
                "error"
              );
            });
        }
      });
}

// ============ Category Edit ================//