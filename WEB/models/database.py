from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Vendedor(db.Model):
    __tablename__ = 'vendedor'
    
    IdVend = db.Column(db.Integer, primary_key=True)
    IdCli = db.Column(db.Integer, db.ForeignKey('clientes.IdCli'))
    Nome = db.Column(db.String(150), nullable=False)
    Barraca = db.Column(db.String(175))
    Email = db.Column(db.String(300), nullable=False, unique=True)
    CPFCNPJ = db.Column(db.String(20), nullable=False, unique=True)
    Telefone = db.Column(db.String(20))
    Documento = db.Column(db.String(500))
    Senha = db.Column(db.String(255), nullable=False)
    
    feiras = db.relationship('Feiras', backref='vendedor', lazy=True)

    def set_password(self, password):
        self.Senha = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.Senha, password)

class Feiras(db.Model):
    __tablename__ = 'feiras'
    
    IdFeira = db.Column(db.Integer, primary_key=True)
    NomeFeira = db.Column(db.String(200), nullable=False)
    Localizacao = db.Column(db.String(500), nullable=False)
    DiasFuncionamento = db.Column(db.String(100))
    HorarioFuncionamento = db.Column(db.String(100))
    IdVend = db.Column(db.Integer, db.ForeignKey('vendedor.IdVend'), nullable=False)
    DataCadastro = db.Column(db.DateTime, default=datetime.utcnow)

class MensagemSuporte(db.Model):
    __tablename__ = 'mensagem_suporte'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    email = db.Column(db.String(100))
    mensagem = db.Column(db.Text)
    data_envio = db.Column(db.DateTime, default=datetime.utcnow)