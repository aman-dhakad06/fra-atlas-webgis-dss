from flask import Flask
from .config import Config
from .database import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize DB
    db.init_app(app)

    # Import routes
    with app.app_context():
        from . import routes
        app.register_blueprint(routes.bp)

    return app
