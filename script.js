
    // Intersection Observer for 3D Category Cards Entrance Animation
    document.addEventListener("DOMContentLoaded", function () {
        const categoryCards = document.querySelectorAll(".card-3d");

        const categoryObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-card");
                } else {
                    entry.target.classList.remove("animate-card");
                }
            });
        }, {
            threshold: 0.2
        });

        categoryCards.forEach((card) => categoryObserver.observe(card));

        // Slide-Over Drawer Script & Functionality
        const cartNavTrigger = document.getElementById('cartNavTrigger');
        const cartDrawer = document.getElementById('cartDrawer');
        const cartOverlay = document.getElementById('cartOverlay');
        const cartCloseBtn = document.getElementById('cartCloseBtn');
        const cartDrawerBody = document.getElementById('cartDrawerBody');
        const cartTotalPrice = document.getElementById('cartTotalPrice');

        const wishlistNavTrigger = document.getElementById('wishlistNavTrigger');
        const wishlistDrawer = document.getElementById('wishlistDrawer');
        const wishlistOverlay = document.getElementById('wishlistOverlay');
        const wishlistCloseBtn = document.getElementById('wishlistCloseBtn');
        const wishlistDrawerBody = document.getElementById('wishlistDrawerBody');
        const wishlistTotalCount = document.getElementById('wishlistTotalCount');

        function openCart() { cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); }
        function closeCart() { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); }
        function openWishlist() { wishlistDrawer.classList.add('open'); wishlistOverlay.classList.add('open'); }
        function closeWishlist() { wishlistDrawer.classList.remove('open'); wishlistOverlay.classList.remove('open'); }

        if (cartNavTrigger) cartNavTrigger.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
        if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
        if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

        if (wishlistNavTrigger) wishlistNavTrigger.addEventListener('click', (e) => { e.preventDefault(); openWishlist(); });
        if (wishlistCloseBtn) wishlistCloseBtn.addEventListener('click', closeWishlist);
        if (wishlistOverlay) wishlistOverlay.addEventListener('click', closeWishlist);

        // Persistent Cart & Wishlist Integration with localStorage
        window.cartItems = JSON.parse(localStorage.getItem("fimpsCart")) || [];
        window.cartItems = window.cartItems.map(item => ({
            ...item,
            quantity: parseInt(item.quantity) || 1
        }));

        window.wishlistItems = JSON.parse(localStorage.getItem("fimpsWishlist")) || [];

        const cartBadge = document.querySelector(".cart-badge");
        const wishlistBadge = document.querySelector(".wishlist-badge");

        function updateEverything() {
            const totalCartQty = window.cartItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
            if (cartBadge) cartBadge.innerText = totalCartQty;
            if (wishlistBadge) wishlistBadge.innerText = window.wishlistItems.length;

            // Save both to localStorage
            localStorage.setItem("fimpsCart", JSON.stringify(window.cartItems));
            localStorage.setItem("fimpsWishlist", JSON.stringify(window.wishlistItems));

            // Render Cart Drawer
            if (window.cartItems.length === 0) {
                cartDrawerBody.innerHTML = `<p class="cart-empty-msg">Your bag is currently empty.</p>`;
                cartTotalPrice.innerText = `Rs. 0`;
            } else {
                let html = '';
                let grandTotal = 0;
                window.cartItems.forEach(item => {
                    const itemTotal = parseInt(item.price.replace(/,/g, '')) * (parseInt(item.quantity) || 1);
                    grandTotal += itemTotal;
                    html += `
                        <div class="cart-item-row" data-id="${item.id}">
                            <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                            <div class="cart-item-details">
                                <h4 class="cart-item-title">${item.title}</h4>
                                <p class="cart-item-price">Rs ${item.price}</p>
                                <p class="cart-item-qty">Qty: ${item.quantity}</p>
                            </div>
                            <button class="cart-item-remove" title="Remove"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    `;
                });
                cartDrawerBody.innerHTML = html;
                cartTotalPrice.innerText = `Rs. ${grandTotal.toLocaleString('en-IN')}`;
            }

            // Render Wishlist Drawer
            if (window.wishlistItems.length === 0) {
                wishlistDrawerBody.innerHTML = `<p class="cart-empty-msg">Your wishlist is currently empty.</p>`;
                if (wishlistTotalCount) wishlistTotalCount.innerText = "0";
            } else {
                let html = '';
                window.wishlistItems.forEach(item => {
                    html += `
                        <div class="cart-item-row" data-id="${item.id}">
                            <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                            <div class="cart-item-details">
                                <h4 class="cart-item-title">${item.title}</h4>
                                <p class="cart-item-price">Rs ${item.price}</p>
                            </div>
                            <button class="wishlist-item-remove" title="Remove"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    `;
                });
                wishlistDrawerBody.innerHTML = html;
                if (wishlistTotalCount) wishlistTotalCount.innerText = window.wishlistItems.length;
            }
        }

        // Run UI update immediately on load
        updateEverything();

        // Sync wishlist hearts on load
        window.wishlistItems.forEach(wishItem => {
            document.querySelectorAll(".product-card").forEach(card => {
                if (card.getAttribute("data-id") === wishItem.id) {
                    const btn = card.querySelector(".wishlist-btn");
                    if (btn) {
                        btn.classList.add("active");
                        const icon = btn.querySelector("i");
                        icon.classList.remove("fa-regular");
                        icon.classList.add("fa-solid");
                    }
                }
            });
        });

        // Wishlist Heart Click Event
        document.querySelectorAll(".wishlist-btn").forEach((btn) => {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                const card = this.closest(".product-card");
                if (!card) return;

                const id = card.getAttribute("data-id");
                const title = card.querySelector(".product-title") ? card.querySelector(".product-title").innerText : "Product";
                const price = card.getAttribute("data-price") || "0";
                const img = card.querySelector(".product-image-box img") ? card.querySelector(".product-image-box img").src : "";
                const icon = this.querySelector("i");

                const index = window.wishlistItems.findIndex(i => i.id === id);
                if (index === -1) {
                    window.wishlistItems.push({ id, title, price, img });
                    this.classList.add("active");
                    icon.classList.remove("fa-regular");
                    icon.classList.add("fa-solid");
                } else {
                    window.wishlistItems.splice(index, 1);
                    this.classList.remove("active");
                    icon.classList.remove("fa-solid");
                    icon.classList.add("fa-regular");
                }

                updateEverything();
            });
        });

        // Add to Bag / Buy Now / Quantity Controls Event
        document.addEventListener("click", function (e) {
            if (e.target.closest(".add-to-bag-btn") || e.target.closest(".buy-now-btn")) {
                const isBuyNow = e.target.closest(".buy-now-btn") !== null;
                const actionBtn = e.target.closest(".add-to-bag-btn") || e.target.closest(".buy-now-btn");
                const card = actionBtn.closest(".product-card");
                if (!card) return;

                const id = card.getAttribute("data-id");
                const title = card.querySelector(".product-title") ? card.querySelector(".product-title").innerText : "Product";
                const price = card.getAttribute("data-price") || "0";
                const img = card.querySelector(".product-image-box img") ? card.querySelector(".product-image-box img").src : "";

                const existingItem = window.cartItems.find(i => i.id === id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    window.cartItems.push({ id, title, price, img, quantity: 1 });
                }

                const currentQty = window.cartItems.find(i => i.id === id).quantity;
                updateCardButtonUI(card, currentQty);
                updateEverything();

                if (isBuyNow) {
                    openCart();
                }
            }

            if (e.target.closest(".qty-plus")) {
                const btn = e.target.closest(".qty-plus");
                const card = btn.closest(".product-card");
                const id = card.getAttribute("data-id");

                const item = window.cartItems.find(i => i.id === id);
                if (item) {
                    item.quantity += 1;
                    updateCardButtonUI(card, item.quantity);
                    updateEverything();
                }
            }

            if (e.target.closest(".qty-minus")) {
                const btn = e.target.closest(".qty-minus");
                const card = btn.closest(".product-card");
                const id = card.getAttribute("data-id");

                const itemIndex = window.cartItems.findIndex(i => i.id === id);
                if (itemIndex !== -1) {
                    window.cartItems[itemIndex].quantity -= 1;
                    
                    if (window.cartItems[itemIndex].quantity <= 0) {
                        window.cartItems.splice(itemIndex, 1);
                        resetCardButtonUI(card);
                    } else {
                        updateCardButtonUI(card, window.cartItems[itemIndex].quantity);
                    }
                    updateEverything();
                }
            }

            // Remove from Cart Drawer via trash icon
            if (e.target.closest(".cart-item-remove")) {
                const row = e.target.closest(".cart-item-row");
                const id = row.getAttribute("data-id");

                window.cartItems = window.cartItems.filter(i => i.id !== id);

                document.querySelectorAll(".product-card").forEach(card => {
                    if (card.getAttribute("data-id") === id) {
                        resetCardButtonUI(card);
                    }
                });

                updateEverything();
            }

            // Remove from Wishlist Drawer via trash icon
            if (e.target.closest(".wishlist-item-remove")) {
                const row = e.target.closest(".cart-item-row");
                const id = row.getAttribute("data-id");

                window.wishlistItems = window.wishlistItems.filter(i => i.id !== id);

                document.querySelectorAll(".product-card").forEach(card => {
                    if (card.getAttribute("data-id") === id) {
                        const btn = card.querySelector(".wishlist-btn");
                        if (btn) {
                            btn.classList.remove("active");
                            const icon = btn.querySelector("i");
                            icon.classList.remove("fa-solid");
                            icon.classList.add("fa-regular");
                        }
                    }
                });

                updateEverything();
            }
        });

        // Global Click Listener to reset quantity controller back to buttons when clicking outside anywhere
        document.addEventListener("click", function(e) {
            document.querySelectorAll(".product-card").forEach(card => {
                const qtyBox = card.querySelector(".qty-controller-box");
                const buttonsRow = card.querySelector(".product-buttons-row");
                
                if (qtyBox && buttonsRow) {
                    if (!card.contains(e.target)) {
                        qtyBox.remove();
                        buttonsRow.style.display = "flex";
                    }
                }
            });
        });

        // Functional Search Bar Logic
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();
                const productCards = document.querySelectorAll(".product-card");

                productCards.forEach(card => {
                    const title = card.querySelector(".product-title") ? card.querySelector(".product-title").innerText.toLowerCase() : "";
                    const subtitle = card.querySelector(".product-subtitle") ? card.querySelector(".product-subtitle").innerText.toLowerCase() : "";

                    if (title.includes(query) || subtitle.includes(query)) {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        }
    });

    function updateCardButtonUI(card, qty) {
        const buttonsRow = card.querySelector(".product-buttons-row");
        if (!buttonsRow) return;

        let qtyBox = card.querySelector(".qty-controller-box");
        
        if (!qtyBox) {
            buttonsRow.style.display = "none";

            qtyBox = document.createElement("div");
            qtyBox.className = "qty-controller-box";
            qtyBox.style.cssText = `
                display: flex;
                align-items: center;
                background-color: #8c5b5a;
                color: #ffffff;
                border-radius: 20px;
                padding: 4px 12px;
                gap: 12px;
                font-size: 11px;
                font-weight: 600;
                width: 100%;
                justify-content: space-between;
                margin-top: 6px;
            `;
            buttonsRow.parentNode.appendChild(qtyBox);
        }

        qtyBox.innerHTML = `
            <button class="qty-btn qty-minus" style="background:none; border:none; color:#fff; cursor:pointer; padding:0 4px; font-weight:bold; font-size:14px;">-</button>
            <span class="qty-val">${qty}</span>
            <button class="qty-btn qty-plus" style="background:none; border:none; color:#fff; cursor:pointer; padding:0 4px; font-weight:bold; font-size:14px;">+</button>
        `;
    }

    function resetCardButtonUI(card) {
        const qtyBox = card.querySelector(".qty-controller-box");
        if (qtyBox) qtyBox.remove();

        const buttonsRow = card.querySelector(".product-buttons-row");
        if (buttonsRow) buttonsRow.style.display = "flex";
    }

    // Product Image Click -> Redirects to Checkout Page
    document.querySelectorAll(".product-image-box img").forEach((imgBox) => {
        imgBox.style.cursor = "pointer";
        imgBox.addEventListener("click", function (e) {
            e.stopPropagation();
            const card = this.closest(".product-card");
            if (!card) return;

            const title = card.querySelector(".product-title") ? card.querySelector(".product-title").innerText : "Product";
            const price = card.getAttribute("data-price") || "0";
            const img = this.src;
            const subtitle = card.querySelector(".product-subtitle") ? card.querySelector(".product-subtitle").innerText : "";

            const encodedTitle = encodeURIComponent(title);
            const encodedPrice = encodeURIComponent(price);
            const encodedImg = encodeURIComponent(img);
            const encodedSub = encodeURIComponent(subtitle);

            window.location.href = `checkout.html?title=${encodedTitle}&price=${encodedPrice}&img=${encodedImg}&subtitle=${encodedSub}`;
        });
    });

    // Buy Now Button Click -> Redirects to Checkout Page
    document.addEventListener("click", function (e) {
        if (e.target.closest(".buy-now-btn")) {
            const actionBtn = e.target.closest(".buy-now-btn");
            const card = actionBtn.closest(".product-card");
            if (!card) return;

            const title = card.querySelector(".product-title") ? card.querySelector(".product-title").innerText : "Product";
            const price = card.getAttribute("data-price") || "0";
            const img = card.querySelector(".product-image-box img") ? card.querySelector(".product-image-box img").src : "";
            const subtitle = card.querySelector(".product-subtitle") ? card.querySelector(".product-subtitle").innerText : "";

            const encodedTitle = encodeURIComponent(title);
            const encodedPrice = encodeURIComponent(price);
            const encodedImg = encodeURIComponent(img);
            const encodedSub = encodeURIComponent(subtitle);

            window.location.href = `checkout.html?title=${encodedTitle}&price=${encodedPrice}&img=${encodedImg}&subtitle=${encodedSub}`;
        }
    });

    // Proceed to Checkout Redirection Code
    document.addEventListener("click", function(e) {
        if (e.target.closest(".cart-checkout-btn")) {
            if (!window.cartItems || window.cartItems.length === 0) {
                alert("Aapka bag khali hai!");
                return;
            }
            localStorage.setItem("fimpsCart", JSON.stringify(window.cartItems));
            window.location.href = "maincheckout.html";
        }
    });
    document.addEventListener("DOMContentLoaded", function () {
    const newsletterForm = document.getElementById('newsletterForm');
    const successModalOverlay = document.getElementById('successModalOverlay');
    const successModalClose = document.getElementById('successModalClose');
    const modalMessageText = document.getElementById('modalMessageText');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            if (emailInput && emailInput.value.trim() !== '') {
                modalMessageText.innerText = "Thank you for joining our newsletter!";
                successModalOverlay.classList.add('active');
                newsletterForm.reset();
            }
        });
    }

    if (successModalClose) {
        successModalClose.addEventListener('click', function() {
            successModalOverlay.classList.remove('active');
        });
    }

    if (successModalOverlay) {
        successModalOverlay.addEventListener('click', function(e) {
            if (e.target === successModalOverlay) {
                successModalOverlay.classList.remove('active');
            }
        });
    }
});
 