function blockProduct(productId){
    axios.post('/admin/product/block', {productId})
        .then((response) => {
            
        })
        .catch((error) => {

        })
}