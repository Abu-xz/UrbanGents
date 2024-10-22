
function blockProduct(productId) {
    axios.post('/admin/products/block', { productId })
        .then((response) => {
            console.log(response.data);

            if (response.data.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                    showConfirmButton: false,
                    timer: 1000
                });
                setTimeout(() => {
                    window.location.href = '/admin/products';
                }, 1100);

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message || 'Something went wrong!',
                });
            }
        })
        .catch((error) => {

            console.error('Error blocking product:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while blocking the product. Please try again later.',
            });
        });
};



