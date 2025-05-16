// src/App.tsx
import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetail from './components/ProductDetail';
import ComparisonView from './components/ComparisonView';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 根路由渲染首页 */}
        <Route path="/" element={<HomePage />} />

        {/* 产品详情页 */}
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* 产品对比页 */}
        <Route path="/compare" element={<ComparisonView />} />
      </Routes>
    </Router>
  );
};

export default App;
