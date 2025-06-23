from flask import render_template, request, redirect, url_for, flash
from models.database import Cliente, db
from werkzeug.security import generate_password_hash, check_password_hash

def init_app(app):
    app.secret_key = 'sua-chave-secreta'

    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            email = request.form['username']
            senha = request.form['password']
            cliente = Cliente.query.filter_by(Email=email).first()

            if cliente and check_password_hash(cliente.Senha, senha):
                flash('Login realizado com sucesso!', 'success')
            else:
                flash('Credenciais inválidas.', 'error')

            return redirect(url_for('home'))

        return render_template('login.html')

    @app.route('/cadastro', methods=['GET', 'POST'])
    def cadastro():
        if request.method == 'POST':
            nome = request.form.get('nome')
            telefone = request.form.get('telefone')
            email = request.form.get('email')
            nascimento = request.form.get('nascimento')
            cpf = request.form.get('cpf')
            senha = generate_password_hash(request.form.get('senha'))
            endereco = ''  # pode deixar em branco no cadastro

            novo_cliente = Cliente(nome, telefone, nascimento, endereco, email, cpf, senha)

            try:
                db.session.add(novo_cliente)
                db.session.commit()
                flash('Cadastro realizado com sucesso!', 'success')
            except Exception as e:
                db.session.rollback()
                flash(f'Erro no cadastro: {e}', 'error')

            return redirect(url_for('home'))

        return render_template('cadastro.html')

    @app.route('/perfil', methods=['GET', 'POST'])
    def perfil():
        cliente = Cliente.query.first()  # Simulando cliente logado

        if request.method == 'POST':
            cliente.NomeCli = request.form.get('nome')
            cliente.CPF = request.form.get('cpf')
            cliente.Endereco = request.form.get('endereco')
            cliente.Email = request.form.get('email')
            cliente.Telefone = request.form.get('telefone')
            cliente.Senha = generate_password_hash(request.form.get('senha'))

            db.session.commit()
            flash('Perfil atualizado com sucesso!', 'success')
            return redirect(url_for('home'))

        return render_template('perfil.html', cliente=cliente)
    
    @app.route('/sobre')
    def sobre():
        return render_template('sobre.html')
