import Product from "../../models/productModel.js";


export const loadProductDetails = async  (req, res) => {
    try {
        const {productId} = req.params;
        const relatedProduct = await Product.find({isActive:true}).skip(5).limit(4);

        // console.log(productId)
        const product = await Product.findById(productId);
        if(product){
            res.status(200).render('user/productDetails', {product, relatedProduct});
        }
    } catch (error) {
        console.log(error)
    }
}

