import Product from "../../models/productModel.js";


export const loadProductDetails = async  (req, res) => {
    try {
        const {productId} = req.params;
        // console.log(productId)
        const product = await Product.findById(productId);
        if(product){
            res.status(200).render('user/productDetails', {product});
        }
    } catch (error) {
        console.log(error)
    }
}

