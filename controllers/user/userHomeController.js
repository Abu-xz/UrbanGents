import Product from '../../models/productModel.js'
// import Category from '../../models/categoryModel.js'


export const loadHome = async (req, res ) => {
    try {
        const product = await Product.find({isActive:true, isDeleted: false}).limit(8);
        const spotlight = await Product.find({isActive:true, isDeleted: false}).limit(3);
        
        console.log(spotlight)
        console.log(product)
        console.log('user home route reached')
        res.status(200).render('user/userHome', {product, spotlight});
    } catch (error) {
        console.log(error);
    }

}