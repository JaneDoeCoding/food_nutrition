// src/components/ProductDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

// 定义产品详细信息数据接口（需与后端接口返回字段一致）
interface ProductDetailData {
  id: number;
  'Food Name': string;
  // ... 可添加更多字段 ...
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 从 URL 路径中获取产品 ID

  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = 'http://192.168.11.229:5000'; // 后端地址（请根据实际情况修改）

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

  // 渲染单个字段的行
  const renderDetailRow = (label: string, value?: string) => (
    <div className="detail-row" key={label}>
      <span className="detail-label">{label}:</span>
      <span className="detail-value">{value ?? 'N/A'}</span>
    </div>
  );

  // 渲染内容
  return (
    <div className="product-detail">
      {loading && <p>Loading product details...</p>}
      {error && <p className="error">{error}</p>}
      {product && (
        <>
          <h2>{product['Food Name']}</h2>
          {Object.entries(product).map(([key, value]) =>
            renderDetailRow(key, String(value))
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetail;
