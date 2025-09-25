from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    NomeCli = db.Column(db.String(100))
    Telefone = db.Column(db.String(20))
    Nascimento = db.Column(db.String(15))
    Endereco = db.Column(db.String(200))
    Email = db.Column(db.String(120), unique=True)
    CPF = db.Column(db.String(14), unique=True)
    Senha = db.Column(db.String(255))
    
    # Relacionamentos
    encomendas = db.relationship('Encomenda', backref='cliente', lazy=True)
    carrinho_itens = db.relationship('Carrinho', backref='cliente', lazy=True)

    def __init__(self, nome, telefone, nascimento, endereco, email, cpf, senha):
        self.NomeCli = nome
        self.Telefone = telefone
        self.Nascimento = nascimento
        self.Endereco = endereco
        self.Email = email
        self.CPF = cpf
        self.Senha = senha

class MensagemSuporte(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    mensagem = db.Column(db.Text, nullable=False)
    data_envio = db.Column(db.DateTime, default=datetime.utcnow)

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