document.getElementById('add-product-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission

    const formData = new FormData();

    // Collect form data
    formData.append('name', document.getElementById('name').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('richDescription', document.getElementById('richDescription').value || '');
    formData.append('brand', document.getElementById('brand').value || '');
    formData.append('price', document.getElementById('price').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('countInStock', document.getElementById('countInStock').value);
    formData.append('rating', document.getElementById('rating').value || 0);
    formData.append('numReviews', document.getElementById('numReviews').value || 0);
    formData.append('isFeatured', document.getElementById('isFeatured').checked);
    formData.append('isRecent', document.getElementById('isRecent').checked);
    formData.append('image', document.getElementById('image').files[0]); // Main product image

    // Append additional images
    const additionalImages = document.getElementById('images').files;
    for (let i = 0; i < additionalImages.length; i++) {
        formData.append('images', additionalImages[i]); // Appending each image to 'images'
    }

    try {
        const response = await fetch('http://localhost:3000/api/v1/products', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert('Product added successfully!');
            document.getElementById('add-product-form').reset(); // Reset the form
        } else {
            alert(`Failed to add product: ${result.message}`);
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('An error occurred while adding the product.');
    }
});
