// Assuming you have an array of cart items stored in the session or localStorage
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    let subtotal = 0;

    cartItems.forEach((item, index) => {
        const productTotal = item.quantity * item.price;
        subtotal += productTotal;

        cartItemsContainer.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input">
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>${productTotal.toFixed(2)}</td>
                <td><button class="remove-btn" data-index="${index}">Remove</button></td>
            </tr>
        `;
    });

    const tax = subtotal * 0.1; // Assume a 10% tax rate
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);

    addEventListeners();
}

function addEventListeners() {
    // Update quantity
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = e.target.dataset.index;
            const newQuantity = e.target.value;
            cartItems[index].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cartItems));
            renderCart();
        });
    });

    // Remove item
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            cartItems.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            renderCart();
        });
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        // Handle checkout process (e.g., redirect to checkout page)
        alert('Proceed to Checkout');
    });
}

// Initial render
renderCart();
