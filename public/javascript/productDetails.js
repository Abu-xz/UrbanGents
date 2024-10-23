const productImage = document.getElementById('product-image');
const thumbnail = document.getElementById('thumbnail');
console.log(productImage.src);


thumbnail.addEventListener('click', (e) => {
    const target = e.target.src;
    console.log(target);
    productImage.src = target;
    console.log(productImage.src + 'after new src')
});




//========================= image zoom  =====================//


//========================= image zoom  =====================//
