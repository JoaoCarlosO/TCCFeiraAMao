from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Vendedor(db.Model):
    __tablename__ = 'vendedor'
    
    IdVend = db.Column(db.Integer, primary_key=True, autoincrement=True)
    IdCli = db.Column(db.Integer, nullable=True)
    Nome = db.Column(db.String(150), nullable=False)
    Barraca = db.Column(db.String(175), nullable=True)
    Email = db.Column(db.String(300), nullable=False, unique=True)
    CPFCNPJ = db.Column(db.String(20), nullable=False, unique=True)
    Telefone = db.Column(db.String(20), nullable=True)
    Documento = db.Column(db.String(500), nullable=True)
    Senha = db.Column(db.String(255), nullable=False)
    vendedor_descricao = db.Column(db.String(255), nullable=True)
    
    # Relacionamentos
    feiras = db.relationship('Feiras', backref='vendedor', lazy=True, cascade="all, delete-orphan")
    produtos = db.relationship('Produtos', backref='vendedor', lazy=True, cascade="all, delete-orphan")
    pedidos = db.relationship('Pedidos', backref='vendedor', lazy=True, cascade="all, delete-orphan")
    encomendas = db.relationship('Encomendas', backref='vendedor', lazy=True, cascade="all, delete-orphan")
    notificacoes = db.relationship('Notificacao', backref='vendedor', lazy=True, cascade="all, delete-orphan")
    barracas = db.relationship('BarracaVend', backref='vendedor', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.Senha = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.Senha, password)

    def __repr__(self):
        return f'<Vendedor {self.Nome}>'

class Feiras(db.Model):
    __tablename__ = 'feiras'
    
    IdFeira = db.Column(db.Integer, primary_key=True, autoincrement=True)
    NomeFeira = db.Column(db.String(200), nullable=False)
    Localizacao = db.Column(db.String(500), nullable=False)
    DiasFuncionamento = db.Column(db.String(100), nullable=True)
    HorarioFuncionamento = db.Column(db.String(100), nullable=True)
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'), nullable=False)
    DataCadastro = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Feira {self.NomeFeira}>'

class MensagemSuporte(db.Model):
    __tablename__ = 'mensagemsuporte'

    IdMsg = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(300), nullable=False)
    mensagem = db.Column(db.Text, nullable=False)
    data_envio = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='pendente')

    def __repr__(self):
        return f'<MensagemSuporte {self.nome}>'

# ✅ ADICIONE ESTAS CLASSES PARA TODAS AS TABELAS EXISTENTES

class Clientes(db.Model):
    __tablename__ = 'clientes'
    
    IdCli = db.Column(db.Integer, primary_key=True, autoincrement=True)
    NomeCli = db.Column(db.String(150), nullable=False)
    Telefone = db.Column(db.String(20), nullable=True)
    datanasc = db.Column(db.Date, nullable=False)
    LocalBusca = db.Column(db.String(500), nullable=True)
    Email = db.Column(db.String(300), nullable=False, unique=True)
    CPF = db.Column(db.String(14), nullable=False, unique=True)
    Senha = db.Column(db.String(255), nullable=False)
    
    pedidos = db.relationship('Pedidos', backref='cliente', lazy=True)
    notificacoes = db.relationship('Notificacao', backref='cliente', lazy=True)
    carrinho = db.relationship('Carrinho', backref='cliente', lazy=True)
    encomendas = db.relationship('Encomendas', backref='cliente', lazy=True)

class Produtos(db.Model):
    __tablename__ = 'produtos'
    
    IdPro = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Nome = db.Column(db.String(255), nullable=False)
    Preco = db.Column(db.Numeric(10, 2), nullable=True)
    Quant = db.Column(db.Integer, nullable=True)
    Cat = db.Column(db.String(260), nullable=True)
    Estoque = db.Column(db.Integer, nullable=True)
    Descricao = db.Column(db.Text, nullable=True)
    PesoQuant = db.Column(db.String(50), nullable=True)
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'), nullable=True)
    Imagem = db.Column(db.String(500), nullable=True)
    
    carrinho = db.relationship('Carrinho', backref='produto', lazy=True)

class Pedidos(db.Model):
    __tablename__ = 'pedidos'
    
    IdPed = db.Column(db.Integer, primary_key=True, autoincrement=True)
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'), nullable=True)
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'), nullable=True)
    DataPed = db.Column(db.Date, nullable=True)
    StatusCli = db.Column(db.String(200), nullable=True)
    Subtotal = db.Column(db.Numeric(10, 2), nullable=True)
    
    pagamentos = db.relationship('Pagamento', backref='pedido', lazy=True, cascade="all, delete-orphan")

class Pagamento(db.Model):
    __tablename__ = 'pagamento'
    
    IdPag = db.Column(db.Integer, primary_key=True, autoincrement=True)
    IdPed = db.Column(db.Integer, db.ForeignKey('pedidos.IdPed'), nullable=True)
    Metodo = db.Column(db.String(250), nullable=True)
    Valor = db.Column(db.Numeric(10, 2), nullable=True)
    StatusPag = db.Column(db.String(250), nullable=True)
    DataPag = db.Column(db.Date, nullable=True)

class Encomendas(db.Model):
    __tablename__ = 'encomendas'
    
    IdEnc = db.Column(db.Integer, primary_key=True, autoincrement=True)
    NomeCliente = db.Column(db.String(150), nullable=False)
    Status = db.Column(db.String(100), nullable=True)
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'), nullable=True)
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'), nullable=True)

class Notificacao(db.Model):
    __tablename__ = 'notificacao'
    
    IdNot = db.Column(db.Integer, primary_key=True, autoincrement=True)
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'), nullable=True)
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'), nullable=True)
    Mensagem = db.Column(db.Text, nullable=True)
    Status = db.Column(db.String(100), nullable=True)
    DataEnvio = db.Column(db.DateTime, default=datetime.utcnow)

class Carrinho(db.Model):
    __tablename__ = 'carrinho'
    
    IdCarrinho = db.Column(db.Integer, primary_key=True, autoincrement=True)
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'), nullable=True)
    IdPro = db.Column(db.Integer, db.ForeignKey('produtos.IdPro'), nullable=True)
    Quantidade = db.Column(db.Integer, default=1)

class BarracaVend(db.Model):
    __tablename__ = 'barracavend'
    
    IdBarraca = db.Column(db.Integer, primary_key=True, autoincrement=True)
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'), nullable=True)
    Nome = db.Column(db.String(150), nullable=False)
    Endereco = db.Column(db.String(300), nullable=True)
    Biografia = db.Column(db.Text, nullable=True)
    Local = db.Column(db.String(200), nullable=True)
    Integrantes = db.Column(db.Integer, nullable=True)
    Categoria = db.Column(db.String(150), nullable=True)