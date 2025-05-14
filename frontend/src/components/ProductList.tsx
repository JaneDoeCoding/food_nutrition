// ProductList.tsx
import { useEffect, useState } from 'react';
// --- 导入 useNavigate hook ---
import { useNavigate } from 'react-router-dom';
import './ProductList.css'; // 引入样式文件
// --- 导入 ComparisonBar 组件 ---
// 请确保您已经创建了 ComparisonBar.tsx 文件
import ComparisonBar from './ComparisonBar';


// !!! IMPORTANT: Data Interface - MUST match the keys returned by the backend /api/products endpoint !!!
// 后端 /api/products 接口返回的简略数据结构
interface ProductSummary {
  id: number; // 内部标识符 (前端内部使用，不直接展示)
  'Food Name': string; // 食物名称 (英文) - 键名与后端一致
  'Edible Part': string; // 食部 - 键名与后端一致
  'Water Content': string; // 水分 - 键名与后端一致
  'Energy': string; // 能量 (kJ或kcal) - 键名与后端一致
  // 注意：这里只包含简略列表接口返回的字段
}

const ProductList: React.FC = () => {
  // --- 2. 在组件内部调用 useNavigate hook 获取导航函数 ---
  const navigate = useNavigate();

  // 使用 ProductSummary 接口来定义 products state 的类型
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // 添加错误状态

  // --- 对比栏功能: 状态管理以追踪选中的对比项目 ---
  // 使用 ProductSummary 接口的 id
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);


  // 数据获取：从 Flask 后端 API 获取产品简略列表
  useEffect(() => {
    // !!! Use your actual backend URL here !!!
    const backendUrl = 'http://172.16.10.246:5000'; // 替换为你的后端实际地址

    fetch(`${backendUrl}/api/products`) // 调用获取简略列表的 API 接口
      .then((response) => {
        if (!response.ok) {
          // 如果响应状态码不是 2xx，抛出错误
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // 解析 JSON 响应体
      })
      .then((data: ProductSummary[]) => { // 使用 ProductSummary 接口类型
        // 检查返回的数据是否是数组
        if (Array.isArray(data)) {
           setProducts(data); // 更新产品列表状态
        } else {
           // 如果返回的不是数组，可能是错误信息，处理一下
           console.error("Backend did not return an array:", data);
           setError("Failed to load products: Invalid data format from backend.");
           setProducts([]); // 清空列表
        }
        setLoading(false); // 停止加载状态
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError(`Failed to load products: ${error.message}`); // 设置错误信息
        setLoading(false); // 停止加载状态
        setProducts([]); // 清空列表
      });

    // 注意：依赖项数组为空 [], 表示这个 effect 只在组件挂载时运行一次
  }, []);


  // --- 3. 修改 handleItemClick 函数，使用 navigate 进行跳转 (这部分已包含在完整代码中) ---
  // 处理列表项点击事件（用于跳转到详情页）
  const handleItemClick = (productSummary: ProductSummary) => {
    console.log(`Clicked on product: ${productSummary['Food Name']} with ID: ${productSummary.id}`);
    // 使用 navigate 函数跳转到详情页路由
    navigate(`/products/${productSummary.id}`);
  };

  // --- 对比栏功能: 处理复选框选中/取消选中事件（用于对比功能） ---
  // (这部分已包含在完整代码中，包含数量限制逻辑)
  const handleCheckboxChange = (productId: number, isChecked: boolean) => {
    console.log(`Product ID ${productId} is checked: ${isChecked}`);
    setSelectedProductIds(prevSelectedIds => {
        if (isChecked) {
            // 选中时，如果未选中且数量小于4，则添加
            if (!prevSelectedIds.includes(productId) && prevSelectedIds.length < 4) {
                return [...prevSelectedIds, productId];
            }
        } else {
            // 取消选中时，从列表中移除
            return prevSelectedIds.filter(id => id !== productId);
        }
        // 如果数量已满或重复选中/取消，返回原状态
        return prevSelectedIds;
    });
  };

   // --- 对比栏功能: 根据选中状态判断复选框是否应该被勾选 ---
   // (这部分已包含在完整代码中)
   const isProductSelected = (productId: number) => {
       return selectedProductIds.includes(productId);
   };

  // --- 对比栏功能: 实现清空对比栏的回调函数 ---
  // (这部分是新增的函数)
  const handleClearComparison = () => {
      setSelectedProductIds([]); // 清空选中的产品 ID 列表
      console.log("Comparison bar cleared.");
  };

  // --- 对比栏功能: 实现点击对比按钮的回调函数 ---
  // (这部分是新增的函数)
  // --- 对比栏功能: 实现点击对比按钮的回调函数 ---
  const handleCompareProducts = () => {
      // 检查选中数量是否符合对比要求 (2-4个)
      if (selectedProductIds.length >= 2 && selectedProductIds.length <= 4) {
          const queryString = selectedProductIds.map(id => `ids=${id}`).join('&');
          navigate(`/compare?${queryString}`);
      } else {
          console.warn("Please select 2 to 4 products for comparison.");
          // 你也可以添加 UI 提示，例如 alert 或 toast
      }
  };


   // --- 对比栏功能: 判断对比按钮是否可用 (至少选中 2 个) ---
   // (这部分是新增的变量)
   const isCompareButtonEnabled = selectedProductIds.length >= 2;


  // ... (loading, error, no products 状态判断和返回 JSX 保持不变) ...
   if (loading) { /* ... */ }
   if (error) { /* ... */ }
   if (products.length === 0) { /* ... */ }


  return (
    <div className="product-list-container">
      {/* TODO: 在这里添加搜索框组件 */}
      {/* <SearchBar onSearch={handleSearch} /> */}

      {/* 产品列表区域 (表格部分保持不变) */}
      <h2>Fish Products Nutritional Information</h2> {/* 可以修改或移除此标题 */}

      <div className="product-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Edible</th>
              <th>Water</th>
              <th>Energy</th>
              <th>Add to Comparison</th>
            </tr>
          </thead>
          <tbody>
            {/* 遍历 products 状态中的数据 */}
            {products.map((product) => (
              // Ensure product.id exists and is unique
              // 使整行可点击，传递 product 对象或其 id
              <tr key={product.id} onClick={() => handleItemClick(product)}>
                {/* 使用后端返回的新的键名访问数据 */}
                <td>{product['Food Name']}</td>
                <td>{product['Edible Part'] || 'N/A'}</td>
                <td>{product['Water Content'] || 'N/A'}</td>
                <td>{product['Energy'] || 'N/A'}</td>
                <td onClick={(e) => e.stopPropagation()}> {/* 阻止点击复选框时触发行点击事件 */}
                  <input
                    type="checkbox"
                    checked={isProductSelected(product.id)} // 控制复选框的选中状态
                    onChange={(e) => handleCheckboxChange(product.id, e.target.checked)}
                    disabled={selectedProductIds.length >= 4 && !selectedProductIds.includes(product.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- 对比栏功能: 在这里渲染底部的对比栏组件 --- */}
      {/* 请确保这里没有外部的条件判断包裹，例如 { someCondition ? (...) : null } */}
      <ComparisonBar
          selectedCount={selectedProductIds.length} // 传递选中数量
          onClear={handleClearComparison} // 传递清空函数
          onCompare={handleCompareProducts} // 传递对比函数
          isCompareEnabled={isCompareButtonEnabled} // 传递按钮可用状态
      />

      {/* 移除之前用于简易显示选中数量的 div，由 ComparisonBar 接管显示 */}
      {/* <div style={{marginTop: '20px', textAlign: 'center'}}>
           已选中 {selectedProductIds.length} 个产品进行对比 (最少2个，最多4个)
       </div> */}

    {/* product-list-container 结束 */}
</div>

  );
};

export default ProductList;