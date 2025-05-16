// src/components/ComparisonView.tsx

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ComparisonView.css';
import Page2Image from '../assets/images/Page3.jpg';

// ... (ProductDetailData 接口定义保持不变) ...

const ComparisonView: React.FC = () => {
    const location = useLocation();
    const [comparedProducts, setComparedProducts] = useState<ProductDetailData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const backendUrl = 'https://newbackend-8mgs.onrender.com';

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const idsStrings = searchParams.getAll('ids');

        if (idsStrings.length === 0) {
            return;
        }
        const productIds = idsStrings.map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
        console.log("Product IDs parsed from URL:", productIds);

        if (productIds.length === 0) {
            return;
        }

        setLoading(true);
        setError(null);
        setComparedProducts([]);

        fetch(`${backendUrl}/api/products/compare`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: productIds }),
        })
        .then((response) => response.json())
        .then((data: ProductDetailData[]) => {
            console.log("Received data from backend:", data);
            console.log("Is received data an array?", Array.isArray(data));
            console.log("Number of items in received data:", data.length);

            if (Array.isArray(data)) {
                if (data.length > 0 && data.length !== productIds.length) {
                    console.warn(`Requested ${productIds.length} products (IDs: ${productIds.join(',')}), but backend returned data for ${data.length}. Check if all requested IDs exist in backend data.`);
                }
                setComparedProducts(data);
            } else {
                // 数据格式错误的处理
            }
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching comparison data:', error);
            setError(`Failed to load comparison data: ${error.message}`);
            setLoading(false);
            setComparedProducts([]);
        });
    }, [location.search]);

    if (loading) {
        return null;
    }
    if (error) {
        return null;
    }

    if (comparedProducts.length === 0) {
        const searchParams = new URLSearchParams(location.search);
        const idsString = searchParams.get('ids');
        const productIdsFromUrl = idsString ? idsString.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id)) : [];

        if(productIdsFromUrl.length > 0) {
            console.log("ComparedProducts is empty despite IDs in URL.");
            return <div className="no-comparison-data">Could not load data for the selected products (IDs: {productIdsFromUrl.join(',')}). Please check if these IDs exist.</div>;
        } else {
            console.log("ComparedProducts is empty, and no valid IDs in URL.");
            return <div className="no-comparison-data">No products selected for comparison.</div>;
        }
    }

    // --- 这里添加 console.log ---
    console.log("ComparisonView is rendering table...");
    console.log("Current comparedProducts state (during render):", comparedProducts);
    console.log("comparedProducts is array (during render)?", Array.isArray(comparedProducts));
    console.log("comparedProducts length (during render):", comparedProducts.length);

    const firstProduct = comparedProducts[0];

    const detailFields: (keyof ProductDetailData)[] = [
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
        'Alias',
    ];
    const fieldsToDisplay = detailFields.filter(field => firstProduct.hasOwnProperty(field));

    console.log("Fields to display (during render):", fieldsToDisplay);
    console.log("Fields to display length (during render):", fieldsToDisplay.length);

    return (
        <div
            className="comparison-view-container"
            style={{
            backgroundImage: `url(${Page2Image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            padding: '2rem', // 可选：让内容不要贴边
            }}
        >
            <h2>Product Comparison</h2>

            <div className="comparison-table-wrapper">
            <table>
                <thead>
                <tr>
                    <th>Nutrient/Item</th>
                    {comparedProducts.map(product => (
                    <th key={product.id}>{product['Food Name']}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {fieldsToDisplay.map(field => (
                    <tr key={field as string}>
                    <td>{field}</td>
                    {comparedProducts.map(product => (
                        <td key={product.id}>
                        {(product[field] !== undefined &&
                            product[field] !== null &&
                            product[field] !== '')
                            ? (product[field] as React.ReactNode)
                            : 'N/A'}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        );
};

export default ComparisonView;
