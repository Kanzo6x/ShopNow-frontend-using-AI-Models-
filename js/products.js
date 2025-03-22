const products = [
    {
        id: 1,
        name: "Smartphone X",
        price: 599.99,
        category: "electronics",
        image: "../media/smartphone.jpg",
        description: "Latest smartphone with amazing features",
        stock: 10
    },
    {
        id: 2,
        name: "Ceiling Lamp",
        price: 99.99,
        category: "Home & Living",
        image: "../media/lamp.jpg",  // Matches the actual image name
        description: "Modern ceiling lamp for your home",
        stock: 15
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        price: 29.99,
        category: "fashion",
        image: "../media/cottontshirt.jpg",
        description: "Comfortable cotton t-shirt",
        stock: 20
    }
    // Add more products here
];

// Add image path correction for index page
function getImagePath(path) {
    // Check if we're on the index page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        return path.replace('../', './');
    }
    return path;
}

function displayProducts(container, productsList) {
    const productsContainer = document.getElementById(container);
    productsContainer.innerHTML = productsList.map(product => `
        <div class="product-card" role="article" aria-labelledby="product-${product.id}-title">
            <span class="category-tag" role="text">${product.category}</span>
            <a href="product-detail.html?id=${product.id}" 
               aria-labelledby="product-${product.id}-title product-${product.id}-price">
                <img src="${getImagePath(product.image)}" alt="${product.name}" loading="lazy">
                <h3 id="product-${product.id}-title">${product.name}</h3>
                <p class="price" id="product-${product.id}-price">$${product.price.toFixed(2)}</p>
                ${product.stock < 5 ? 
                    `<p class="stock-warning" role="alert">Only ${product.stock} left!</p>` : ''}
            </a>
            <button onclick="addToCart(${product.id})" class="add-to-cart"
                ${product.stock === 0 ? 'disabled aria-disabled="true"' : ''}
                aria-label="${product.stock === 0 ? 'Out of Stock' : `Add ${product.name} to cart`}">
                ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    `).join('');

    // Announce product count to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.classList.add('sr-only');
    announcement.textContent = `Showing ${productsList.length} products`;
    productsContainer.appendChild(announcement);
}

function displayProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (product && document.getElementById('product-detail')) {
        document.getElementById('product-detail').innerHTML = `
            <div class="product-detail">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h1>${product.name}</h1>
                    <p class="price">$${product.price}</p>
                    <p class="description">${product.description}</p>
                    <div class="quantity">
                        <label for="quantity">Quantity:</label>
                        <input type="number" id="quantity" value="1" min="1">
                    </div>
                    <button onclick="addToCart(${product.id})" class="add-to-cart-large">Add to Cart</button>
                </div>
            </div>
        `;
    }
}

function searchProducts(query) {
    query = query.toLowerCase().trim();
    return products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
}

function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.querySelector('.search-bar input');
    const searchResults = searchProducts(searchInput.value);
    
    if (document.getElementById('products-list')) {
        displayProducts('products-list', searchResults);
        // Update results count
        document.querySelector('.products-header h2').textContent = 
            `Products (${searchResults.length} results)`;
    } else {
        // Redirect to products page with search query
        window.location.href = `${window.location.pathname.includes('pages') ? '' : 'pages/'}products.html?search=${encodeURIComponent(searchInput.value)}`;
    }
}

// Initialize products and search
document.addEventListener('DOMContentLoaded', () => {
    const featuredProducts = products.slice(0, 4);
    if (document.getElementById('featured-products')) {
        displayProducts('featured-products', featuredProducts);
    }
    if (document.getElementById('products-list')) {
        displayProducts('products-list', products);
    }
    if (document.getElementById('product-detail')) {
        displayProductDetail();
    }

    // Setup search functionality
    const searchForm = document.querySelector('.search-bar');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
        
        // Add live search functionality
        const searchInput = searchForm.querySelector('input');
        searchInput.addEventListener('input', (e) => {
            if (e.target.value.length >= 2) {
                const results = searchProducts(e.target.value).slice(0, 5);
                showSearchSuggestions(results, searchInput);
            } else {
                hideSearchSuggestions();
            }
        });
    }

    // Check for search query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && document.getElementById('products-list')) {
        document.querySelector('.search-bar input').value = searchQuery;
        displayProducts('products-list', searchProducts(searchQuery));
    }
});

function showSearchSuggestions(results, searchInput) {
    let suggestions = document.getElementById('search-suggestions');
    if (!suggestions) {
        suggestions = document.createElement('div');
        suggestions.id = 'search-suggestions';
        searchInput.parentNode.appendChild(suggestions);
    }

    suggestions.innerHTML = results.map(product => `
        <div class="search-suggestion" onclick="handleSuggestionClick('${product.name}')">
            <img src="${product.image}" alt="${product.name}">
            <div>
                <div>${product.name}</div>
                <small>${product.category}</small>
            </div>
        </div>
    `).join('');

    suggestions.style.display = 'block';
}

function hideSearchSuggestions() {
    const suggestions = document.getElementById('search-suggestions');
    if (suggestions) {
        suggestions.style.display = 'none';
    }
}

function handleSuggestionClick(productName) {
    const searchInput = document.querySelector('.search-bar input');
    searchInput.value = productName;
    hideSearchSuggestions();
    handleSearch(new Event('submit'));
}

// Add click outside listener to close suggestions
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar')) {
        hideSearchSuggestions();
    }
});

function showMessage(text, type = 'success') {
    const message = document.createElement('div');
    message.className = `cart-message ${type}`;
    message.setAttribute('role', 'alert');
    message.setAttribute('aria-live', 'assertive');
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => message.remove(), 300);
    }, 2000);
}
