
        // Pizza data
        const pizzas = [
            {
                id: 1,
                name: "Pepperoni Pizza",
                description: "Classic pepperoni with mozzarella cheese",
                price: 12.99,
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
                category: "pizzas"
            },
            {
                id: 2,
                name: "Supreme Pizza",
                description: "Pepperoni, sausage, bell peppers, onions",
                price: 15.99,
                image: "https://media.istockphoto.com/id/1270988485/photo/supreme-pizza.jpg?s=612x612&w=0&k=20&c=pou6feCdoQz3J6gFmz687JXX3J_mZXwqA2C7Hi5Y-nk=",
                category: "pizzas"
            },
            {
                id: 3,
                name: "Hawaiian Pizza",
                description: "Ham, pineapple, mozzarella cheese",
                price: 14.99,
                image: "https://images.unsplash.com/photo-1571104508999-893933ded431?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
                category: "pizzas"
            },
            {
                id: 4,
                name: "Margherita Pizza",
                description: "Fresh mozzarella, tomatoes, basil",
                price: 13.99,
                image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
                category: "pizzas"
            },
            {
                id: 5,
                name: "Meat Lovers",
                description: "Pepperoni, sausage, ham, bacon",
                price: 16.99,
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
                category: "pizzas"
            },
            {
                id: 6,
                name: "Veggie Supreme",
                description: "Bell peppers, onions, mushrooms, olives",
                price: 14.99,
                image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
                category: "pizzas"
            }
        ];

        // Store data
        const stores = [
            {
                id: 1,
                name: "Domino's - Downtown",
                address: "123 Main Street",
                city: "Downtown",
                state: "CA",
                zipCode: "90210",
                phone: "(555) 123-4567"
            },
            {
                id: 2,
                name: "Domino's - Westside",
                address: "456 Oak Avenue",
                city: "Westside",
                state: "CA",
                zipCode: "90211",
                phone: "(555) 987-6543"
            }
        ];

        // Cart functionality
        let cart = [];
        let cartOpen = false;

        function toggleCart() {
            cartOpen = !cartOpen;
            const overlay = document.getElementById('cartOverlay');
            const backdrop = document.getElementById('cartBackdrop');
            
            if (cartOpen) {
                overlay.classList.add('open');
                backdrop.classList.add('open');
            } else {
                overlay.classList.remove('open');
                backdrop.classList.remove('open');
            }
        }

        function addToCart(pizzaId) {
            const pizza = pizzas.find(p => p.id === pizzaId);
            const existingItem = cart.find(item => item.pizzaId === pizzaId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: Date.now(),
                    pizzaId: pizzaId,
                    quantity: 1,
                    size: "Medium",
                    crust: "Hand Tossed"
                });
            }

            updateCartUI();
            
            // Show success feedback
            const button = document.querySelector(`[onclick="addToCart(${pizzaId})"]`);
            const originalText = button.textContent;
            button.textContent = "Added!";
            button.classList.add('added');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('added');
            }, 1000);
        }

        function updateQuantity(cartItemId, newQuantity) {
            if (newQuantity <= 0) {
                removeFromCart(cartItemId);
                return;
            }

            const item = cart.find(item => item.id === cartItemId);
            if (item) {
                item.quantity = newQuantity;
                updateCartUI();
            }
        }

        function removeFromCart(cartItemId) {
            cart = cart.filter(item => item.id !== cartItemId);
            updateCartUI();
        }

        function updateCartUI() {
            const cartCount = document.getElementById('cartCount');
            const cartContent = document.getElementById('cartContent');
            const cartFooter = document.getElementById('cartFooter');
            const totalPrice = document.getElementById('totalPrice');

            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;

            if (cart.length === 0) {
                cartContent.innerHTML = `
                    <div class="cart-empty">
                        <p>Your cart is empty</p>
                        <p style="font-size: 14px; color: #999;">Add some delicious pizzas to get started!</p>
                    </div>
                `;
                cartFooter.style.display = 'none';
            } else {
                cartContent.innerHTML = cart.map(item => {
                    const pizza = pizzas.find(p => p.id === item.pizzaId);
                    return `
                        <div class="cart-item">
                            <img src="${pizza.image}" alt="${pizza.name}" class="cart-item-image">
                            <div class="cart-item-info">
                                <div class="cart-item-name">${pizza.name}</div>
                                <div class="cart-item-details">${item.size} • ${item.crust}</div>
                                <div class="cart-item-footer">
                                    <div class="cart-item-price">$${pizza.price.toFixed(2)}</div>
                                    <div class="quantity-controls">
                                        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                        <span>${item.quantity}</span>
                                        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                                    </div>
                                </div>
                            </div>
                            <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
                        </div>
                    `;
                }).join('');

                const total = cart.reduce((sum, item) => {
                    const pizza = pizzas.find(p => p.id === item.pizzaId);
                    return sum + (pizza.price * item.quantity);
                }, 0);

                totalPrice.textContent = `$${total.toFixed(2)}`;
                cartFooter.style.display = 'block';
            }
        }

        function filterCategory(category) {
            const tabs = document.querySelectorAll('.category-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');

            const filteredPizzas = pizzas.filter(pizza => pizza.category === category);
            renderPizzas(filteredPizzas);
        }

        function renderPizzas(pizzasToRender) {
            const grid = document.getElementById('pizzaGrid');
            grid.innerHTML = pizzasToRender.map(pizza => `
                <div class="pizza-card">
                    <img src="${pizza.image}" alt="${pizza.name}" class="pizza-image">
                    <div class="pizza-info">
                        <h3 class="pizza-name">${pizza.name}</h3>
                        <p class="pizza-description">${pizza.description}</p>
                        <div class="pizza-footer">
                            <span class="pizza-price">$${pizza.price.toFixed(2)}</span>
                            <button class="add-to-cart" onclick="addToCart(${pizza.id})">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function findStores() {
            const address = document.getElementById('address').value;
            const resultsDiv = document.getElementById('storeResults');

            if (address.length < 3) {
                resultsDiv.innerHTML = '<p style="color: #999;">Please enter a valid address</p>';
                return;
            }

            // Simulate loading
            resultsDiv.innerHTML = '<p style="color: #999;">Searching for stores...</p>';

            setTimeout(() => {
                resultsDiv.innerHTML = stores.map(store => `
                    <div class="store-card">
                        <div class="store-name">${store.name}</div>
                        <div class="store-address">${store.address}, ${store.city}, ${store.state} ${store.zipCode}</div>
                        <div class="store-address">Phone: ${store.phone}</div>
                        <div class="store-actions">
                            <button class="btn btn-primary btn-small">Order Delivery</button>
                            <button class="btn btn-secondary btn-small">Order Carryout</button>
                        </div>
                    </div>
                `).join('');
            }, 1000);
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            renderPizzas(pizzas.filter(p => p.category === 'pizzas'));
        });