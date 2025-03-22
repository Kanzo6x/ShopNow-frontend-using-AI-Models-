document.addEventListener('DOMContentLoaded', () => {
    displayCheckoutItems();
    setupCheckoutForm();
});

function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
}

function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zip: document.getElementById('zip').value,
            cardNumber: document.getElementById('card-number').value,
            expiry: document.getElementById('expiry').value,
            cvv: document.getElementById('cvv').value
        };

        try {
            await processOrder(formData);
            // Clear cart after successful order
            localStorage.removeItem('cart');
            // Redirect to success page
            window.location.href = 'order-success.html';
        } catch (error) {
            alert('There was an error processing your order. Please try again.');
        }
    });
}

async function processOrder(formData) {
    // Simulate order processing with a delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Order processed:', formData);
            resolve({ success: true, orderId: 'ORD' + Date.now() });
        }, 1500);
    });
}
