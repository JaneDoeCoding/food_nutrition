// src/index.tsx (示例)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 如果你有全局样式

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App /> {/* 渲染 App 组件 */}
    </React.StrictMode>
  );
}