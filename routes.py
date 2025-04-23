from flask import Blueprint, request, jsonify, render_template 

routes = Blueprint('routes', __name__)

# 产品数据存储在内存中（实际项目请用数据库）
products = [
    {
        'id': 1,
        'name': 'Fish Fillet',
        'category': 'Fish',
        'description': 'Fresh fish fillet',
        'protein': '20.5 g',  # 添加单位
        'fat': '3.2 g',       # 添加单位
        'calories': '120 kcal' # 添加单位
    },
    {
        'id': 2,
        'name': 'Salmon Steak',
        'category': 'Fish',
        'description': 'Rich in Omega-3',
        'protein': '25.0 g',  # 添加单位
        'fat': '13.0 g',      # 添加单位
        'calories': '208 kcal' # 添加单位
    },
    {
        'id': 3,
        'name': 'Tuna Can',
        'category': 'Seafood',
        'description': 'Canned tuna chunks in water',
        'protein': '23.5 g',  # 添加单位
        'fat': '1.0 g',       # 添加单位
        'calories': '98 kcal' # 添加单位
    },
    {
        'id': 4,
        'name': 'Cod Fish Fillet',
        'category': 'Fish',
        'description': 'Lean and mild-flavored fish',
        'protein': '18.0 g',  # 添加单位
        'fat': '1.5 g',       # 添加单位
        'calories': '85 kcal' # 添加单位
    },
    {
        'id': 5,
        'name': 'Mackerel',
        'category': 'Fish',
        'description': 'Fatty fish rich in Omega-3',
        'protein': '22.0 g',  # 添加单位
        'fat': '17.0 g',      # 添加单位
        'calories': '205 kcal' # 添加单位
    },
    {
        'id': 6,
        'name': 'Shrimp',
        'category': 'Seafood',
        'description': 'Low-calorie, high-protein seafood',
        'protein': '24.0 g',  # 添加单位
        'fat': '0.5 g',       # 添加单位
        'calories': '99 kcal' # 添加单位
    }
]


@routes.route('/')
def home():
    return render_template('index.html')


@routes.route('/products', methods=['GET'])
def get_products():
    """
    Get all products
    ---
    tags:
      - Products
    responses:
      200:
        description: A list of products
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
              category:
                type: string
              description:
                type: string
    """
    return jsonify(products)

@routes.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    """
    Get a product by ID
    ---
    tags:
      - Products
    parameters:
      - name: id
        in: path
        type: integer
        required: true
        description: ID of the product
    responses:
      200:
        description: A single product
        schema:
          type: object
          properties:
            id:
              type: integer
            name:
              type: string
            category:
              type: string
            description:
              type: string
      404:
        description: Product not found
    """
    product = next((p for p in products if p['id'] == id), None)
    return jsonify(product) if product else (jsonify({'error': 'Not found'}), 404)

@routes.route('/products', methods=['POST'])
def create_product():
    """
    Create a new product
    ---
    tags:
      - Products
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - name
            - category
            - description
          properties:
            name:
              type: string
            category:
              type: string
            description:
              type: string
    responses:
      201:
        description: Product created successfully
        schema:
          type: object
          properties:
            id:
              type: integer
            name:
              type: string
            category:
              type: string
            description:
              type: string
    """
    data = request.get_json()
    new_id = max(p['id'] for p in products) + 1 if products else 1
    new_product = {
        'id': new_id,
        'name': data['name'],
        'category': data['category'],
        'description': data['description']
    }
    products.append(new_product)
    return jsonify(new_product), 201

@routes.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    """
    Update an existing product
    ---
    tags:
      - Products
    consumes:
      - application/json
    parameters:
      - name: id
        in: path
        type: integer
        required: true
        description: ID of the product to update
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - name
            - category
            - description
          properties:
            name:
              type: string
            category:
              type: string
            description:
              type: string
    responses:
      200:
        description: Product updated successfully
        schema:
          type: object
          properties:
            id:
              type: integer
            name:
              type: string
            category:
              type: string
            description:
              type: string
      404:
        description: Product not found
    """
    product = next((p for p in products if p['id'] == id), None)
    if not product:
        return jsonify({'error': 'Not found'}), 404

    data = request.get_json()
    product.update({
        'name': data['name'],
        'category': data['category'],
        'description': data['description']
    })
    return jsonify(product)

@routes.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    """
    Delete a product
    ---
    tags:
      - Products
    parameters:
      - name: id
        in: path
        type: integer
        required: true
        description: ID of the product to delete
    responses:
      200:
        description: Product deleted successfully
        schema:
          type: object
          properties:
            message:
              type: string
      404:
        description: Product not found
    """
    global products
    product = next((p for p in products if p['id'] == id), None)
    if not product:
        return jsonify({'error': 'Not found'}), 404

    products = [p for p in products if p['id'] != id]
    return jsonify({'message': 'Deleted successfully'}), 200
