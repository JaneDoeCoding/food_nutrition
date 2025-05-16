import sys
from pathlib import Path
from flask import Flask
from flasgger import Swagger
from flask_cors import CORS
from routes import routes  

sys.path.append(str(Path(__file__).parent))

app = Flask(
    __name__.split('.')[0],
    template_folder='templates',
    static_folder='static'
)

CORS(app) 
app.register_blueprint(routes)  

swagger = Swagger(app)

handler = app

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
