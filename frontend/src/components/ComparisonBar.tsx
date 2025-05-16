// src/components/ComparisonBar.tsx
import React from 'react';
import './ComparisonBar.css'; // 导入样式文件

interface ComparisonBarProps {
    selectedCount: number; // 已选中产品的数量
    onClear: () => void; // 清空选中产品的回调函数
    onCompare: () => void; // 点击对比按钮的回调函数
    isCompareEnabled: boolean; // 控制对比按钮是否可用 (至少选中2个)
    selectedProducts?: any[]; // 添加这个属性定义
    // 如果希望在槽位中显示已选中产品的名称，还需要传递一个包含选中产品信息的数组
    // selectedProductsInfo?: { id: number; 'Food Name': string }[]; // 示例
}

const ComparisonBar: React.FC<ComparisonBarProps> = ({
    selectedCount,
    onClear,
    onCompare,
    isCompareEnabled,
    selectedProducts = []
}) => {
    // 根据是否有选中的产品来决定是否添加 active 类
    const barClassName = `comparison-bar${selectedCount > 0 ? ' active' : ''}`;

    return (
        <div className={barClassName}>
            <div className="comparison-content-left">
                {selectedCount === 0 ? (
                    // --- 空槽位状态的布局 ---
                    <div className="comparison-slots-empty">
                        <div className="slot-title">Comparison Bar</div> {/* 标题 */}
                        <div className="slots-container"> {/* 容器包裹槽位和分隔线 */}
                            {/* 渲染 4 个带编号的空槽位 */}
                            {[...Array(4)].map((_, index) => (
                                <React.Fragment key={index}> {/* 使用 Fragment 包含槽位和分隔线 */}
                                    <div className="empty-slot">
                                        <div className="slot-number">{index + 1}</div> {/* 编号 */}
                                        {/* --- 修改这里的文本 --- */}
                                        <div className="slot-text">You can continue to add products</div>
                                    </div>
                                    {/* 添加槽位之间的分隔线 (除了最后一个槽位) */}
                                    {index < 3 && <div className="slot-separator"></div>} {/* 分隔线 */}
                                </React.Fragment>
                            ))}
                        </div>
                        {/* --- 删除外面的提示文字 div --- */}
                        {/* <div className="add-more-hint">You can continue to add products</div> */}
                    </div>
                ) : (
                     // --- 选中状态下的信息显示 (保持不变) ---
                    <div className="selection-info">
                        Selected&nbsp;<span>{selectedCount}</span>&nbsp;{selectedCount === 1 ? 'product' : 'products'} for comparison
                     </div>
                )}
            </div>

            {/* --- 右侧操作按钮区域：始终存在，但可用状态变化 --- */}
            <div className="actions">
                {/* 清空按钮 */}
                <button
                    className="clear-button"
                    onClick={onClear}
                    disabled={selectedCount === 0} // 没有选中时禁用清空按钮
                >
                    Clear Comparison
                </button>
                {/* 对比按钮 */}
                <button
                    className="compare-button"
                    onClick={onCompare}
                    disabled={!isCompareEnabled} // 根据 isCompareEnabled 属性禁用按钮
                >
                    Compare ({selectedCount})
                </button>
            </div>
        </div>
    );
};

export default ComparisonBar;