import ProductList from './ProductList';  // import ProductList 

import './App.css';  // 保留原本的样式引入

function App() {
  return (
    <div>
      <h1>Web Application for Nutritional Analysis of Fish Products</h1>
      <ProductList />  {/* 使用 ProductList 组件 */}
    </div>
  );
}

export default App;
