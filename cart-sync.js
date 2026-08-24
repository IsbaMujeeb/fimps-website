// Centralized FIMPS LocalStorage Synchronizer

// function syncFimpsHeader() {
//     try {
//         const savedCart = JSON.parse(localStorage.getItem('fimps_cart')) || [];
//         const savedWishlist = JSON.parse(localStorage.getItem('fimps_wishlist')) || [];

//         const cartBadge = document.querySelector('.cart-badge');
//         const wishlistBadge = document.querySelector('.wishlist-badge');

//         if (cartBadge) {
//             const totalQty = savedCart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
//             cartBadge.textContent = totalQty;
//         }

//         if (wishlistBadge) {
//             wishlistBadge.textContent = savedWishlist.length;
//         }
//     } catch (e) {
//         console.error("Storage Sync Error:", e);
//     }
// }

// document.addEventListener("DOMContentLoaded", function () {
//     syncFimpsHeader();
// });

// window.addEventListener("storage", function () {
//     syncFimpsHeader();
// });