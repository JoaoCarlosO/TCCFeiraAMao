from flask import render_template, request, redirect, url_for, flash
from models.database import Cliente, MensagemSuporte, db, Vendedor, Feira
from werkzeug.security import generate_password_hash, check_password_hash

def init_app(app):
    @app.route('/')
    def home():
        return render_template('home.html')

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

            return redirect(url_for('homeCli'))

        return render_template('login.html')

    @app.route('/cadastro', methods=['GET', 'POST'])
    def cadastro():
        if request.method == 'POST':
            nome = request.form.get('nome')
            telefone = request.form.get('telefone')
            email = request.form.get('email')
            endereco = request.form.get('endereco')
            nascimento = request.form.get('nascimento')
            cpf = request.form.get('cpf')
            senha = generate_password_hash(request.form.get('senha'))

            novo_cliente = Cliente(
                nome, telefone, nascimento, endereco, email, cpf, senha)

            try:
                db.session.add(novo_cliente)
                db.session.commit()
                flash('Cadastro realizado com sucesso!', 'success')
            except Exception as e:
                db.session.rollback()
                flash(f'Erro no cadastro: {e}', 'error')

            return redirect(url_for('homeCli'))

        return render_template('cadastro.html')

    @app.route('/cadastroVend', methods=['GET', 'POST'])
    def cadastroVend():
        if request.method == 'POST':
            nome = request.form.get('nome')
            telefone = request.form.get('telefone')
            email = request.form.get('email')
            endereco = request.form.get('endereco')
            nascimento = request.form.get('nascimento')
            cpf = request.form.get('cpf')
            senha = generate_password_hash(request.form.get('senha'))

            novo_cliente = Cliente(
                nome, telefone, nascimento, endereco, email, cpf, senha)

            try:
                db.session.add(novo_cliente)
                db.session.commit()
                flash('Cadastro realizado com sucesso!', 'success')
            except Exception as e:
                db.session.rollback()
                flash(f'Erro no cadastro: {e}', 'error')

            return redirect(url_for('homeVend'))

        return render_template('cadastroVend.html')

    @app.route('/perfil', methods=['GET', 'POST'])
    def perfil():
        cliente = Cliente.query.first()  # Simulando cliente logado

        if request.method == 'POST':
            nome = request.form.get('nome')
            cpf = request.form.get('cpf')
            endereco = request.form.get('endereco')
            email = request.form.get('email')
            telefone = request.form.get('telefone')
            senha = request.form.get('senha')

            if nome:
                cliente.NomeCli = nome
            if cpf:
                cliente.CPF = cpf
            if endereco:
                cliente.Endereco = endereco
            if email:
                cliente.Email = email
            if telefone:
                cliente.Telefone = telefone
            if senha:
                cliente.Senha = generate_password_hash(senha)

            db.session.commit()
            flash('Perfil atualizado com sucesso!', 'success')
            return redirect(url_for('homeCli'))

        return render_template('perfil.html', cliente=cliente)

    @app.route('/perfilCli', methods=['GET', 'POST'])
    def perfilCli():
        cliente = Cliente.query.first()  # Simulando cliente logado

        if request.method == 'POST':
            nome = request.form.get('nome')
            cpf = request.form.get('cpf')
            endereco = request.form.get('endereco')
            email = request.form.get('email')
            telefone = request.form.get('telefone')
            senha = request.form.get('senha')

            if nome:
                cliente.NomeCli = nome
            if cpf:
                cliente.CPF = cpf
            if endereco:
                cliente.Endereco = endereco
            if email:
                cliente.Email = email
            if telefone:
                cliente.Telefone = telefone
            if senha:
                cliente.Senha = generate_password_hash(senha)

            db.session.commit()
            flash('Perfil atualizado com sucesso!', 'success')
            return redirect(url_for('homeCli'))

        return render_template('perfilCli.html', cliente=cliente)

    @app.route('/perfilVend', methods=['GET', 'POST'])
    def perfilVend():
        cliente = Cliente.query.first()  # Simulando cliente logado

        if request.method == 'POST':
            nome = request.form.get('nome')
            cpf = request.form.get('cpf')
            endereco = request.form.get('endereco')
            email = request.form.get('email')
            telefone = request.form.get('telefone')
            senha = request.form.get('senha')

            if nome:
                cliente.NomeCli = nome
            if cpf:
                cliente.CPF = cpf
            if endereco:
                cliente.Endereco = endereco
            if email:
                cliente.Email = email
            if telefone:
                cliente.Telefone = telefone
            if senha:
                cliente.Senha = generate_password_hash(senha)

            db.session.commit()
            flash('Perfil atualizado com sucesso!', 'success')
            return redirect(url_for('homeVend'))

        return render_template('perfilVend.html', cliente=cliente)

    @app.route('/sobre')
    def sobre():
        return render_template('sobre.html')

    @app.route('/suporte', methods=['GET', 'POST'])
    def suporte():
        if request.method == 'POST':
            nome = request.form.get('nome')
            email = request.form.get('email')
            mensagem = request.form.get('mensagem')

            if not nome or not email or not mensagem:
                flash('Por favor, preencha todos os campos.', 'danger')
            else:
                nova_msg = MensagemSuporte(
                    nome=nome, email=email, mensagem=mensagem)
                db.session.add(nova_msg)
                db.session.commit()
                flash('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success')
                return redirect(url_for('suporte'))

        return render_template('suporte.html')

    @app.route('/homeCli')
    def homeCli():
        ofertas = [
            {"nome": "Bala de banana com coco 200g", "preco": "12,00", "img": "imgs/produto12.png"},
            {"nome": "Bolsa de Palha ", "preco": "35,00", "img": "imgs/bolsaPalha.png"},
            {"nome": "Pão Caseiro 1kg", "preco": "20,00", "img": "imgs/paoCaseiro.png"},
        ]
        
        return render_template("homeCli.html", ofertas=ofertas)
    @app.route('/homeVend')
    def homeVend():
        return render_template('homeVend.html')

    @app.route('/notificacoesCli')
    def notificacoesCli():
        return render_template('notificacoesCli.html')

    @app.route('/notificacoesVend')
    def notificacoesVend():
        return render_template('notificacoesVend.html')

    @app.route('/encomendasCli')
    def encomendasCli():
        return render_template('encomendasCli.html')

    @app.route('/encomendasVend')
    def encomendasVend():
        return render_template('encomendasVend.html')

    @app.route('/carrinhoCli')
    def carrinhoCli():
        return render_template('carrinhoCli.html')

    @app.route('/carrinhoVend')
    def carrinhoVend():
        return render_template('carrinhoVend.html')

    @app.route('/sobreCli')
    def sobreCli():
        return render_template('sobreCli.html')

    @app.route('/sobreVend')
    def sobreVend():
        return render_template('sobreVend.html')
    
    @app.route('/vendedor/<int:id>')
    def detalhes_vendedor(id):  # Mude o nome da função para evitar conflito
        try:
            vendedor = Vendedor.query.get_or_404(id)
            return render_template('vendedor.html', vendedor=vendedor)
        except Exception as e:
            flash(f'Erro ao carregar perfil do vendedor: {str(e)}', 'error')
            return redirect(url_for('homeCli'))
        
    @app.route('/estoque')
    def estoque():
        return render_template('estoque.html')
