# models/database.py
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
    
    # Relacionamento com feiras
    feiras = db.relationship('Feiras', backref='vendedor', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        """Define a senha do vendedor"""
        self.Senha = generate_password_hash(password)

    def check_password(self, password):
        """Verifica se a senha está correta"""
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
    __tablename__ = 'mensagem_suporte'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Nome = db.Column(db.String(100), nullable=False)
    Email = db.Column(db.String(100), nullable=False)
    Mensagem = db.Column(db.Text, nullable=False)
    DataEnvio = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<MensagemSuporte {self.Nome}>'