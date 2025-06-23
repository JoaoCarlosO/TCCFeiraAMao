from flask import Flask
import pymysql
from controllers import routes
from models.database import db

app = Flask(__name__, template_folder='templates')

routes.init_app(app)

DB_NAME = 'feiraamao'
app.config['DATABASE_NAME'] = DB_NAME
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://root@localhost/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

if __name__ == '__main__':
    connection = pymysql.connect(host='localhost',
                                 user='root',
                                 password='',
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)

    try:
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
            print(f"Banco {DB_NAME} criado ou já existente.")
    except Exception as e:
        print(f"Erro ao criar banco: {e}")
    finally:
        connection.close()

    db.init_app(app)
    with app.app_context():
        db.create_all()

    app.run(host='localhost', port=5000, debug=True)
