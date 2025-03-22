let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = document.getElementById('quantity')?.value || 1;
    
    if (product.stock < quantity) {
        showMessage('Not enough items in stock!', 'error');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        cart.push({ ...product, quantity: parseInt(quantity) });
    }
    
    saveCart();
    updateCartCount(true); // animate the counter
    showAddedToCartMessage();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCart();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (item && newQuantity > 0 && newQuantity <= product.stock) {
        item.quantity = parseInt(newQuantity);
        saveCart();
        displayCart();
    } else if (newQuantity > product.stock) {
        showMessage('Not enough items in stock!', 'error');
        displayCart(); // Reset display to previous valid state
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount(animate = false) {
    const counts = document.querySelectorAll('#cart-count');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    counts.forEach(el => {
        if (animate) {
            el.classList.add('cart-count-update');
            setTimeout(() => el.classList.remove('cart-count-update'), 300);
        }
        el.textContent = count;
    });
}

function getImagePath(path) {
    // Check if we're in the pages directory
    if (window.location.pathname.includes('/pages/')) {
        return path;
    }
    // If we're on the index page, adjust the path
    return path.replace('../', './');
}

function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="products.html" class="cta-button">Continue Shopping</a>
            </div>
        `;
        document.getElementById('cart-total').textContent = '$0.00';
        document.getElementById('cart-subtotal').textContent = '$0.00';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${getImagePath(item.image)}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">$${item.price}</p>
                <div class="quantity-controls">
                    <input type="number" value="${item.quantity}" 
                        min="1" onchange="updateQuantity(${item.id}, this.value)">
                    <button onclick="removeFromCart(${item.id})" aria-label="Remove ${item.name} from cart">
                        Remove
                    </button>
                </div>
            </div>
            <div class="item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
}

function showAddedToCartMessage() {
    const message = document.createElement('div');
    message.className = 'added-to-cart-message';
    message.textContent = 'Added to cart!';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
}

function showMessage(text, type = 'success') {
    const message = document.createElement('div');
    message.className = `cart-message ${type}`;
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => message.remove(), 300);
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayCart();
    
    // Add checkout button handler
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                alert('Your cart is empty!');
            }
        });
    }
});
