from app.models import db
from app.main import app

with app.app_context():
    db.create_all()