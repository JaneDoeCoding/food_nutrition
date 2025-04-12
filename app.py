import sys
from pathlib import Path
from flask import Flask
from flasgger import Swagger
from routes import routes  

sys.path.append(str(Path(__file__).parent))

app = Flask(__name__.split('.')[0])
app.register_blueprint(routes, url_prefix="/api")  

handler = app

swagger = Swagger(app)
if __name__ == '__main__':
    app.run(debug=True)
