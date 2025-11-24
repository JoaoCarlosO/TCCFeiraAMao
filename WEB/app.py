# app.py
from flask import Flask
from models.database import db

app = Flask(__name__, template_folder='templates', static_folder='static')

DB_NAME = 'feiraamao'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://root:@localhost/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'sua-chave-secreta-feira-na-mao-2024'

db.init_app(app)

def init_routes():
    """
    Inicializa todas as rotas da aplicação
    """
    try:
        from controllers.routes import init_app
        init_app(app)
        print("✅ Rotas inicializadas com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao inicializar rotas: {e}")

if __name__ == '__main__':
    print("🚀 Iniciando aplicação Feira na Mão...")
    print("=" * 50)
    
    # Apenas inicializa as rotas e inicia o servidor
    init_routes()
    
    print("=" * 50)
    print("🌈 Aplicação iniciada com sucesso!")
    print("📱 Servidor rodando em: http://localhost:5000")
    print("=" * 50)
    
    app.run(host='localhost', port=5000, debug=True)