from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    IdCli = db.Column(db.Integer, primary_key=True)
    NomeCli = db.Column(db.String(150), nullable=False)
    Telefone = db.Column(db.String(20))
    datanasc = db.Column(db.Date, nullable=False)  # Nome correto do campo
    LocalBusca = db.Column(db.String(500))
    Email = db.Column(db.String(300), unique=True, nullable=False)
    CPF = db.Column(db.String(14), unique=True, nullable=False)
    Senha = db.Column(db.String(255), nullable=False)

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