# routes.py
from flask import Blueprint, request, jsonify, render_template
from flasgger import Swagger # 如果在app.py里初始化了Swagger，这里不需要再次导入
from typing import List, Dict, Any # 导入类型提示

routes = Blueprint('routes', __name__)

# --- 1. 更新产品数据存储结构 (修改键名) ---
# 产品详细数据存储在内存中（实际项目请用数据库）
# 删除了 name_cn, name_en 改为 Food Name, 其他键首字母大写并调整
products_detailed: List[Dict[str, Any]] = [
    {
        'id': 1, # 唯一的内部标识符 (不向前端用户展示)
        'Food Name': 'Salmon', # 英文名称 (根据截图“鱼类名称”中的英文)
        'Category': 'Fish', # 分类 (示例，根据实际情况填充)
        'Edible Part': '65%', # 食部 (示例，如果数据源有请填充)
        'Water Content': '64g', # 水分 (根据截图数据)
        'Energy_kcal': '206 kcal', # 能量 (根据截图数据，假设单位为 kcal)
        'Energy': '864 kJ', # 能量 (kJ) (示例，根据 kcal 转换或从数据源获取)
        'Protein': '22g', # 蛋白质 (根据截图数据)
        'Fat': '13g', # 脂肪 (根据截图数据)
        'Cholesterol': '63mg', # 胆固醇 (根据截图数据)
        'Ash': '1.3g', # 灰分 (根据截图数据)
        'Carbohydrates': '0g', # 碳水化合物 (根据截图数据)
        'Dietary Fiber': '0g', # 膳食纤维 (根据截图数据)
        # ... 添加截图中有而代码中没有的其他字段，并按键名规则调整
    },
    {
        'id': 2,
        'Food Name': 'Cod',
        'Category': 'Fish', # 示例
        'Edible Part': '59%', # 示例
        'Water Content': '82g',
        'Energy_kcal': '82 kcal',
        'Energy': '343 kJ', # 示例
        'Protein': '18g',
        'Fat': '0.7g',
        'Cholesterol': '43mg',
        'Ash': '1.0g',
        'Carbohydrates': '0g',
        'Dietary Fiber': '0g',
    },
     {
        'id': 3,
        'Food Name': 'Mackerel',
        'Category': 'Fish', # 示例
        'Edible Part': '60%', # 示例
        'Water Content': '63g',
        'Energy_kcal': '205 kcal',
        'Energy': '858 kJ', # 示例
        'Protein': '19g',
        'Fat': '13.9g',
        'Cholesterol': '70mg',
        'Ash': '1.2g',
        'Carbohydrates': '0g',
        'Dietary Fiber': '0g',
    },
    {
        'id': 4,
        'Food Name': 'Halibut', # 截图只显示比目鱼，这里补充常用英文名
        'Category': 'Fish', # 示例
        'Edible Part': '68%', # 示例
        'Water Content': '78g',
        'Energy_kcal': '111 kcal',
        'Energy': '464 kJ', # 示例
        'Protein': '23g',
        'Fat': '2.3g',
        'Cholesterol': '41mg',
        'Ash': '1.0g',
        'Carbohydrates': '0g',
        'Dietary Fiber': '0g',
    },
     {
        'id': 5,
        'Food Name': 'Snapper', # 截图只显示鲷鱼，这里补充常用英文名
        'Category': 'Fish', # 示例
        'Edible Part': '62%', # 示例
        'Water Content': '79g',
        'Energy_kcal': '100 kcal',
        'Energy': '418 kJ', # 示例
        'Protein': '20g',
        'Fat': '1.5g',
        'Cholesterol': '37mg',
        'Ash': '1.1g',
        'Carbohydrates': '0g',
        'Dietary Fiber': '0g',
    },
    {
        'id': 6,
        'Food Name': 'Bass', # 截图只显示鲈鱼，这里补充常用英文名
        'Category': 'Fish', # 示例
        'Edible Part': '63%', # 示例
        'Water Content': '78g',
        'Energy_kcal': '97 kcal',
        'Energy': '406 kJ', # 示例
        'Protein': '20g',
        'Fat': '2.0g',
        'Cholesterol': '58mg',
        'Ash': '1.0g',
        'Carbohydrates': '0g',
        'Dietary Fiber': '0g',
    },
    {
        'id': 7,
        'Food Name': 'Trout', # 截图只显示草鱼，这里补充常用英文名 (虽然草鱼通常是 Grass Carp，但截图里的草鱼数据可能对应 Trout，这里使用 Trout 作为 Food Name)
        'Category': 'Fish', # 示例
        'Edible Part': '58%', # 示例
        'Water Content': '75g',
        'Energy_kcal': '148 kcal',
        'Energy': '619 kJ', # 示例
        'Protein': '20g',
        'Fat': '6.6g',
        'Cholesterol': '59mg',
        'Ash': '1.1g',
        'Carbohydrates': '0g',
        'Dietary Fiber': '0g',
    },
    {
        'id': 8,
        'Food Name': 'Catfish', # 截图只显示鲶鱼，这里补充常用英文名
        'Category': 'Fish', # 示例
        'Edible Part': '66%', # 示例
        'Water Content': '79g',
        'Energy_kcal': '105 kcal',
        'Energy': '439 kJ', # 示例
        'Protein': '18g',
        'Fat': '3.0g',
        'Cholesterol': '58mg',
        'Ash': '1.0g',
        'Carbohydrates': '0g',
        'Dietary Fiber': '0g',
    },
    {
        'id': 9,
        'Food Name': 'Sunfish', # 截图只显示太阳鱼，这里补充常用英文名
        'Category': 'Fish', # 示例
        'Edible Part': '61%', # 示例
        'Water Content': '78g',
        'Energy_kcal': '97 kcal',
        'Energy': '406 kJ', # 示例
        'Protein': '20g',
        'Fat': '2.0g',
        'Cholesterol': '58mg',
        'Ash': '1.0g',
        'Carbohydrates': '0g',
        'Dietary Fiber': '0g',
    },
     {
        'id': 10,
        'Food Name': 'Tuna (in brine)',
        'Category': 'Seafood',
        'Edible Part': '81%', # 示例值
        'Water Content': '74.6g', # 示例值
        'Energy': '444 kJ', # 示例值
        'Energy_kcal': '106 kcal', # 示例值
        'Protein': '23.5 g', # 示例值
        'Fat': '0.6 g', # 示例值
        'Cholesterol': '51 mg', # 示例值
        'Ash': '1.3 g', # 示例值
        'Carbohydrates': '1.3g', # 示例值
        'Dietary Fiber': '0.0 g', # 示例值
        # ...
    },
    {
        'id': 11,
        'Food Name': 'Tuna (in oil)',
        'Category': 'Seafood',
        'Edible Part': '79%', # 示例值
        'Water Content': '63.3g', # 示例值
        'Energy': '804 kJ', # 示例值
        'Energy_kcal': '192 kcal', # 示例值
        'Protein': '27.1 g', # 示例值
        'Fat': '9.0 g', # 示例值
        'Cholesterol': '50 mg', # 示例值
        'Ash': '1.2 g', # 示例值
        'Carbohydrates': '0.6g', # 示例值
        'Dietary Fiber': '0.0 g', # 示例值
        # ...
    },
    # --- 请根据你的实际数据补充或替换这里的内容，并按新的键名格式调整 ---
]

# --- 2. 删除或修改现有接口 (已在上一轮删除，这里是新的接口) ---


# --- 3. 实现新的 API 接口 (更新使用新的键名) ---

# 3.1 搜索及获取简略列表接口
@routes.route('/api/products', methods=['GET'])
def search_and_get_summary_products():
    """
    Search products or get a list of all products with summary info
    ---
    tags:
      - Products API (New)
    parameters:
      - name: query
        in: query
        type: string
        required: false
        description: Search term for product name (English or Chinese) or alias
    responses:
      200:
        description: A list of products with summary information using new keys
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                description: Internal unique identifier (NOT displayed on frontend)
              Food Name: # Key changed to Food Name
                type: string
                description: English Product Name (Displayed as "食物名称")
              Edible Part: # Key changed to Edible Part
                type: string
                description: Edible Part
              Water Content: # Key changed to Water Content
                type: string
                description: Water Content
              Energy: # Key changed to Energy (using kJ or kcal)
                type: string
                description: Energy (kJ or kcal)
      404:
        description: No products found matching the query
    """
    search_query = request.args.get('query', '').lower() # 获取搜索关键词并转为小写

    # 过滤产品：搜索关键词匹配英文名 ('Food Name') 或别名 ('Alias') 或中文名 (如果数据源有但不在列表中)
    # 注意：虽然 name_cn 键被删了，但如果原始数据源有中文名，后端搜索逻辑可以用其他方式实现
    # 这里只搜索 Food Name 和 Alias
    if search_query:
        filtered_products = [
            p for p in products_detailed
            if search_query in p.get('Food Name', '').lower() or
               search_query in p.get('Alias', '').lower()
               # 如果需要搜索中文名，并且中文名保存在其他地方，需要在这里添加逻辑
        ]
    else:
        # 如果没有搜索关键词，返回所有产品
        filtered_products = products_detailed

    if not filtered_products:
        return jsonify({'message': 'No products found'}), 404 # 或者返回空列表 []

    # 构建简略信息列表的响应数据 (使用新的键名)
    summary_list = [
        {
            'id': p.get('id'), # 内部标识符
            'Food Name': p.get('Food Name', 'N/A'), # 使用新的键名
            'Edible Part': p.get('Edible Part', 'N/A'), # 使用新的键名
            'Water Content': p.get('Water Content', 'N/A'), # 使用新的键名
            # 使用新的键名 Energy
            'Energy': p.get('Energy', p.get('Energy_kcal', 'N/A')), # 优先显示 Energy (kJ)
        }
        for p in filtered_products
    ]

    return jsonify(summary_list)

# 3.2 获取单个产品详细信息接口
@routes.route('/api/products/<int:product_id>/details', methods=['GET'])
def get_product_details(product_id: int):
    """
    Get detailed information for a single product by its internal ID (using new keys)
    ---
    tags:
      - Products API (New)
    parameters:
      - name: product_id
        in: path
        type: integer
        required: true
        description: Internal ID of the product
    responses:
      200:
        description: Detailed information for the product using new keys
        schema:
          type: object
          properties:
            id:
              type: integer
              description: Internal unique identifier (NOT displayed on frontend)
            Food Name: # Key changed
              type: string
              description: English Product Name (Displayed as "食物名称")
            Alias: # Key changed
              type: string
              description: Alias or Common Name
            Category: # Key changed
              type: string
              description: Product Category
            Edible Part: # Key changed
              type: string
              description: Edible Part
            Water Content: # Key changed
              type: string
              description: Water Content
            Energy: # Key changed
              type: string
              description: Energy (kJ)
            Energy_kcal: # Key changed
              type: string
              description: Energy (kcal)
            Protein: # Key changed
              type: string
              description: Protein Content
            Fat: # Key changed
              type: string
              description: Fat Content
            Cholesterol: # Key changed
              type: string
              description: Cholesterol Content
            Ash: # Key changed
              type: string
              description: Ash Content
            Carbohydrates: # Key changed
              type: string
              description: Carbohydrates Content
            Dietary Fiber: # Key changed
              type: string
              description: Dietary Fiber Content
            # ... include all detailed fields with new keys
      404:
        description: Product not found
    """
    # 根据内部ID查找产品
    product = next((p for p in products_detailed if p.get('id') == product_id), None)

    if product:
        # 返回产品的全部详细信息 (使用新的键名)
        # 注意：这里返回所有详细字段，前端负责展示哪些以及如何展示
        return jsonify(product)
    else:
        return jsonify({'error': 'Product not found'}), 404

# 3.3 获取多个产品详细信息接口 (对比)
@routes.route('/api/products/compare', methods=['POST'])
def get_compare_products():
    """
    Get detailed information for multiple products by their internal IDs for comparison (using new keys)
    ---
    tags:
      - Products API (New)
    consumes:
      - application/json
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            ids:
              type: array
              items:
                type: integer
              description: List of internal product IDs to compare (2-4 IDs expected)
    responses:
      200:
        description: List of detailed information for the selected products using new keys
        schema:
          type: array
          items:
            type: object # Each item has the same schema as the single detail endpoint
            properties:
              id:
                type: integer
                description: Internal unique identifier (NOT displayed on frontend)
              Food Name: # Key changed
                type: string
                description: English Product Name (Displayed as "食物名称")
              # ... include ALL detailed properties here with new keys
      400:
        description: Invalid request (e.g., missing 'ids' in body)
      404:
        description: One or more products not found
    """
    data = request.get_json()
    # 确保请求体包含 'ids' 且是列表
    if not data or 'ids' not in data or not isinstance(data['ids'], list):
        return jsonify({'error': 'Invalid request body, expecting { "ids": [integer, ...] }'}), 400

    product_ids = data['ids']
    # 可以选择在这里加上 2-4 个ID的验证，或者在前端处理

    # 查找所有对应的详细产品
    compared_products = [
        p for p in products_detailed if p.get('id') in product_ids
    ]

    # 检查是否找到了所有请求的ID对应的产品
    if len(compared_products) != len(product_ids):
        # 找出哪个ID没找到（可选）
        found_ids = {p.get('id') for p in compared_products}
        missing_ids = [id for id in product_ids if id not in found_ids]
        return jsonify({'error': 'One or more products not found', 'missing_ids': missing_ids}), 404

    # 返回包含所有选中产品详细信息的列表 (使用新的键名)
    # 注意：这里返回的每个产品对象都包含所有详细字段
    return jsonify(compared_products)

# --- 保留原有的根路由，如果需要的话 ---
@routes.route('/')
def index():
    return 'Backend is running! API endpoints are available under /api/'

