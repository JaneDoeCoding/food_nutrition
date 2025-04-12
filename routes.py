from flask import Blueprint, request, jsonify

routes = Blueprint('routes', __name__)

# 产品数据存储在内存中（实际项目请用数据库）
products = [
    {'id': 1, 'name': 'Fish Fillet', 'category': 'Fish', 'description': 'Fresh fish fillet'},
    {'id': 2, 'name': 'Fish Ball', 'category': 'Fish', 'description': 'Fish ball made of minced fish'}
]

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
