document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById('product-list');
    
    // Fetch recent products from the API
    fetch('http://localhost:3000/api/v1/products/get/isRecent/5') // Adjust the count as needed
        .then(response => response.json())
        .then(products => {
            // Check if products were returned successfully
            if (products && products.length > 0) {
                products.forEach(product => {
                    // Create a container div for each product
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product';

                    // Create an image element
                    const productImg = document.createElement('img');
                    productImg.src = `./public/${product.image}`;
                    productImg.alt = product.name;
                    productImg.className = 'product-image';

                    // Create a product name element
                    const productName = document.createElement('h3');
                    productName.textContent = product.name;

                    // Append image and name to the product div
                    productDiv.appendChild(productImg);
                    productDiv.appendChild(productName);

                    // Append product div to the product list
                    productList.appendChild(productDiv);
                });
            } else {
                productList.textContent = 'No recent products found.';
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            productList.textContent = 'Failed to load products.';
        });
});
