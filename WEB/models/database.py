from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Cliente(db.Model):
    __tablename__ = 'clientes'

    IdCli = db.Column(db.Integer, primary_key=True)
    NomeCli = db.Column(db.String(150), nullable=False)
    Telefone = db.Column(db.String(20))
    datanasc = db.Column(db.Date, nullable=False)
    Endereco = db.Column(db.String(500))
    Email = db.Column(db.String(300), unique=True, nullable=False)
    CPF = db.Column(db.String(14), unique=True, nullable=False)
    Senha = db.Column(db.String(255), nullable=False)

    def __init__(self, NomeCli, Telefone, datanasc, Endereco, Email, CPF, Senha):
        self.NomeCli = NomeCli
        self.Telefone = Telefone
        self.datanasc = datanasc
        self.Endereco = Endereco
        self.Email = Email
        self.CPF = CPF
        self.Senha = Senha
