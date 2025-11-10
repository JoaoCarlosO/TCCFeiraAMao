from flask import Flask
import pymysql
from models.database import db

app = Flask(__name__, template_folder='templates', static_folder='static')

DB_NAME = 'feiraamao'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://root:@localhost/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'sua-chave-secreta-feira-na-mao-2024'

db.init_app(app)

def create_database():
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
            print(f"✅ Banco {DB_NAME} criado ou já existente.")
            
    except Exception as e:
        print(f"❌ Erro ao criar banco: {e}")
        return False
    finally:
        if 'connection' in locals():
            connection.close()
    
    return True

def create_tables():
    try:
        with app.app_context():
            from models.database import Vendedor, Feiras, MensagemSuporte
            db.create_all()
            print("✅ Tabelas criadas/verificadas com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao criar tabelas: {e}")
        return False
    return True

def init_routes():
    try:
        from controllers.routes import init_app
        init_app(app)
        print("✅ Rotas inicializadas com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao inicializar rotas: {e}")

if __name__ == '__main__':
    print("🚀 Iniciando aplicação Feira na Mão...")
    
    if not create_database():
        print("❌ Falha ao criar banco de dados. Verifique o MySQL.")
        exit(1)
    
    if not create_tables():
        print("❌ Falha ao criar tabelas.")
        exit(1)
    
    init_routes()
    
    print("🌈 Aplicação iniciada com sucesso!")
    print("📱 Servidor rodando em: http://localhost:5000")
    
    app.run(host='localhost', port=5000, debug=True)