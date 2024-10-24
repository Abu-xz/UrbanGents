const productImage = document.getElementById('product-image');
const thumbnail = document.getElementById('thumbnail');

thumbnail.addEventListener('click', (e) => {
    const target = e.target.src;
    productImage.src = target;

});


