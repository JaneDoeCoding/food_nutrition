import sys
from pathlib import Path
from flask import Flask
from flasgger import Swagger
from routes import routes  

sys.path.append(str(Path(__file__).parent))

app = Flask(
    __name__.split('.')[0],
    template_folder='templates',
    static_folder='static'
)

app.register_blueprint(routes, url_prefix="/api")  

swagger = Swagger(app)

handler = app

if __name__ == '__main__':
    app.run(debug=True)
