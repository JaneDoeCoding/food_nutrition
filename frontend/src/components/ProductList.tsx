// src/components/ProductList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';

interface Product {
  id: string | number;
  'Food Name': string;
  'Edible Part'?: string;
  'Water Content'?: string;
  'Energy'?: string;
}

interface ProductListProps {
  products: Product[];
  selectedIds: (string | number)[];
  onToggleSelect: (productId: string | number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, selectedIds, onToggleSelect }) => {
  const navigate = useNavigate();

  const handleItemClick = (productId: string | number) => {
    if (productId !== undefined && productId !== null) {
      navigate(`/products/${productId}`);
    } else {
      console.warn("Invalid product ID:", productId);
    }
  };

  const isProductSelected = (productId: string | number) => {
    return selectedIds.includes(productId);
  };

  const handleCheckboxChange = (productId: string | number) => {
    onToggleSelect(productId);
  };

  const isCheckboxDisabled = (productId: string | number) => {
    const maxSelection = 4;
    return selectedIds.length >= maxSelection && !selectedIds.includes(productId);
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="product-list-container">
      <div className="product-table-wrapper">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Food Name</th>
              <th className="px-4 py-2 border-b">Edible</th>
              <th className="px-4 py-2 border-b">Water</th>
              <th className="px-4 py-2 border-b">Energy</th>
              <th className="px-4 py-2 border-b text-center">Add to Comparison</th> {/* ✅ 最右侧 */}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} onClick={() => handleItemClick(product.id)}>
                <td className="px-4 py-2 border-b">{product['Food Name'] || 'N/A'}</td>
                <td className="px-4 py-2 border-b">{product['Edible Part'] || 'N/A'}</td>
                <td className="px-4 py-2 border-b">{product['Water Content'] || 'N/A'}</td>
                <td className="px-4 py-2 border-b">{product['Energy'] || 'N/A'}</td>
                {/* ✅ 复选框移到最后，阻止冒泡点击 */}
                <td
                  className="px-4 py-2 border-b text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isProductSelected(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                    disabled={isCheckboxDisabled(product.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
