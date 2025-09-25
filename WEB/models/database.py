from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    IdCli = db.Column(db.Integer, primary_key=True)
    NomeCli = db.Column(db.String(150), nullable=False)
    Telefone = db.Column(db.String(20))
<<<<<<< HEAD
    Nascimento = db.Column(db.String(15))
    Endereco = db.Column(db.String(200))
    Email = db.Column(db.String(120), unique=True)
    CPF = db.Column(db.String(14), unique=True)
    Senha = db.Column(db.String(255))
    
    # Relacionamentos
    encomendas = db.relationship('Encomenda', backref='cliente', lazy=True)
    carrinho_itens = db.relationship('Carrinho', backref='cliente', lazy=True)
=======
    datanasc = db.Column(db.Date, nullable=False)  # Nome correto do campo
    LocalBusca = db.Column(db.String(500))
    Email = db.Column(db.String(300), unique=True, nullable=False)
    CPF = db.Column(db.String(14), unique=True, nullable=False)
    Senha = db.Column(db.String(255), nullable=False)
>>>>>>> 51a4515b1108e75979ca63e29bc31d8c1eccf9fd

    def __init__(self, nome, telefone, nascimento, endereco, email, cpf, senha):
        self.NomeCli = nome
        self.Telefone = telefone
        self.datanasc = nascimento  # Agora usando o nome correto
        self.LocalBusca = endereco
        self.Email = email
        self.CPF = cpf
        self.Senha = senha

class Vendedor(db.Model):
    __tablename__ = 'vendedor'
    
    IdVend = db.Column(db.Integer, primary_key=True)
    Nome = db.Column(db.String(150), nullable=False)
    Barraca = db.Column(db.String(175))
    Email = db.Column(db.String(300), unique=True, nullable=False)
    CPFCNPJ = db.Column(db.String(20), unique=True, nullable=False)
    Telefone = db.Column(db.String(20))
    Documento = db.Column(db.String(500))
    Senha = db.Column(db.String(255), nullable=False)
    
    # Relacionamentos
    produtos = db.relationship('Produto', backref='vendedor', lazy=True)
    barraca = db.relationship('BarracaVend', backref='vendedor', uselist=False, lazy=True)

class Produto(db.Model):
    __tablename__ = 'produtos'
    
    IdPro = db.Column(db.Integer, primary_key=True)
    Nome = db.Column(db.String(255), nullable=False)
    Preco = db.Column(db.Numeric(10, 2))  # Decimal correto
    Quant = db.Column(db.Integer)
    Cat = db.Column(db.String(260))
    Estoque = db.Column(db.Integer)
    Descricao = db.Column(db.Text)
    PesoQuant = db.Column(db.String(50))
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'))
    Imagem = db.Column(db.String(500))

class BarracaVend(db.Model):
    __tablename__ = 'barracavend'
    
    IdBarraca = db.Column(db.Integer, primary_key=True)
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'))
    Nome = db.Column(db.String(150), nullable=False)
    Endereco = db.Column(db.String(300))
    Biografia = db.Column(db.Text)
    Local = db.Column(db.String(200))
    Integrantes = db.Column(db.Integer)
    Categoria = db.Column(db.String(150))

class MensagemSuporte(db.Model):
    __tablename__ = 'mensagemsuporte'  # Você precisa criar esta tabela
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    mensagem = db.Column(db.Text, nullable=False)
    data_envio = db.Column(db.DateTime, default=datetime.utcnow)
<<<<<<< HEAD

class Feira(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    dia_semana = db.Column(db.String(20))
    horario = db.Column(db.String(50))
    endereco = db.Column(db.String(200))
    vendedor_id = db.Column(db.Integer, db.ForeignKey('vendedor.id'), nullable=False)

class Vendedor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    foto = db.Column(db.String(200))
    descricao = db.Column(db.Text)  # IMPORTANTE: Adicione este campo
    email = db.Column(db.String(120), unique=True)
    telefone = db.Column(db.String(20))
    endereco = db.Column(db.String(200))
    avaliacao = db.Column(db.Float, default=0.0)  # Para avaliações
    
    # Relacionamentos
    produtos = db.relationship('Produto', backref='vendedor', lazy=True)
    feiras = db.relationship('Feira', backref='vendedor', lazy=True)

class Produto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    preco = db.Column(db.Float)  # Mude para Float para cálculos
    descricao = db.Column(db.Text)  # Adicione descrição
    img = db.Column(db.String(200))
    categoria = db.Column(db.String(50))  # Adicione categoria
    estoque = db.Column(db.Integer, default=0)  # Controle de estoque
    vendedor_id = db.Column(db.Integer, db.ForeignKey('vendedor.id'), nullable=False)
    
    # Relacionamentos
    carrinho_itens = db.relationship('Carrinho', backref='produto', lazy=True)
    encomenda_itens = db.relationship('EncomendaItem', backref='produto', lazy=True)

# TABELAS ADICIONAIS IMPORTANTES

class Carrinho(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    produto_id = db.Column(db.Integer, db.ForeignKey('produto.id'), nullable=False)
    quantidade = db.Column(db.Integer, default=1)
    data_adicionado = db.Column(db.DateTime, default=datetime.utcnow)

class Encomenda(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    data_encomenda = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='Pendente')  # Pendente, Confirmada, Entregue
    total = db.Column(db.Float, default=0.0)
    
    # Relacionamento com itens da encomenda
    itens = db.relationship('EncomendaItem', backref='encomenda', lazy=True)

class EncomendaItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    encomenda_id = db.Column(db.Integer, db.ForeignKey('encomenda.id'), nullable=False)
    produto_id = db.Column(db.Integer, db.ForeignKey('produto.id'), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    preco_unitario = db.Column(db.Float, nullable=False)

class Notificacao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    mensagem = db.Column(db.Text, nullable=False)
    lida = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
=======

# Outras tabelas que você pode precisar
class Pedido(db.Model):
    __tablename__ = 'pedidos'
    
    IdPed = db.Column(db.Integer, primary_key=True)
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'))
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'))
    DataPed = db.Column(db.Date)
    StatusCli = db.Column(db.String(200))
    Subtotal = db.Column(db.Float)

class Carrinho(db.Model):
    __tablename__ = 'carrinho'
    
    IdCarrinho = db.Column(db.Integer, primary_key=True)
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'))
    IdPro = db.Column(db.Integer, db.ForeignKey('produtos.IdPro'))
    Quantidade = db.Column(db.Integer, default=1)
>>>>>>> 51a4515b1108e75979ca63e29bc31d8c1eccf9fd
