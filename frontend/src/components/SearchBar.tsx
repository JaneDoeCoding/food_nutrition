// src/components/SearchBar.tsx
import React, { useState } from 'react';
import './SearchBar.css'; // 导入您的 CSS 文件

// 定义组件的 props 类型
interface SearchBarProps {
  onSearch: (searchTerm: string) => void; // onSearch 是一个函数，接收一个字符串参数
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  // 使用 state 来跟踪输入框的值
  const [searchTerm, setSearchTerm] = useState('');

  // 处理输入框内容变化的函数
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 处理搜索按钮点击或表单提交的函数
  const handleSearchClick = (event: React.FormEvent) => {
    event.preventDefault(); // 阻止表单默认提交行为（页面刷新）
    if (searchTerm.trim()) { // 检查搜索词不为空白
      onSearch(searchTerm); // 调用从父组件传递下来的 onSearch 函数，并传递搜索词
    }
  };

  return (
    // 可以使用 form 元素包裹，这样用户按回车键也能触发搜索
    <form onSubmit={handleSearchClick}>
      <input
        type="text"
        placeholder="Enter fish name (e.g., Tuna, Cod)"
        value={searchTerm} // 将输入框的值与 state 绑定
        onChange={handleInputChange} // 监听输入框的变化
      />
      <button type="submit">Search</button> {/* 使用 type="submit" */}
    </form>
  );
};

export default SearchBar;