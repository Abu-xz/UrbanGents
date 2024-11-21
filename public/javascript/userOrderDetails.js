console.log('order details script');
const invoiceBtn = document.getElementById('downloadPdf');
invoiceBtn.addEventListener('click', () => {
    const orderId = invoiceBtn.getAttribute('data-orderId')
    
    window.location.href = `/user/order-invoice?orderId=${orderId}`;
})