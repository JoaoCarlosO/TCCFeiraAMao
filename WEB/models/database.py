from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Clientes(db.Model):
    __tablename__ = 'clientes'
    
    IdCli = db.Column(db.Integer, primary_key=True)
    NomeCli = db.Column(db.String(150), nullable=False)
    Telefone = db.Column(db.String(20))
    datanasc = db.Column(db.Date, nullable=False)
    LocalBusca = db.Column(db.String(500))
    Email = db.Column(db.String(300), nullable=False, unique=True)
    CPF = db.Column(db.String(14), nullable=False, unique=True)
    Senha = db.Column(db.String(255), nullable=False)
    
    # Relacionamentos
    pedidos = db.relationship('Pedidos', backref='cliente', lazy=True)
    carrinho = db.relationship('Carrinho', backref='cliente', lazy=True)
    notificacoes = db.relationship('Notificacao', backref='cliente', lazy=True)

class Vendedor(db.Model):
    __tablename__ = 'vendedor'
    
    IdVend = db.Column(db.Integer, primary_key=True)
    Nome = db.Column(db.String(150), nullable=False)
    Barraca = db.Column(db.String(175))
    Email = db.Column(db.String(300), nullable=False, unique=True)
    CPFCNPJ = db.Column(db.String(20), nullable=False, unique=True)
    Telefone = db.Column(db.String(20))
    Documento = db.Column(db.String(500))
    Senha = db.Column(db.String(255), nullable=False)
    vendedor_descricao = db.Column(db.String(255))
    
    # Relacionamentos
    produtos = db.relationship('Produtos', backref='vendedor', lazy=True)
    pedidos = db.relationship('Pedidos', backref='vendedor', lazy=True)
    encomendas = db.relationship('Encomendas', backref='vendedor', lazy=True)
    notificacoes = db.relationship('Notificacao', backref='vendedor', lazy=True)

class Produtos(db.Model):
    __tablename__ = 'produtos'
    
    IdPro = db.Column(db.Integer, primary_key=True)
    Nome = db.Column(db.String(255), nullable=False)
    Preco = db.Column(db.Numeric(10, 2))
    Quant = db.Column(db.Integer)
    Cat = db.Column(db.String(260))
    Estoque = db.Column(db.Integer)
    Descricao = db.Column(db.Text)
    PesoQuant = db.Column(db.String(50))
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'))
    Imagem = db.Column(db.String(500))
    
    # Relacionamentos
    carrinho_itens = db.relationship('Carrinho', backref='produto', lazy=True)

class Carrinho(db.Model):
    __tablename__ = 'carrinho'
    
    IdCarrinho = db.Column(db.Integer, primary_key=True)
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'))
    IdPro = db.Column(db.Integer, db.ForeignKey('produtos.IdPro'))
    Quantidade = db.Column(db.Integer, default=1)

class Pedidos(db.Model):
    __tablename__ = 'pedidos'
    
    IdPed = db.Column(db.Integer, primary_key=True)
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'))
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'))
    DataPed = db.Column(db.Date)
    StatusCli = db.Column(db.String(200))
    Subtotal = db.Column(db.Float)
    
    pagamentos = db.relationship('Pagamento', backref='pedido', lazy=True)

class Pagamento(db.Model):
    __tablename__ = 'pagamento'
    
    IdPag = db.Column(db.Integer, primary_key=True)
    IdPed = db.Column(db.Integer, db.ForeignKey('pedidos.IdPed'))
    Metodo = db.Column(db.String(250))
    Valor = db.Column(db.Float)
    StatusPag = db.Column(db.String(250))
    DataPag = db.Column(db.Date)

class Encomendas(db.Model):
    __tablename__ = 'encomendas'
    
    IdEnc = db.Column(db.Integer, primary_key=True)
    NomeCliente = db.Column(db.String(150), nullable=False)
    Status = db.Column(db.String(100))
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'))
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'))

class Notificacao(db.Model):
    __tablename__ = 'notificacao'
    
    IdNot = db.Column(db.Integer, primary_key=True)
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'))
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'))
    Mensagem = db.Column(db.Text)
    Status = db.Column(db.String(100))
    DataEnvio = db.Column(db.DateTime, default=datetime.utcnow)
    
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Clientes(db.Model):
    __tablename__ = 'clientes'
    
    IdCli = db.Column(db.Integer, primary_key=True)
    NomeCli = db.Column(db.String(150), nullable=False)
    Telefone = db.Column(db.String(20))
    datanasc = db.Column(db.Date, nullable=False)
    LocalBusca = db.Column(db.String(500))
    Email = db.Column(db.String(300), nullable=False, unique=True)
    CPF = db.Column(db.String(14), nullable=False, unique=True)
    Senha = db.Column(db.String(255), nullable=False)
    
    pedidos = db.relationship('Pedidos', backref='cliente', lazy=True)
    carrinho = db.relationship('Carrinho', backref='cliente', lazy=True)
    notificacoes = db.relationship('Notificacao', backref='cliente', lazy=True)

class Vendedor(db.Model):
    __tablename__ = 'vendedor'
    
    IdVend = db.Column(db.Integer, primary_key=True)
    Nome = db.Column(db.String(150), nullable=False)
    Barraca = db.Column(db.String(175))
    Email = db.Column(db.String(300), nullable=False, unique=True)
    CPFCNPJ = db.Column(db.String(20), nullable=False, unique=True)
    Telefone = db.Column(db.String(20))
    Documento = db.Column(db.String(500))
    Senha = db.Column(db.String(255), nullable=False)
    vendedor_descricao = db.Column(db.String(255))
    
    produtos = db.relationship('Produtos', backref='vendedor', lazy=True)
    pedidos = db.relationship('Pedidos', backref='vendedor', lazy=True)
    encomendas = db.relationship('Encomendas', backref='vendedor', lazy=True)
    notificacoes = db.relationship('Notificacao', backref='vendedor', lazy=True)

class Produtos(db.Model):
    __tablename__ = 'produtos'
    
    IdPro = db.Column(db.Integer, primary_key=True)
    Nome = db.Column(db.String(255), nullable=False)
    Preco = db.Column(db.Numeric(10, 2))
    Quant = db.Column(db.Integer)
    Cat = db.Column(db.String(260))
    Estoque = db.Column(db.Integer)
    Descricao = db.Column(db.Text)
    PesoQuant = db.Column(db.String(50))
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'))
    Imagem = db.Column(db.String(500))
    
    carrinho_itens = db.relationship('Carrinho', backref='produto', lazy=True)

class Carrinho(db.Model):
    __tablename__ = 'carrinho'
    
    IdCarrinho = db.Column(db.Integer, primary_key=True)
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'))
    IdPro = db.Column(db.Integer, db.ForeignKey('produtos.IdPro'))
    Quantidade = db.Column(db.Integer, default=1)

class Pedidos(db.Model):
    __tablename__ = 'pedidos'
    
    IdPed = db.Column(db.Integer, primary_key=True)
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'))
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'))
    DataPed = db.Column(db.Date)
    StatusCli = db.Column(db.String(200))
    Subtotal = db.Column(db.Float)
    
    pagamentos = db.relationship('Pagamento', backref='pedido', lazy=True)

class Pagamento(db.Model):
    __tablename__ = 'pagamento'
    
    IdPag = db.Column(db.Integer, primary_key=True)
    IdPed = db.Column(db.Integer, db.ForeignKey('pedidos.IdPed'))
    Metodo = db.Column(db.String(250))
    Valor = db.Column(db.Float)
    StatusPag = db.Column(db.String(250))
    DataPag = db.Column(db.Date)

class Encomendas(db.Model):
    __tablename__ = 'encomendas'
    
    IdEnc = db.Column(db.Integer, primary_key=True)
    NomeCliente = db.Column(db.String(150), nullable=False)
    Status = db.Column(db.String(100))
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'))
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'))

class Notificacao(db.Model):
    __tablename__ = 'notificacao'
    
    IdNot = db.Column(db.Integer, primary_key=True)
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'))
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'))
    Mensagem = db.Column(db.Text)
    Status = db.Column(db.String(100))
    DataEnvio = db.Column(db.DateTime, default=datetime.utcnow)

class MensagemSuporte(db.Model):
    __tablename__ = 'mensagemsuporte'
    
    IdMsg = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(300), nullable=False)
    mensagem = db.Column(db.Text, nullable=False)
    data_envio = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='pendente')