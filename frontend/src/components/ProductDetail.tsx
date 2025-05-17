// src/components/ProductDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

import backgroundImage from '../assets/images/Page2.jpg';

// 定义产品详细信息数据接口（需与后端接口返回字段一致）
export interface ProductDetailData {
  id: number;
  'Food Name': string;
  Category?: string;
  'Edible Part'?: string;
  'Water Content'?: string | number;
  Energy?: string | number;
  Energy_kcal?: string | number;
  Protein?: string | number;
  Fat?: string | number;
  Cholesterol?: string | number;
  Ash?: string | number;
  Carbohydrates?: string | number;
  'Dietary Fiber'?: string | number;
  // ... 如果有更多字段，可以继续补充
}


const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 从 URL 路径中获取产品 ID

  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = 'https://newbackend-8mgs.onrender.com'; // 后端地址（请根据实际情况修改）

  useEffect(() => {
    if (!id) {
      setError("Product ID is missing from URL path.");
      setLoading(false);
      return;
    }

    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      setError("Invalid Product ID format in URL path.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setProduct(null);

    fetch(`${backendUrl}/api/products/${productId}/details`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: ProductDetailData) => {
        if (data && typeof data === 'object' && data['Food Name']) {
          setProduct(data);
        } else {
          console.error("Backend did not return a valid product object:", data);
          setError("Failed to load product details: Invalid data format from backend.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
        setError(`Failed to load product details: ${error.message}`);
        setLoading(false);
      });
  }, [id]);

  // 这里定义想展示字段的顺序
  const displayOrder = [
    'Food Name',
    'Category',
    'Edible Part',
    'Water Content',
    'Energy',
    'Energy_kcal',
    'Protein',
    'Fat',
    'Cholesterol',
    'Ash',
    'Carbohydrates',
    'Dietary Fiber',
  ];

  return (
    <div 
      className="product-detail-container" 
      style={{ 
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      {loading && <p className="loading">Loading product details...</p>}
      {error && <p className="error">{error}</p>}
      {product && (
        <div className="product-detail-content">
          <h2>{product['Food Name']}</h2>
          <div className="detail-table-wrapper">
            <table>
              <tbody>
                {displayOrder.map((key) => {
                  const value = product[key as keyof ProductDetailData];
                  if (value === undefined) return null; // 没有数据就跳过
                  return (
                    <tr key={key}>
                      <td className="detail-label">{key}</td>
                      <td className="detail-value">{String(value)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
