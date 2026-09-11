/* ========================================
   Stackly Pharmacy - Cart page
   Renders the shared cart (localStorage), handles
   quantity, remove, clear, totals and empty state.
   ======================================== */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var store = window.StacklyCart;
        if (!store) { return; }

        var container = document.getElementById('cartItemsContainer');
        var filled = document.getElementById('cartFilledSection');
        var emptyEl = document.getElementById('cartEmptySection');
        var countEl = document.getElementById('cartCount');
        var countLabelEl = document.getElementById('cartCountLabel');
        var subtotalEl = document.getElementById('cartSubtotal');
        var discountEl = document.getElementById('cartDiscount');
        var totalEl = document.getElementById('cartTotal');

        function money(n) {
            return '$' + n.toFixed(2);
        }

        function showFilled(show) {
            if (filled) { filled.classList.toggle('d-none', !show); }
            if (emptyEl) { emptyEl.classList.toggle('d-none', show); }
        }

        function makeRow(item) {
            var row = document.createElement('div');
            row.className = 'cart-item-dash';
            row.innerHTML =
                '<span class="t-thumb"><img src="' + item.image + '" alt="' + item.name + '"></span>' +
                '<div class="cart-main">' +
                    '<h5>' + item.name + '</h5>' +
                    '<p>' + money(item.price) + ' each</p>' +
                '</div>' +
                '<div class="qty-control">' +
                    '<button type="button" data-qty="minus" aria-label="Decrease quantity"><i class="bi bi-dash"></i></button>' +
                    '<span class="qty-val">' + item.qty + '</span>' +
                    '<button type="button" data-qty="plus" aria-label="Increase quantity"><i class="bi bi-plus"></i></button>' +
                '</div>' +
                '<span class="cart-price"></span>' +
                '<button type="button" class="btn-row danger cart-remove" aria-label="Remove item"><i class="bi bi-trash"></i></button>';
            return row;
        }

        function setTotals(cart) {
            var subtotal = 0;
            var quantity = 0;
            cart.forEach(function (item) {
                subtotal += item.price * item.qty;
                quantity += item.qty;
            });
            var discount = subtotal > 0 ? subtotal * 0.3 : 0;
            var total = subtotal - discount;
            if (subtotalEl) { subtotalEl.textContent = money(subtotal); }
            if (discountEl) { discountEl.textContent = '-' + money(discount); }
            if (totalEl) { totalEl.textContent = money(total); }
            if (countEl) { countEl.textContent = String(quantity); }
            if (countLabelEl) { countLabelEl.textContent = quantity + (quantity === 1 ? ' product' : ' products'); }
        }

        function refresh() {
            var cart = store.get();
            if (!container) { return; }
            container.innerHTML = '';

            if (cart.length === 0) {
                showFilled(false);
                setTotals([]);
                store.updateBadge();
                return;
            }

            showFilled(true);
            var rowsEl = [];
            cart.forEach(function (item) {
                var row = makeRow(item);
                rowsEl.push(row);
                container.appendChild(row);

                var val = row.querySelector('.qty-val');
                row.querySelectorAll('[data-qty]').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var v = parseInt(val.textContent, 10) || 1;
                        v = btn.getAttribute('data-qty') === 'minus' ? Math.max(1, v - 1) : v + 1;
                        val.textContent = v;
                        item.qty = v;
                        store.save(cart);
                        row.querySelector('.cart-price').textContent = money(item.price * item.qty);
                        setTotals(cart);
                        store.updateBadge();
                    });
                });

                row.querySelector('.cart-remove').addEventListener('click', function () {
                    var idx = cart.indexOf(item);
                    if (idx > -1) { cart.splice(idx, 1); store.save(cart); }
                    refresh();
                });
            });

            rowsEl.forEach(function (row, i) {
                row.querySelector('.cart-price').textContent = money(cart[i].price * cart[i].qty);
            });
            setTotals(cart);
            store.updateBadge();
        }

        /* Clear cart */
        var clearBtn = document.getElementById('clearCartBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                store.save([]);
                refresh();
            });
        }

        refresh();
    });
})();