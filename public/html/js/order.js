document.addEventListener('DOMContentLoaded', () => {
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const creditCardDetails = document.getElementById('credit-card-details');
    const paypalDetails = document.getElementById('paypal-details');

    paymentMethodSelect.addEventListener('change', () => {
        const selectedPaymentMethod = paymentMethodSelect.value;

        if (selectedPaymentMethod === 'credit-card') {
            creditCardDetails.style.display = 'block';
            paypalDetails.style.display = 'none';
        } else if (selectedPaymentMethod === 'paypal') {
            creditCardDetails.style.display = 'none';
            paypalDetails.style.display = 'block';
        }
    });

    // Handle form submission
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const orderData = {
            fullName: document.getElementById('fullName').value,
            address1: document.getElementById('address1').value,
            address2: document.getElementById('address2').value,
            city: document.getElementById('city').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value,
            phone: document.getElementById('phone').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            orderItems: JSON.parse(localStorage.getItem('cart')) || [], // assuming cart items are stored in localStorage
        };

        if (orderData.paymentMethod === 'credit-card') {
            orderData.cardNumber = document.getElementById('cardNumber').value;
            orderData.expiryDate = document.getElementById('expiryDate').value;
            orderData.cvv = document.getElementById('cvv').value;
        }

        console.log(orderData);

        // Send orderData to the backend via a POST request
        fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Order placed successfully!');
                localStorage.removeItem('cart'); // Clear cart after successful order
                window.location.href = '/order-confirmation'; // Redirect to an order confirmation page
            } else {
                alert('Failed to place order. Please try again.');
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
