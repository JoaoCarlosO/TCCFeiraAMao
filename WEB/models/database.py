from flask_sqlalchemy import SQLAlchemy

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


class Feira(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    dia_semana = db.Column(db.String(20))
    horario = db.Column(db.String(50))
    vendedor_id = db.Column(db.Integer, db.ForeignKey('vendedor.id'), nullable=False)

class Vendedor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    foto = db.Column(db.String(200))
    # Relacionamento com a tabela Produto (1 para N)
    produtos = db.relationship('Produto', backref='vendedor', lazy=True)

class Produto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    preco = db.Column(db.String(20))
    img = db.Column(db.String(200))
    vendedor_id = db.Column(db.Integer, db.ForeignKey('vendedor.id'), nullable=False)