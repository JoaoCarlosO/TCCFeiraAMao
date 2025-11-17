# app.py
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
    """
    Cria o banco de dados se não existir
    """
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        with connection.cursor() as cursor:
            # Cria o banco se não existir
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            print(f"✅ Banco {DB_NAME} criado ou já existente.")
            
            # Seleciona o banco
            cursor.execute(f"USE {DB_NAME};")
            
            # Verifica e corrige a tabela vendedor
            cursor.execute("""
                SELECT COUNT(*) AS cnt 
                FROM information_schema.tables 
                WHERE table_schema = %s AND table_name = 'vendedor';
            """, (DB_NAME,))
            table_exists = cursor.fetchone()['cnt'] > 0
            
            if table_exists:
                # Verifica se a coluna IdCli existe
                cursor.execute("""
                    SELECT COUNT(*) AS cnt 
                    FROM information_schema.columns 
                    WHERE table_schema = %s 
                    AND table_name = 'vendedor' 
                    AND column_name = 'IdCli';
                """, (DB_NAME,))
                col_exists = cursor.fetchone()['cnt'] > 0
                
                if not col_exists:
                    print("ℹ️ Coluna IdCli ausente na tabela 'vendedor'. Adicionando...")
                    cursor.execute("ALTER TABLE vendedor ADD COLUMN IdCli INT NULL;")
                    print("✅ Coluna IdCli adicionada com sucesso.")
            
        connection.commit()
        
    except Exception as e:
        print(f"❌ Erro ao criar/verificar banco: {e}")
        return False
    finally:
        if 'connection' in locals():
            connection.close()
    return True

def create_tables():
    """
    Cria todas as tabelas usando SQLAlchemy
    """
    try:
        with app.app_context():
            # Importa os modelos para garantir que sejam registrados
            from models.database import Vendedor, Feiras, MensagemSuporte
            
            # Remove todas as tabelas existentes e recria (APENAS DESENVOLVIMENTO)
            print("🔄 Recriando todas as tabelas...")
            db.drop_all()
            db.create_all()
            print("✅ Tabelas criadas com sucesso!")
            
    except Exception as e:
        print(f"❌ Erro ao criar tabelas: {e}")
        return False
    return True

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

def create_test_data():
    """
    Cria dados de teste para desenvolvimento
    """
    try:
        with app.app_context():
            from models.database import Vendedor, Feiras
            from werkzeug.security import generate_password_hash
            
            # Verifica se já existe vendedor de teste
            if not Vendedor.query.filter_by(Email="teste@email.com").first():
                vendedor_teste = Vendedor(
                    Nome="Vendedor Teste",
                    Barraca="Barraca 01",
                    Email="teste@email.com",
                    CPFCNPJ="123.456.789-00",
                    Telefone="(11) 99999-9999",
                    IdCli=1
                )
                vendedor_teste.Senha = generate_password_hash("123456")
                db.session.add(vendedor_teste)
                db.session.commit()
                print("✅ Vendedor teste criado: teste@email.com / 123456")
            
            # Cria algumas feiras de teste
            if not Feiras.query.first():
                feiras_teste = [
                    Feiras(
                        NomeFeira="Feira da Praça",
                        Localizacao="Praça Central, Centro",
                        DiasFuncionamento="Segunda a Sábado",
                        HorarioFuncionamento="07:00 - 13:00",
                        IdVend=1
                    ),
                    Feiras(
                        NomeFeira="Feira do Produtor",
                        Localizacao="Av. Principal, 123",
                        DiasFuncionamento="Terça e Sexta",
                        HorarioFuncionamento="06:00 - 12:00",
                        IdVend=1
                    )
                ]
                db.session.add_all(feiras_teste)
                db.session.commit()
                print("✅ Feiras de teste criadas")
                
    except Exception as e:
        print(f"❌ Erro ao criar dados de teste: {e}")

if __name__ == '__main__':
    print("🚀 Iniciando aplicação Feira na Mão...")
    print("=" * 50)
    
    # 1. Cria o banco de dados
    if not create_database():
        print("❌ Falha ao criar banco de dados. Verifique o MySQL.")
        exit(1)
    
    # 2. Cria as tabelas
    if not create_tables():
        print("❌ Falha ao criar tabelas.")
        exit(1)
    
    # 3. Cria dados de teste
    create_test_data()
    
    # 4. Inicializa as rotas
    init_routes()
    
    print("=" * 50)
    print("🌈 Aplicação iniciada com sucesso!")
    print("📱 Servidor rodando em: http://localhost:5000")
    print("👤 Login teste: teste@email.com / 123456")
    print("=" * 50)
    
    app.run(host='localhost', port=5000, debug=True)