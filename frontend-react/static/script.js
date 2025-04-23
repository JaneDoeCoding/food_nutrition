document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('product-list');

  // Display loading message
  const loading = document.createElement('p');
  loading.textContent = 'Loading...';
  container.appendChild(loading);

  // Fetch product data from the API
  fetch('/api/products')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Clear loading message
      container.innerHTML = '';

      // Create and display a card for each product
      data.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <h2>${product.name}</h2>
          <p><strong>Category:</strong> ${product.category}</p>
          <p>${product.description}</p>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      // Display error message if fetching fails
      container.innerHTML = '';
      const errorMsg = document.createElement('p');
      errorMsg.style.color = 'red';
      errorMsg.textContent = '❌ Failed to load products. Please try again later.';
      container.appendChild(errorMsg);
      console.error('Error fetching products:', error);
    });
});
