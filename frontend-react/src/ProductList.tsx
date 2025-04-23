import React, { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  protein: string;
  fat: string;
  carbs: string;
  calories: string;
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')  // 后端 Flask API 地址
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  return (
    <div>
      <h2>Fish Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Category: {product.category}</p>
            <p>Protein: {product.protein}</p>
            <p>Fat: {product.fat}</p>
            <p>Carbs: {product.carbs}</p>
            <p>Calories: {product.calories}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
