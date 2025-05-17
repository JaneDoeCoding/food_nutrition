// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import ProductList from '../components/ProductList';
import ComparisonBar from '../components/ComparisonBar'; // 确保 ComparisonBar 已导入
import { useNavigate } from 'react-router-dom'; // 用于跳转到对比页
import './HomePage.css';
import HomepageImage from '../assets/images/Homepage.jpg';


// 定义产品对象的类型（确保与后端 /api/products 接口返回的简略数据结构匹配）
// 根据您的 routes.py 代码，简略接口返回的键有 'id', 'Food Name', 'Edible Part', 'Water Content', 'Energy'
interface Product {
  id: string | number; // 产品 ID (后端返回的唯一标识)
  'Food Name': string; // 注意这里的键名与后端完全一致
  'Edible Part'?: string; // 可选
  'Water Content'?: string; // 可选
  'Energy'?: string; // 可选
  // 其他简略接口可能返回的字段...
  // 为了在 ComparisonBar 或 ComparisonView 中显示更多信息，最好在这里包含所有可能需要的字段
  // 或者在需要时（如点击对比按钮后）根据 id 再次从后端获取详细数据
  // 暂时先包含简略列表返回的字段
}


const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Array<string | number>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');


  // 处理搜索逻辑
  const handleSearch = async (searchTerm: string) => {
    setCurrentSearchTerm(searchTerm); // 记录当前搜索词

    if (!searchTerm.trim()) {
      // 如果搜索词为空白，清空结果和错误
      setSearchResults([]);
      setError(null);
       // TODO: 如果希望搜索词为空时显示全部列表，可以在这里调用不带 query 参数的 /api/products
      // await fetchAllProducts(); // 假设您有一个fetchAllProducts函数
      return;
    }

    console.log("正在搜索:", searchTerm);
    setLoading(true); // 开始搜索时设置加载状态
    setError(null); // 清空之前的错误

    const backendUrl = 'https://newbackend-8mgs.onrender.com'; // 请再次确认这是您正确的后端地址
    const endpoint = '/api/products'; // <-- 正确的搜索接口路径
    // 参数名是 'query'
    const queryParam = `query=${encodeURIComponent(searchTerm)}`; // <-- 正确的参数名和构建方式

    const requestUrl = `${backendUrl}${endpoint}?${queryParam}`; // 完整的请求 URL

    try {
      const response = await fetch(requestUrl);

      if (response.status === 404) {
         // 后端返回 404 表示没有找到产品
         console.log("搜索完成，但没有找到产品（404）。");
         setSearchResults([]); // 清空结果列表
         setError(null); // 404 不是一个需要显示给用户的"错误"，而是"无结果"
         return; // 处理完 404 就返回
      }

      if (!response.ok) {
         // 对于其他非 2xx 状态码（如 5xx 服务器错误），抛出错误
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 尝试解析 JSON 响应
      const data: Product[] | { message: string } = await response.json();

       if (Array.isArray(data)) {
            setSearchResults(data); // 更新搜索结果状态
            console.log("搜索结果:", data);
            setError(null); // 搜索成功，清空错误信息
       } else if (data && typeof data === 'object' && 'message' in data) {
            // 如果后端返回了 { message: '...' }，虽然是 200，但我们可能认为这是无结果或其他信息
            console.log("搜索完成，后端返回消息:", data.message);
            setSearchResults([]); // 清空结果列表
            setError(null); // 清空错误信息
       }
       else {
            console.error("后端返回了未知格式的数据:", data);
            setError("加载产品失败: 后端数据格式错误。");
            setSearchResults([]); // 清空列表
       }

    } catch (e) {
      console.error("搜索请求失败:", e);
      setError(`搜索失败，请稍后再试。错误详情: ${e instanceof Error ? e.message : String(e)}`);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

   // 在组件挂载时加载全部产品（如果希望初始页面显示全部列表）
   // 注意：如果您希望初始不显示列表，并且在搜索框为空时也不显示列表，可以删除这个 useEffect
   // 如果希望在搜索框为空时显示全部列表，可以在 handleSearch 的 if (!searchTerm.trim()) {} 块中调用 fetchAllProducts
   useEffect(() => {
       const fetchAllProducts = async () => {
            setLoading(true);
            setError(null);
            const backendUrl = 'https://newbackend-8mgs.onrender.com'; // 请确认后端地址
            const endpoint = '/api/products';

            try {
                  const response = await fetch(`${backendUrl}${endpoint}`);
                   if (!response.ok) {
                       throw new Error(`HTTP error! status: ${response.status}`);
                   }
                   const data: Product[] | { message: string } = await response.json();
                   if (Array.isArray(data)) {
                       setSearchResults(data);
                       setError(null);
                   } else {
                       console.error("Backend did not return an array for all products:", data);
                       setError("Failed to load all products: Invalid data format.");
                       setSearchResults([]);
                   }
             } catch (e) {
                 console.error("Failed to fetch all products:", e);
                 setError(`Failed to load products: ${e instanceof Error ? e.message : String(e)}`);
                 setSearchResults([]);
             } finally {
                 setLoading(false);
             }
       };

       // 如果希望组件加载时就获取全部产品，取消下面这行的注释
       // fetchAllProducts();

   }, []);


  // 添加或移除选中的产品 ID
  const handleToggleProductSelected = (id: string | number) => {
    setSelectedProductIds((prevSelected) => {
        const isSelected = prevSelected.includes(id);
        const newSelected = isSelected
            ? prevSelected.filter((pid) => pid !== id)
            : [...prevSelected, id];

        // TODO: 这里可以添加最大选择数量的限制逻辑，例如最多4个
        // if (!isSelected && prevSelected.length >= 4) {
        //     console.warn("最多只能选择4个产品进行对比。");
        //     return prevSelected;
        // }

        return newSelected;
    });
  };

  // 清空选择
  const handleClearComparison = () => {
    setSelectedProductIds([]);
    console.log("Comparison bar cleared.");
  };

  // 点击对比按钮后的处理（跳转页面）
  const handleCompareProducts = () => {
     if (selectedProductIds.length >= 2 && selectedProductIds.length <= 4) {
         const queryString = selectedProductIds.map(id => `ids=${id}`).join('&');
         navigate(`/compare?${queryString}`);
     } else {
         console.warn("Please select 2 to 4 products for comparison.");
         alert("请选择 2 到 4 个产品进行对比。");
     }
  };

   // 判断对比按钮是否可用 (至少选中 2 个产品)
  const isCompareButtonEnabled = selectedProductIds.length >= 2;
   // 判断复选框是否应该被禁用 (选中数量达到上限，且当前产品未选中)
   const isCheckboxDisabled = (productId: string | number) => {
        return selectedProductIds.length >= 4 && !selectedProductIds.includes(productId);
   };

    return (
      <div
        className="home-container"
        style={{ backgroundImage: `url(${HomepageImage})` }}
      >
        <div className="home-overlay">
          <div className="home-header">
            <h1 className="home-title">Fish Nutrition Information Platform</h1>
            <p className="home-subtitle">
              Check the fish, eat what you wish
            </p>
          </div>
          
          <div className="search-container">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="results-container">
            {loading && <div className="loading-message">Loading, thank you for your patience...</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && searchResults.length > 0 && (
              <ProductList
                products={searchResults}
                selectedIds={selectedProductIds}
                onToggleSelect={handleToggleProductSelected}
              />
            )}

            {!loading && !error && searchResults.length === 0 && currentSearchTerm.trim() && (
              <div className="no-results-message">No matching products found. You can try fish like Salmon, Mackerel, Halibut, etc.</div>
            )}
            {!loading && !error && searchResults.length === 0 && !currentSearchTerm.trim() && (
              <></>
            )}
          </div>

          {searchResults.length > 0 && ( 
            <ComparisonBar
              selectedProducts={searchResults.filter(product => selectedProductIds.includes(product.id))}
              selectedCount={selectedProductIds.length}
              onClear={handleClearComparison}
              onCompare={handleCompareProducts}
              isCompareEnabled={isCompareButtonEnabled}
            />
          )}
        </div>
      </div>
    );
  };

export default HomePage;