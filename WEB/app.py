from flask import Flask
import pymysql
from controllers import routes
from models.database import db

app = Flask(__name__, template_folder='templates')

DB_NAME = 'feiraamaoWeb'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://root:@localhost/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['DATABASE_NAME'] = DB_NAME
app.secret_key = 'sua-chave-secreta'  # deve estar aqui

# Criação do banco, se não existir
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
        from models.database import MensagemSuporte  # importa os models
        db.create_all()

    routes.init_app(app)  # garantir que vem DEPOIS do init do banco
    app.run(host='localhost', port=5000, debug=True)
