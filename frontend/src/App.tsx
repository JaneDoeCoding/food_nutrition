// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail'; // 确保 ProductDetail 已导入
// --- 导入 ComparisonView 组件 ---
import ComparisonView from './components/ComparisonView';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 列表页路由 */}
        <Route path="/" element={<ProductList />} />

        {/* 单个产品详情页路由 */}
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* --- 添加产品对比页路由 --- */}
        {/* path 设置为 /compare，并将 ComparisonView 组件关联到这个路由 */}
        {/* 我们通过查询参数传递 ID，所以路由本身不需要参数，但在 ComparisonView 里会读取 location.search */}
        <Route path="/compare" element={<ComparisonView />} />

        {/* 可以添加一个 404 页面 */}
        {/* <Route path="*" element={<div>404 Not Found</div>} /> */}

      </Routes>
    </Router>
  );
};

export default App;