// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Main initialization function
function initializeWebsite() {
    // Initialize components based on current page
    initializeNavigation();
    initializeCart();
    
    // Page-specific initializations
    const currentPage = document.body.dataset.page || getCurrentPage();
    
    switch(currentPage) {
        case 'home':
            initializeHomePage();
            break;
        case 'menu':
            initializeMenuPage();
            break;
        case 'cart':
            initializeCartPage();
            break;
        case 'contact':
            initializeContactPage();
            break;
        case 'profile':
            initializeProfilePage();
            break;
        case 'login':
            initializeLoginPage();
            break;
    }
}

// Get current page name from URL
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('menu')) return 'menu';
    if (path.includes('cart')) return 'cart';
    if (path.includes('contact')) return 'contact';
    if (path.includes('profile')) return 'profile';
    if (path.includes('login')) return 'login';
    return 'home';
}

// Navigation
function initializeNavigation() {
    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // Update cart count in navigation
    updateCartCount();
}

// Cart System
function initializeCart() {
    // Initialize cart in localStorage if not exists
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    });
}

function addToCart(item) {
    const cart = getCart();
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }
    
    saveCart(cart);
    showNotification('Item added to cart!');
}

function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    
    if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
    }
}

function updateCartItemQuantity(itemId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
    
    if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
    }
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #333;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        background-color: #28a745;
    }
    
    .notification-error {
        background-color: #dc3545;
    }
    
    .notification-warning {
        background-color: #ffc107;
        color: #333;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: 15px;
        font-size: 1.2rem;
    }
`;
document.head.appendChild(notificationStyles);

// Home Page Functions
function initializeHomePage() {
    // Background music toggle
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    if (musicToggle && backgroundMusic) {
        let isPlaying = false;
        
        musicToggle.addEventListener('click', function() {
            if (isPlaying) {
                backgroundMusic.pause();
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            } else {
                backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = !isPlaying;
        });
    }
    
    // Load specials
    loadSpecials();
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                // In a real app, you would send this to a server
                showNotification('Thank you for subscribing!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    }
    
    // Initialize map (simulated)
    initializeMap();
}

function loadSpecials() {
    const specials = [
        {
            id: 'special1',
            name: 'Chicken Mandi Special',
            description: 'Tender chicken with aromatic rice, served with salad and soup',
            price: 18.90,
            originalPrice: 22.90,
            image: 'assets/images/mandi-special.jpg',
            tag: 'Best Seller'
        },
        {
            id: 'special2',
            name: 'Shawarma Platter',
            description: 'Three types of shawarma with fries and dips',
            price: 24.90,
            originalPrice: 29.90,
            image: 'assets/images/shawarma-platter.jpg',
            tag: 'Special Offer'
        },
        {
            id: 'special3',
            name: 'Arabic Breakfast Set',
            description: 'Foul, hummus, falafel, and fresh bread',
            price: 15.90,
            originalPrice: 18.90,
            image: 'assets/images/breakfast-set.jpg',
            tag: 'New'
        }
    ];
    
    const container = document.getElementById('specialsContainer');
    if (container) {
        container.innerHTML = specials.map(special => `
            <div class="special-card">
                <div class="special-img">
                    <img src="${special.image}" alt="${special.name}">
                </div>
                <div class="special-content">
                    <span class="special-tag">${special.tag}</span>
                    <h3>${special.name}</h3>
                    <p>${special.description}</p>
                    <div class="special-price">
                        <span>RM ${special.price.toFixed(2)}</span>
                        <span style="text-decoration: line-through; color: #999; margin-left: 10px;">
                            RM ${special.originalPrice.toFixed(2)}
                        </span>
                    </div>
                    <button class="btn btn-primary" onclick="addSpecialToCart('${special.id}')">
                        Order Now
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function addSpecialToCart(specialId) {
    const specials = {
        'special1': { id: 'special1', name: 'Chicken Mandi Special', price: 18.90 },
        'special2': { id: 'special2', name: 'Shawarma Platter', price: 24.90 },
        'special3': { id: 'special3', name: 'Arabic Breakfast Set', price: 15.90 }
    };
    
    const special = specials[specialId];
    if (special) {
        addToCart({
            ...special,
            quantity: 1,
            instructions: ''
        });
    }
}

function initializeMap() {
    // This is a simulated map initialization
    // In a real app, you would use Google Maps API
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.innerHTML = `
            <div style="width: 100%; height: 100%; background-color: #e9ecef; 
                        display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center;">
                    <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: #C19A6B;"></i>
                    <p style="margin-top: 1rem; font-weight: 600;">88 Canteen Location</p>
                    <p>IIUM Campus, Gombak</p>
                </div>
            </div>
        `;
    }
}

// Menu Page Functions
function initializeMenuPage() {
    // Load menu items
    loadMenuItems();
    
    // Initialize filter
    initializeMenuFilter();
    
    // Initialize search
    initializeMenuSearch();
    
    // Initialize modal
    initializeOrderModal();
}

function loadMenuItems() {
    const menuItems = [
        // Shawarma
        { id: 1, name: 'Chicken Shawarma', description: 'Grilled chicken with vegetables in soft bread', price: 8.90, category: 'shawarma', image: 'assets/images/chicken-shawarma.jpg' },
        { id: 2, name: 'Beef Shawarma', description: 'Tender beef strips with tahini sauce', price: 9.90, category: 'shawarma', image: 'assets/images/beef-shawarma.jpg' },
        { id: 3, name: 'Falafel Shawarma', description: 'Crispy falafel with fresh vegetables', price: 7.90, category: 'shawarma', image: 'assets/images/falafel-shawarma.jpg' },
        
        // Rice Dishes
        { id: 4, name: 'Chicken Mandi', description: 'Aromatic rice with tender chicken', price: 16.90, category: 'rice', image: 'assets/images/chicken-mandi.jpg' },
        { id: 5, name: 'Lamb Kabsa', description: 'Spiced rice with lamb pieces', price: 19.90, category: 'rice', image: 'assets/images/lamb-kabsa.jpg' },
        { id: 6, name: 'Mixed Grill Rice', description: 'Grilled meats with saffron rice', price: 22.90, category: 'rice', image: 'assets/images/mixed-grill.jpg' },
        
        // Appetizers
        { id: 7, name: 'Hummus', description: 'Chickpea dip with olive oil', price: 6.90, category: 'appetizer', image: 'assets/images/hummus.jpg' },
        { id: 8, name: 'Fattoush Salad', description: 'Fresh salad with crispy bread', price: 7.90, category: 'appetizer', image: 'assets/images/fattoush.jpg' },
        { id: 9, name: 'Kibbeh', description: 'Fried bulgur with meat filling', price: 8.90, category: 'appetizer', image: 'assets/images/kibbeh.jpg' },
        
        // Drinks
        { id: 10, name: 'Arabic Coffee', description: 'Traditional cardamom coffee', price: 3.90, category: 'drink', image: 'assets/images/arabic-coffee.jpg' },
        { id: 11, name: 'Mint Lemonade', description: 'Refreshing mint and lemon drink', price: 4.90, category: 'drink', image: 'assets/images/mint-lemonade.jpg' },
        { id: 12, name: 'Ayran', description: 'Traditional yogurt drink', price: 3.90, category: 'drink', image: 'assets/images/ayran.jpg' }
    ];
    
    const container = document.getElementById('menuContainer');
    if (container) {
        container.innerHTML = menuItems.map(item => `
            <div class="menu-item" data-category="${item.category}">
                <div class="menu-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="menu-item-content">
                    <div class="menu-item-header">
                        <h3>${item.name}</h3>
                        <span class="menu-item-price">RM ${item.price.toFixed(2)}</span>
                    </div>
                    <span class="menu-item-category">${item.category}</span>
                    <p class="menu-item-description">${item.description}</p>
                    <button class="btn btn-primary" onclick="openOrderModal(${item.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function initializeMenuFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter items
            menuItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

function initializeMenuSearch() {
    const searchInput = document.getElementById('menuSearch');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            menuItems.forEach(item => {
                const itemName = item.querySelector('h3').textContent.toLowerCase();
                const itemDesc = item.querySelector('.menu-item-description').textContent.toLowerCase();
                
                if (itemName.includes(searchTerm) || itemDesc.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

let currentItemId = null;

function openOrderModal(itemId) {
    const menuItems = {
        1: { id: 1, name: 'Chicken Shawarma', price: 8.90 },
        2: { id: 2, name: 'Beef Shawarma', price: 9.90 },
        3: { id: 3, name: 'Falafel Shawarma', price: 7.90 },
        4: { id: 4, name: 'Chicken Mandi', price: 16.90 },
        5: { id: 5, name: 'Lamb Kabsa', price: 19.90 },
        6: { id: 6, name: 'Mixed Grill Rice', price: 22.90 },
        7: { id: 7, name: 'Hummus', price: 6.90 },
        8: { id: 8, name: 'Fattoush Salad', price: 7.90 },
        9: { id: 9, name: 'Kibbeh', price: 8.90 },
        10: { id: 10, name: 'Arabic Coffee', price: 3.90 },
        11: { id: 11, name: 'Mint Lemonade', price: 4.90 },
        12: { id: 12, name: 'Ayran', price: 3.90 }
    };
    
    const item = menuItems[itemId];
    if (item) {
        currentItemId = itemId;
        const modal = document.getElementById('orderModal');
        const details = document.getElementById('modalItemDetails');
        
        details.innerHTML = `
            <h3>${item.name}</h3>
            <p>RM ${item.price.toFixed(2)}</p>
        `;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function initializeOrderModal() {
    const modal = document.getElementById('orderModal');
    const closeBtn = document.querySelector('.close-modal');
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.getElementById('itemQty');
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Quantity controls
    if (minusBtn && plusBtn && qtyInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(qtyInput.value);
            if (value > 1) {
                qtyInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(qtyInput.value);
            if (value < 10) {
                qtyInput.value = value + 1;
            }
        });
        
        qtyInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 10) this.value = 10;
        });
    }
    
    // Add to cart button
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const menuItems = {
                1: { id: 1, name: 'Chicken Shawarma', price: 8.90 },
                2: { id: 2, name: 'Beef Shawarma', price: 9.90 },
                3: { id: 3, name: 'Falafel Shawarma', price: 7.90 },
                4: { id: 4, name: 'Chicken Mandi', price: 16.90 },
                5: { id: 5, name: 'Lamb Kabsa', price: 19.90 },
                6: { id: 6, name: 'Mixed Grill Rice', price: 22.90 },
                7: { id: 7, name: 'Hummus', price: 6.90 },
                8: { id: 8, name: 'Fattoush Salad', price: 7.90 },
                9: { id: 9, name: 'Kibbeh', price: 8.90 },
                10: { id: 10, name: 'Arabic Coffee', price: 3.90 },
                11: { id: 11, name: 'Mint Lemonade', price: 4.90 },
                12: { id: 12, name: 'Ayran', price: 3.90 }
            };
            
            const item = menuItems[currentItemId];
            if (item) {
                const quantity = parseInt(document.getElementById('itemQty').value);
                const instructions = document.getElementById('instructions').value;
                
                addToCart({
                    ...item,
                    quantity: quantity,
                    instructions: instructions
                });
                
                // Close modal
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                
                // Reset form
                document.getElementById('itemQty').value = 1;
                document.getElementById('instructions').value = '';
            }
        });
    }
}

// Cart Page Functions
function initializeCartPage() {
    updateCartDisplay();
    
    // Delivery option change
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', updateCartTotals);
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckoutModal);
    }
    
    // Initialize checkout modal
    initializeCheckoutModal();
}

function updateCartDisplay() {
    const cart = getCart();
    const container = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (container) container.innerHTML = '';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    
    if (container) {
        container.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-img">
                    <img src="assets/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">RM ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    ${item.instructions ? `<p class="cart-item-instructions"><small>Note: ${item.instructions}</small></p>` : ''}
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="qty-btn minus" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1" 
                                   onchange="updateCartItemQuantity(${item.id}, this.value)">
                            <button class="qty-btn plus" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateCartTotals();
    if (checkoutBtn) checkoutBtn.disabled = false;
}

function updateCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const deliveryOption = document.querySelector('input[name="delivery"]:checked');
    const deliveryFee = deliveryOption && deliveryOption.value === 'delivery' ? 5.00 : 0.00;
    
    const discount = subtotal * 0.10; // 10% student discount
    const total = subttotal + deliveryFee - discount;
    
    // Update display
    document.getElementById('subtotal').textContent = `RM ${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = `RM ${deliveryFee.toFixed(2)}`;
    document.getElementById('discount').textContent = `- RM ${discount.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `RM ${total.toFixed(2)}`;
}

// Checkout Modal
function initializeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const closeBtn = modal ? modal.querySelector('.close-modal') : null;
    const form = document.getElementById('checkoutForm');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateCheckoutForm()) {
                // In a real app, you would process the order here
                showNotification('Order placed successfully!', 'success');
                
                // Clear cart
                clearCart();
                
                // Close modal
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                
                // Reset form
                this.reset();
                
                // Update cart display
                updateCartDisplay();
            }
        });
    }
}

function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const summary = document.getElementById('checkoutSummary');
    
    if (modal && summary) {
        const cart = getCart();
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal * 0.10;
        const deliveryOption = document.querySelector('input[name="delivery"]:checked');
        const deliveryFee = deliveryOption && deliveryOption.value === 'delivery' ? 5.00 : 0.00;
        const total = subtotal + deliveryFee - discount;
        
        summary.innerHTML = `
            <div class="summary-row">
                <span>Items (${cart.length})</span>
                <span>RM ${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Delivery</span>
                <span>RM ${deliveryFee.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Student Discount</span>
                <span>- RM ${discount.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>RM ${total.toFixed(2)}</span>
            </div>
        `;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function validateCheckoutForm() {
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const payment = document.getElementById('payment');
    
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
    });
    
    // Validate name
    if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
    }
    
    // Validate phone
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value.replace(/\D/g, ''))) {
        showError(phone, 'Valid phone number is required');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim() || !validateEmail(email.value)) {
        showError(email, 'Valid email is required');
        isValid = false;
    }
    
    // Validate payment
    if (!payment.value) {
        showError(payment, 'Please select a payment method');
        isValid = false;
    }
    
    return isValid;
}

function showError(input, message) {
    const errorId = input.id + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    input.style.borderColor = 'var(--danger)';
    input.addEventListener('input', function() {
        this.style.borderColor = '#eee';
        if (errorElement) errorElement.classList.remove('show');
    });
}

// Contact Page Functions
function initializeContactPage() {
    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                // In a real app, you would send the form data to a server
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                this.reset();
            }
        });
    }
    
    // FAQ accordion
    initializeFAQ();
}

function validateContactForm() {
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
    });
    
    // Validate name
    if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim() || !validateEmail(email.value)) {
        showError(email, 'Valid email is required');
        isValid = false;
    }
    
    // Validate subject
    if (!subject.value) {
        showError(subject, 'Please select a subject');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
    }
    
    return isValid;
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Profile Page Functions
function initializeProfilePage() {
    // Profile menu tabs
    const menuItems = document.querySelectorAll('.profile-menu-item');
    const tabs = document.querySelectorAll('.profile-tab');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab
            const target = this.getAttribute('href').substring(1);
            tabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.id === target) {
                    tab.classList.add('active');
                }
            });
        });
    });
    
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Profile updated successfully!', 'success');
            
            // Update user name display
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            document.getElementById('userName').textContent = `${firstName} ${lastName}`;
        });
    }
    
    // Settings toggles
    document.querySelectorAll('.switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.closest('.setting-item').querySelector('h3').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            showNotification(`${setting} ${status}`, 'success');
        });
    });
}

// Login Page Functions
function initializeLoginPage() {
    // Form switching
    const switchLinks = document.querySelectorAll('.switch-form');
    const forms = document.querySelectorAll('.auth-form');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    switchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.dataset.target;
            
            // Hide all forms and welcome message
            forms.forEach(form => form.classList.remove('active'));
            if (welcomeMessage) welcomeMessage.style.display = 'none';
            
            // Show target form
            const targetForm = document.getElementById(target + 'Form');
            if (targetForm) {
                targetForm.classList.add('active');
            }
        });
    });
    
    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Login form
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateLoginForm()) {
                // Simulate login
                localStorage.setItem('isLoggedIn', 'true');
                showNotification('Login successful!', 'success');
                
                // Redirect to home page after 1 second
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupFormElement');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateSignupForm()) {
                // Hide signup form, show welcome message
                forms.forEach(form => form.classList.remove('active'));
                if (welcomeMessage) {
                    welcomeMessage.style.display = 'block';
                }
                
                // Store user data (simulated)
                const userData = {
                    firstName: document.getElementById('signupFirstName').value,
                    lastName: document.getElementById('signupLastName').value,
                    email: document.getElementById('signupEmail').value,
                    phone: document.getElementById('signupPhone').value
                };
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
            }
        });
        
        // Password strength indicator
        const passwordInput = document.getElementById('signupPassword');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        if (passwordInput && strengthBar && strengthText) {
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                const strength = calculatePasswordStrength(password);
                
                // Update strength bar
                strengthBar.style.width = `${strength.percentage}%`;
                strengthBar.style.backgroundColor = strength.color;
                strengthText.textContent = `Password strength: ${strength.text}`;
            });
        }
    }
    
    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList.contains('google') ? 'Google' : 'Facebook';
            showNotification(`${platform} login would be implemented here`, 'warning');
        });
    });
}

function validateLoginForm() {
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
    });
    
    // Validate email
    if (!email.value.trim() || !validateEmail(email.value)) {
        document.getElementById('emailError').textContent = 'Valid email is required';
        document.getElementById('emailError').classList.add('show');
        isValid = false;
    }
    
    // Validate password
    if (!password.value.trim()) {
        document.getElementById('passwordError').textContent = 'Password is required';
        document.getElementById('passwordError').classList.add('show');
        isValid = false;
    }
    
    return isValid;
}

function validateSignupForm() {
    const firstName = document.getElementById('signupFirstName');
    const lastName = document.getElementById('signupLastName');
    const email = document.getElementById('signupEmail');
    const phone = document.getElementById('signupPhone');
    const password = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const terms = document.getElementById('terms');
    
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
    });
    
    // Validate first name
    if (!firstName.value.trim()) {
        showError(firstName, 'First name is required');
        isValid = false;
    }
    
    // Validate last name
    if (!lastName.value.trim()) {
        showError(lastName, 'Last name is required');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim() || !validateEmail(email.value)) {
        document.getElementById('signupEmailError').textContent = 'Valid email is required';
        document.getElementById('signupEmailError').classList.add('show');
        isValid = false;
    }
    
    // Validate phone
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value.replace(/\D/g, ''))) {
        showError(phone, 'Valid phone number is required');
        isValid = false;
    }
    
    // Validate password
    if (!password.value.trim()) {
        showError(password, 'Password is required');
        isValid = false;
    } else if (password.value.length < 6) {
        showError(password, 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // Validate confirm password
    if (password.value !== confirmPassword.value) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        document.getElementById('confirmPasswordError').classList.add('show');
        isValid = false;
    }
    
    // Validate terms
    if (!terms.checked) {
        showNotification('Please agree to the terms and conditions', 'error');
        isValid = false;
    }
    
    return isValid;
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 2;
    else if (password.length >= 6) score += 1;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    // Determine strength
    if (score >= 6) {
        return { percentage: 100, text: 'Strong', color: '#28a745' };
    } else if (score >= 4) {
        return { percentage: 66, text: 'Medium', color: '#ffc107' };
    } else if (score >= 2) {
        return { percentage: 33, text: 'Weak', color: '#dc3545' };
    } else {
        return { percentage: 0, text: 'Very Weak', color: '#dc3545' };
    }
}

// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add CSS for dynamic elements
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .strength-bar::after {
        transition: width 0.3s ease, background-color 0.3s ease;
    }
`;
document.head.appendChild(dynamicStyles);

// Export functions that need to be accessible from HTML
window.addSpecialToCart = addSpecialToCart;
window.openOrderModal = openOrderModal;
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeFromCart = removeFromCart;